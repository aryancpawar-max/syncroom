
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
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const controlClass =
    "flex h-12 w-12 items-center justify-center rounded-full " +
    "bg-[#252933] text-[#A0A6B5] " +
    "shadow-[4px_4px_9px_rgba(0,0,0,0.28),-3px_-3px_8px_rgba(255,255,255,0.025)] " +
    "transition active:scale-95 hover:text-[#A78BFA] " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A78BFA] " +
    "disabled:opacity-35";

  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/[0.04] bg-[#252933] p-4 shadow-[8px_8px_18px_rgba(0,0,0,0.25),-5px_-5px_14px_rgba(255,255,255,0.018)] sm:rounded-3xl sm:p-6">
      {/* Mobile artwork and track information */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:gap-4 sm:text-left">
        <div className="relative mb-5 aspect-square w-full max-w-[220px] overflow-hidden rounded-[26px] bg-[#20232B] shadow-[8px_8px_18px_rgba(0,0,0,0.3),-5px_-5px_14px_rgba(255,255,255,0.025)] sm:mb-0 sm:h-16 sm:w-16 sm:max-w-none sm:shrink-0 sm:rounded-2xl">
          {track?.artwork ? (
            <img
              src={track.artwork}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#A78BFA]">
              <Music2 size={54} strokeWidth={1.2} className="sm:h-7 sm:w-7" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/[0.035]" />
        </div>

        <div className="w-full min-w-0 sm:flex-1">
          <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlaying ? "bg-[#A78BFA]" : "bg-[#737B8D]"
              }`}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA]">
              {isPlaying ? "Now playing" : track ? "Currently selected" : "Ready to play"}
            </p>
          </div>

          <h3
            title={track?.title || "Nothing playing"}
            className="truncate text-lg font-bold tracking-tight text-[#F0F0F5] sm:text-base"
          >
            {track?.title || "Nothing playing"}
          </h3>

          <p className="mt-1 truncate text-sm text-[#A0A6B5]">
            {track?.artist || "Choose a track from your queue"}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-7 sm:mt-6">
        <ProgressBar
          progress={progress}
          onSeek={(value) => {
            if (duration > 0) onSeek?.((value / 100) * duration);
          }}
          disabled={!track || duration <= 0}
        />

        <div className="mt-2.5 flex justify-between font-mono text-[11px] tabular-nums text-[#A0A6B5]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="mt-6 flex items-center justify-center gap-7 sm:gap-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!track}
          aria-label="Previous track"
          className={controlClass}
        >
          <SkipBack size={20} />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          disabled={!track}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-[#A78BFA] text-[#20232B] shadow-[5px_5px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.035)] transition duration-200 hover:bg-[#B8A3FF] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A78BFA] disabled:opacity-40 sm:h-14 sm:w-14"
        >
          {isPlaying ? (
            <Pause size={26} fill="currentColor" />
          ) : (
            <Play size={26} fill="currentColor" className="ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!track}
          aria-label="Next track"
          className={controlClass}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume control */}
      <div className="mt-7 rounded-2xl bg-[#20232B]/70 px-3 py-2.5 shadow-[inset_3px_3px_7px_rgba(0,0,0,0.2),inset_-3px_-3px_7px_rgba(255,255,255,0.015)] sm:mt-6 sm:bg-transparent sm:p-0 sm:shadow-none">
        <div className="flex items-center gap-3">
          {volume > 0 ? (
            <Volume2 size={18} className="shrink-0 text-[#A0A6B5]" />
          ) : (
            <VolumeX size={18} className="shrink-0 text-[#A0A6B5]" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
            aria-label="Volume"
            className="h-8 min-w-0 flex-1 cursor-pointer accent-[#A78BFA]"
          />

          <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-[#A0A6B5]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </section>
  );
}

export default Player;
