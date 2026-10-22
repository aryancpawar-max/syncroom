
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Music2, Search, Radio } from "lucide-react";

import useAudioPlayer from "../hooks/useAudioPlayer";
import useRoomSocket from "../hooks/useRoomSocket";
import RoomHeader from "../components/ui/RoomHeader";
import Player from "../components/ui/Player";
import UserList from "../components/ui/UserList";
import Queue from "../components/ui/Queue";
import AudioUploader from "../components/ui/AudioUploader";
import useToast from "../hooks/useToast";
import Toast from "../components/ui/Toast";
import ConnectionStatus from "../components/ui/ConnectionStatus";
import ListenerCount from "../components/ui/ListenerCount";
import InviteLink from "../components/ui/InviteLink";
import { getSavedRooms } from "../lib/roomApi";
import { createAudioSignedUrl } from "../lib/audioStorage";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
const [roomLoading, setRoomLoading] = useState(true);
const [remoteQueueReady, setRemoteQueueReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [room, setRoom] = useState(null);

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("syncroom-user") || "null");
    } catch {
      return null;
    }
  });

  const {
    connected,
    listeners: onlineListeners,
    roomState,
    socketError,
    updatePlayback,
    updateQueue,
  } = useRoomSocket(roomId, user);

  const audio = useAudioPlayer({
    roomId,
    onPlaybackChange: updatePlayback,
    onQueueChange: (queue) => {
      updateQueue(
        queue.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration || 0,
          storagePath: track.storagePath || null,
        }))
      );
    },
  });

  const { toast, showToast, hideToast } = useToast();

   useEffect(() => {
  let cancelled = false;

  async function loadRoom() {
    setRoomLoading(true);

    const savedRoom = getSavedRooms().find(
      (item) => item.id === roomId
    );

    if (savedRoom && !cancelled) {
      setRoom(savedRoom);
    }

    try {
      const serverUrl = (
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${serverUrl}/api/rooms/${encodeURIComponent(roomId)}`
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const serverRoom = data.room || data;

        if (!cancelled && serverRoom.id) {
          setRoom((previous) => ({
            ...(previous || {}),
            ...savedRoom,
            ...serverRoom,
          }));
        }
      } else if (response.status === 404 && !savedRoom) {
        if (!cancelled) setRoom(null);
      }
    } catch (error) {
      console.error("Failed to load room:", error);
    } finally {
      if (!cancelled) setRoomLoading(false);
    }
  }

  loadRoom();

  return () => {
    cancelled = true;
  };
}, [roomId]);

useEffect(() => {
  if (!roomState?.room) return;

  setRoom((previous) => ({
    ...(previous || {}),
    ...roomState.room,
  }));
}, [roomState?.room]);

  // Convert shared storage paths into signed URLs for playback.
  useEffect(() => {
    let cancelled = false;

    async function syncRemoteQueue() {
      const remoteQueue = roomState?.queue;
      if (!Array.isArray(remoteQueue)) return;

setRemoteQueueReady(false);

      try {
        const localTracks = audio.queue || [];

        const tracksWithUrls = await Promise.all(
          remoteQueue.map(async (track) => {
            const localTrack = localTracks.find(
              (item) => item.id === track.id
            );

            if (localTrack?.audioUrl) {
              return { ...track, ...localTrack };
            }

            if (track.audioUrl) {
              return track;
            }

            if (track.storagePath) {
              const audioUrl = await createAudioSignedUrl(track.storagePath);
              return { ...track, audioUrl };
            }

            return null;
          })
        );

        if (cancelled) return;

        const validTracks = tracksWithUrls.filter(Boolean);

await audio.applyRemoteQueue(validTracks);

if (!cancelled) {
  setRemoteQueueReady(true);
}
      } catch (error) {
        if (!cancelled) {
          showToast(
            error.message || "Unable to load shared audio.",
            "error"
          );
        }
      }
    }

    syncRemoteQueue();

    return () => {
      cancelled = true;
    };
    // Queue updates are driven by the server's room state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomState?.queue, roomId]);

  // Apply playback updates received from other listeners.
   // Restore playback only after the saved queue is ready.
useEffect(() => {
  if (!remoteQueueReady || !roomState?.playback) return;

  void audio.applyRemotePlayback(roomState.playback);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [roomState?.playback, remoteQueueReady]);

  const listeners = (onlineListeners || []).map((listener) => ({
    ...listener,
    isHost:
      listener.id === room?.hostId ||
      listener.name === room?.host,
    online: true,
  }));

  const filteredTracks = (audio.queue || []).filter((track) =>
    (track.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  async function handleUpload(file) {
    try {
      await audio.addTrack(file);
      showToast(`${file.name} added to the queue.`, "success");
    } catch (error) {
      showToast(error.message || "Audio upload failed.", "error");
    }
  }
  if (roomLoading && !room) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#20232B] text-[#F0F0F5]">
      Loading room...
    </main>
  );
}
  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#20232B] px-4 text-[#F0F0F5]">
        <div className="rounded-3xl bg-[#252933] p-8 text-center shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-6px_-6px_16px_rgba(255,255,255,0.025)]">
          <Music2 size={40} className="mx-auto text-[#A78BFA]" />

          <h1 className="mt-5 text-2xl font-bold">Room not found</h1>

          <p className="mt-3 text-sm text-[#A0A6B5]">
            This room is not saved locally. Open a valid invitation link or
            create a room.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-[#A78BFA] px-5 py-3 font-semibold text-[#20232B]"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#20232B] text-[#F0F0F5]">
      <Toast toast={toast} onClose={hideToast} />

      {socketError && (
        <div
          role="alert"
          className="mx-auto mt-4 max-w-7xl rounded-xl bg-red-500/10 p-4 text-sm text-red-400"
        >
          {typeof socketError === "string"
            ? socketError
            : socketError.message}
        </div>
      )}

      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        hostName={room.host || "Music Lover"}
        isHost={user?.id === room.hostId || user?.name === room.host}
        onLeave={() => navigate("/dashboard")}
      />

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-[#252933] p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-6px_-6px_16px_rgba(255,255,255,0.025)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <ConnectionStatus connected={connected} />

              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                {room.name}
              </h1>

              <p className="mt-2 text-sm text-[#A0A6B5]">
                {room.description || "Your shared music space."}
              </p>
            </div>

            <ListenerCount listeners={listeners} />
          </div>

          <div className="mt-6">
            <InviteLink roomId={room.id} />
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Radio size={19} className="text-[#A78BFA]" />
                Now playing
              </h2>

              <Player
                track={audio.track}
                isPlaying={audio.isPlaying}
                currentTime={audio.currentTime}
                duration={audio.duration}
                volume={audio.volume}
                onVolumeChange={audio.changeVolume}
                onPlayPause={audio.togglePlay}
                onNext={audio.playNext}
                onPrevious={audio.playPrevious}
                onSeek={audio.seek}
              />

              {audio.error && (
                <p role="alert" className="mt-3 text-sm text-red-400">
                  {audio.error}
                </p>
              )}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Add music</h2>
                <p className="mt-1 text-sm text-[#A0A6B5]">
                  Select audio files from your device.
                </p>
              </div>

              <AudioUploader onUpload={handleUpload} />

              <label className="flex items-center gap-3 rounded-xl bg-[#252933] px-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
                <Search size={18} className="text-[#737B8D]" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search your queue..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#737B8D]"
                />
              </label>

              {searchQuery && (
                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() =>
                        audio.playIndex(
                          audio.queue.findIndex(
                            (item) => item.id === track.id
                          )
                        )
                      }
                      className="w-full rounded-xl bg-[#252933] p-3 text-left text-sm shadow-[5px_5px_10px_rgba(0,0,0,0.25),_-5px_-5px_10px_rgba(255,255,255,0.02)]"
                    >
                      <span className="font-medium">{track.title}</span>

                      <span className="ml-2 text-xs text-[#A0A6B5]">
                        {track.artist}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <UserList
              users={listeners}
              hostId={room.hostId || listeners[0]?.id || ""}
              currentUserId={user?.id || "local-user"}
            />

            <Queue
              tracks={audio.queue}
              currentTrackId={audio.track?.id}
              onPlayTrack={(_, index) => audio.playIndex(index)}
              onRemoveTrack={audio.removeTrack}
            />
          </aside>
        </div>

        <footer className="border-t border-white/[0.05] py-5 text-center text-xs text-[#737B8D]">
          SyncRoom · Real-time room connection
        </footer>
      </div>
    </main>
  );
}

export default Room;
