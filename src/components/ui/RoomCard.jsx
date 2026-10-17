import { ArrowUpRight, Headphones, Music2, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";

function RoomCard({
  room,
  onOpen,
  listenerCount = 0,
}) {
  return (
    <article className="group rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-5px_-5px_12px_rgba(255,255,255,0.025)] transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#20232B] text-[#A78BFA]">
          <Music2 size={23} />
        </div>

        <StatusBadge status="active" />
      </div>

      <h3 className="mt-5 truncate text-lg font-semibold text-[#F0F0F5]">
        {room.name}
      </h3>

      <p className="mt-2 min-h-10 text-sm leading-5 text-[#A0A6B5]">
        {room.description || "A space to enjoy music together."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#737B8D]">
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          {listenerCount} listeners
        </span>

        <span className="flex items-center gap-1.5">
          <Headphones size={14} />
          Shared room
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(room)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#20232B] px-4 py-3 text-sm font-semibold text-[#A78BFA] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)] transition hover:bg-[#2B2F3A]"
      >
        Open room
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

export default RoomCard;