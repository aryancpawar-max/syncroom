import { Music2, Play, Trash2, ListMusic } from "lucide-react";

function Queue({
  tracks = [],
  currentTrackId,
  onPlayTrack,
  onRemoveTrack,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-7px_-7px_14px_rgba(255,255,255,0.025)] ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
            <ListMusic size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-[#F0F0F5]">Up next</h2>
            <p className="mt-1 text-xs text-[#737B8D]">
              Your listening queue
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#20232B] px-3 py-1.5 text-xs text-[#A78BFA]">
          {tracks.length}
        </span>
      </div>

      {tracks.length ? (
        <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
          {tracks.map((track, index) => {
            const active = track.id === currentTrackId;

            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  active
                    ? "bg-[#20232B] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)]"
                    : "hover:bg-[#20232B]/50"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#20232B] text-[#A78BFA]">
                  <Music2 size={19} />
                </div>

                <button
                  type="button"
                  onClick={() => onPlayTrack?.(track, index)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className={`truncate text-sm font-medium ${
                    active ? "text-[#A78BFA]" : "text-[#F0F0F5]"
                  }`}>
                    {track.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#737B8D]">
                    {track.artist}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onPlayTrack?.(track, index)}
                  aria-label={`Play ${track.title}`}
                  className="rounded-lg p-2 text-[#A0A6B5] hover:text-[#A78BFA]"
                >
                  <Play size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveTrack?.(track.id)}
                  aria-label={`Remove ${track.title}`}
                  className="rounded-lg p-2 text-[#737B8D] hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-[#20232B] px-4 py-8 text-center">
          <Music2 size={28} className="mx-auto text-[#737B8D]" />
          <p className="mt-3 text-sm text-[#A0A6B5]">
            Your queue is empty
          </p>
          <p className="mt-1 text-xs text-[#737B8D]">
            Add audio files to start listening.
          </p>
        </div>
      )}
    </section>
  );
}

export default Queue;