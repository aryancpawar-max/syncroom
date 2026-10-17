import { Music2, Play, Plus, Clock3 } from "lucide-react";

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function TrackCard({
  track,
  onPlay,
  onAdd,
  className = "",
}) {
  if (!track) return null;

  return (
    <article
      className={`group rounded-2xl bg-[#252933] p-4 shadow-[6px_6px_12px_rgba(0,0,0,0.3),_-6px_-6px_12px_rgba(255,255,255,0.025)] transition hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#20232B] text-[#A78BFA]">
          {track.artwork ? (
            <img
              src={track.artwork}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Music2 size={25} />
          )}

          {onPlay && (
            <button
              type="button"
              onClick={() => onPlay(track)}
              aria-label={`Play ${track.title || "track"}`}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Play size={22} />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[#F0F0F5]">
            {track.title || "Unknown track"}
          </h3>

          <p className="mt-1 truncate text-xs text-[#A0A6B5]">
            {track.artist || "Unknown artist"}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#737B8D]">
            <Clock3 size={12} />
            {formatDuration(track.duration)}
          </div>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(track)}
            aria-label={`Add ${track.title || "track"} to queue`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#252933] text-[#A78BFA] shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.025)] transition hover:text-[#B8A3FF] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-[#A78BFA]"
          >
            <Plus size={19} />
          </button>
        )}
      </div>
    </article>
  );
}

export default TrackCard;