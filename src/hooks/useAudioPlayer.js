import { useCallback, useEffect, useRef, useState } from "react";
import {
  uploadAudio,
  createAudioSignedUrl,
} from "../lib/audioStorage";

function useAudioPlayer({
  roomId,
  onPlaybackChange,
  onQueueChange,
} = {}) {
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const repeatRef = useRef(false);
  const onPlaybackChangeRef = useRef(onPlaybackChange);
  const onQueueChangeRef = useRef(onQueueChange);
  const applyingRemoteRef = useRef(false);
  const roomIdRef = useRef(roomId);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onPlaybackChangeRef.current = onPlaybackChange;
    onQueueChangeRef.current = onQueueChange;
    roomIdRef.current = roomId;
  }, [onPlaybackChange, onQueueChange, roomId]);

  const publishQueue = useCallback((nextQueue, { remote = false } = {}) => {
    queueRef.current = nextQueue;
    setQueue(nextQueue);

    if (!remote && !applyingRemoteRef.current) {
      onQueueChangeRef.current?.(
        nextQueue.map(
          ({ id, title, artist, duration, storagePath }) => ({
            id,
            title,
            artist,
            duration,
            storagePath: storagePath || null,
          })
        )
      );
    }
  }, []);

  const emitPlayback = useCallback((overrides = {}) => {
    if (applyingRemoteRef.current) return;

    const audio = audioRef.current;
    const activeTrack = queueRef.current[currentIndexRef.current];

    onPlaybackChangeRef.current?.({
      trackId: activeTrack?.id || null,
      title: activeTrack?.title || null,
      artist: activeTrack?.artist || null,
      isPlaying: audio ? !audio.paused : false,
      currentTime: audio?.currentTime || 0,
      ...overrides,
    });
  }, []);

  const playIndex = useCallback(async (index) => {
    const audio = audioRef.current;
    const tracks = queueRef.current;

    if (!audio || index < 0 || index >= tracks.length) return;

    const nextTrack = tracks[index];
    let source = nextTrack?.audioUrl || nextTrack?.objectUrl;

    if (!source && nextTrack?.storagePath) {
      try {
        source = await createAudioSignedUrl(nextTrack.storagePath);

        const updatedQueue = queueRef.current.map((item) =>
          item.id === nextTrack.id ? { ...item, audioUrl: source } : item
        );

        publishQueue(updatedQueue, { remote: true });
      } catch (err) {
        setError(err.message || "Unable to access this audio file.");
        return;
      }
    }

    if (!source) {
      setError("This track has no playable audio URL.");
      return;
    }

    setError("");
    currentIndexRef.current = index;
    setCurrentIndex(index);
    setTrack({ ...nextTrack, audioUrl: source });
    setCurrentTime(0);
    setDuration(nextTrack.duration || 0);

    if (audio.src !== source) {
      audio.src = source;
      audio.load();
    } else {
      audio.currentTime = 0;
    }

    try {
      await audio.play();

      emitPlayback({
        trackId: nextTrack.id,
        title: nextTrack.title,
        artist: nextTrack.artist,
        isPlaying: true,
        currentTime: 0,
      });
    } catch {
      setIsPlaying(false);
      setError("Playback failed. Press Play to try again.");
    }
  }, [emitPlayback, publishQueue]);

  const playNext = useCallback(() => {
    const tracks = queueRef.current;
    const index = currentIndexRef.current;

    if (!tracks.length) return;

    if (index < tracks.length - 1) {
      void playIndex(index + 1);
    } else if (repeatRef.current) {
      void playIndex(0);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
      emitPlayback({ isPlaying: false });
    }
  }, [playIndex, emitPlayback]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    const index = currentIndexRef.current;

    if (!queueRef.current.length) return;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      emitPlayback({ currentTime: 0 });
      return;
    }

    void playIndex(index > 0 ? index - 1 : 0);
  }, [playIndex, emitPlayback]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    const updateTime = () => setCurrentTime(audio.currentTime);

    const updateDuration = () => {
      const nextDuration = Number.isFinite(audio.duration)
        ? audio.duration
        : 0;

      setDuration(nextDuration);

      const index = currentIndexRef.current;
      const activeTrack = queueRef.current[index];

      if (activeTrack && activeTrack.duration !== nextDuration) {
        const updatedQueue = queueRef.current.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, duration: nextDuration }
            : item
        );

        publishQueue(updatedQueue);
        setTrack(updatedQueue[index]);
      }
    };

    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        emitPlayback({ currentTime: 0, isPlaying: true });
        return;
      }

      const nextIndex = currentIndexRef.current + 1;

      if (nextIndex < queueRef.current.length) {
        void playIndex(nextIndex);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        emitPlayback({ isPlaying: false, currentTime: 0 });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = () => {
      if (audio.src) {
        setIsPlaying(false);
        setError("Unable to play this audio file. Check its storage access.");
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
    // Create the audio element once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTrack = useCallback(async (file) => {
    if (!file || !file.type.startsWith("audio/")) {
      throw new Error("Please select a valid audio file.");
    }

    if (!roomIdRef.current) {
      throw new Error("Join or create a room before uploading audio.");
    }

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadAudio(file, roomIdRef.current);

      const newTrack = {
        id: uploaded.storagePath,
        title: uploaded.title,
        artist: uploaded.artist,
        duration: uploaded.duration || 0,
        audioUrl: uploaded.audioUrl,
        storagePath: uploaded.storagePath,
      };

      publishQueue([...queueRef.current, newTrack]);
      return newTrack;
    } catch (err) {
      setError(err?.message || "Audio upload failed.");
      throw err;
    } finally {
      setUploading(false);
    }
  }, [publishQueue]);

  const removeTrack = useCallback((id) => {
    const index = queueRef.current.findIndex((item) => item.id === id);
    if (index === -1) return;

    const audio = audioRef.current;
    const current = currentIndexRef.current;

    if (index === current) {
      audio?.pause();
      audio?.removeAttribute("src");
      setTrack(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      currentIndexRef.current = -1;
      setCurrentIndex(-1);

      emitPlayback({
        trackId: null,
        title: null,
        artist: null,
        isPlaying: false,
        currentTime: 0,
      });
    }

    const updatedQueue = queueRef.current.filter((item) => item.id !== id);

    if (index < current) {
      currentIndexRef.current = current - 1;
      setCurrentIndex(current - 1);
    }

    publishQueue(updatedQueue);
  }, [emitPlayback, publishQueue]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused && currentIndexRef.current === -1) {
      if (queueRef.current.length) await playIndex(0);
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }

      setError("");
      emitPlayback();
    } catch {
      setError("Playback failed. Please try again.");
    }
  }, [playIndex, emitPlayback]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    audio.currentTime = Math.max(0, Math.min(time, audio.duration));
    setCurrentTime(audio.currentTime);
    emitPlayback({ currentTime: audio.currentTime });
  }, [emitPlayback]);

  const changeVolume = useCallback((value) => {
    const nextVolume = Math.max(0, Math.min(1, value));
    setVolume(nextVolume);

    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((previous) => {
      repeatRef.current = !previous;
      return !previous;
    });
  }, []);

  const applyRemoteQueue = useCallback(async (remoteQueue = []) => {
    applyingRemoteRef.current = true;

    try {
      const previousQueue = queueRef.current;

      const normalizedQueue = await Promise.all(
        remoteQueue
          .filter((item) => item?.id)
          .map(async (item) => {
            const previous = previousQueue.find(
              (trackItem) => trackItem.id === item.id
            );

            let audioUrl = item.audioUrl || previous?.audioUrl || "";

            if (item.storagePath && !previous?.audioUrl) {
              try {
                audioUrl = await createAudioSignedUrl(item.storagePath);
              } catch {
                audioUrl = "";
              }
            }

            return {
              id: item.id,
              title: item.title || "Untitled track",
              artist: item.artist || "Uploaded audio",
              duration: Number(item.duration) || 0,
              audioUrl,
              storagePath: item.storagePath || previous?.storagePath || "",
            };
          })
      );

      const activeId = queueRef.current[currentIndexRef.current]?.id;
      const nextIndex = normalizedQueue.findIndex(
        (item) => item.id === activeId
      );

      publishQueue(normalizedQueue, { remote: true });

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setTrack(nextIndex >= 0 ? normalizedQueue[nextIndex] : null);
    } finally {
      applyingRemoteRef.current = false;
    }
  }, [publishQueue]);

    
const applyRemotePlayback = useCallback(async ({
  trackId,
  isPlaying: remoteIsPlaying,
  currentTime: remoteTime,
} = {}) => {
  const audio = audioRef.current;
  if (!audio) return;

  applyingRemoteRef.current = true;

  try {
    if (!trackId) {
      audio.pause();
      setIsPlaying(false);
      currentIndexRef.current = -1;
      setCurrentIndex(-1);
      setTrack(null);
      setCurrentTime(0);
      return;
    }

    const index = queueRef.current.findIndex(
      (item) => item.id === trackId
    );

    // The queue may not have arrived yet. Don't erase the saved state.
    if (index === -1) {
      console.warn("Saved playback track is not in the queue yet:", trackId);
      return;
    }

    let remoteTrack = queueRef.current[index];
    let source = remoteTrack.audioUrl || remoteTrack.objectUrl || "";

    if (remoteTrack.storagePath) {
      source = await createAudioSignedUrl(remoteTrack.storagePath);
    }

    if (!source) {
      setError("This track has no playable audio URL.");
      return;
    }

    const trackChanged =
      currentIndexRef.current !== index ||
      audio.dataset.trackId !== trackId;

    if (trackChanged) {
      audio.pause();
      currentIndexRef.current = index;
      setCurrentIndex(index);
      setTrack({ ...remoteTrack, audioUrl: source });
      audio.dataset.trackId = trackId;
      audio.src = source;
      audio.load();

      await new Promise((resolve) => {
        if (audio.readyState >= 1) {
          resolve();
          return;
        }

        audio.addEventListener("loadedmetadata", resolve, { once: true });
        audio.addEventListener("error", resolve, { once: true });
      });
    }

    if (Number.isFinite(remoteTime) && Number.isFinite(audio.duration)) {
      const targetTime = Math.max(
        0,
        Math.min(remoteTime, audio.duration)
      );

      if (Math.abs(audio.currentTime - targetTime) > 1) {
        audio.currentTime = targetTime;
      }

      setCurrentTime(audio.currentTime);
    }

    if (remoteIsPlaying) {
      try {
        await audio.play();
      } catch {
        // Browsers may block autoplay until the user interacts.
        setIsPlaying(false);
        setError("Press Play to resume the restored track.");
        return;
      }
    } else {
      audio.pause();
    }

    setDuration(Number.isFinite(audio.duration) ? audio.duration : remoteTrack.duration || 0);
    setIsPlaying(!audio.paused);
    setError("");
  } catch (err) {
    console.error("Playback restoration failed:", err);
    setError("Unable to restore playback. Please try again.");
  } finally {
    applyingRemoteRef.current = false;
  }
}, []);


  return {
    queue,
    track,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    error,
    uploading,
    addTrack,
    removeTrack,
    playIndex,
    playNext,
    playPrevious,
    togglePlay,
    toggleRepeat,
    seek,
    changeVolume,
    applyRemotePlayback,
    applyRemoteQueue,
  };
}

export default useAudioPlayer;