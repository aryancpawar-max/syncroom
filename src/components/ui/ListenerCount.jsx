import { Users } from "lucide-react";

function ListenerCount({ listeners = [] }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-[#252933] px-4 py-3 text-sm text-[#A0A6B5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
      <Users size={17} className="text-[#A78BFA]" />

      <span>
        {listeners.length}{" "}
        {listeners.length === 1 ? "listener" : "listeners"}
      </span>
    </div>
  );
}

export default ListenerCount;