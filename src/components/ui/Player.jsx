import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
} from "lucide-react";

import ProgressBar from "./ProgressBar";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function Player({
  track,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 0.75,
  onVolumeChange,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-7px_-7px_14px_rgba(255,255,255,0.025)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
            {track?.artwork ? (
              <img src={track.artwork} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <Music2 size={25} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[#F0F0F5]">
              {track?.title || "Nothing playing"}
            </h3>
            <p className="mt-1 truncate text-xs text-[#A0A6B5]">
              {track?.artist || "Choose a track to get started"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!track}
            aria-label="Previous track"
            className="rounded-xl p-2 text-[#A0A6B5] hover:text-[#A78BFA] disabled:opacity-40"
          >
            <SkipBack size={20} />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            disabled={!track}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A78BFA] text-[#20232B] transition hover:bg-[#B8A3FF] disabled:opacity-40"
          >
            {isPlaying ? <Pause size={21} /> : <Play size={21} />}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!track}
            aria-label="Next track"
            className="rounded-xl p-2 text-[#A0A6B5] hover:text-[#A78BFA] disabled:opacity-40"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          {volume > 0 ? (
            <Volume2 size={18} className="text-[#A0A6B5]" />
          ) : (
            <VolumeX size={18} className="text-[#A0A6B5]" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
            aria-label="Volume"
            className="w-full accent-[#A78BFA]"
          />
        </div>

        <div className="hidden w-28 items-center gap-3 sm:flex">
          {volume > 0 ? (
            <Volume2 size={18} className="text-[#A0A6B5]" />
          ) : (
            <VolumeX size={18} className="text-[#A0A6B5]" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
            aria-label="Volume"
            className="w-full accent-[#A78BFA]"
          />
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar
          progress={progress}
          onSeek={(value) => {
            if (duration > 0) onSeek?.((value / 100) * duration);
          }}
          disabled={!track || duration <= 0}
        />

        <div className="mt-2 flex justify-between text-xs text-[#737B8D]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </section>
  );
}

export default Player;