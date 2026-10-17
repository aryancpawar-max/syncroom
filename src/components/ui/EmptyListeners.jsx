import { Headphones, Users } from "lucide-react";

function EmptyListeners({ listeners = [] }) {
  if (listeners.length > 0) {
    return (
      <div className="space-y-3">
        {listeners.map((listener) => (
          <div
            key={listener.id}
            className="flex items-center gap-3 rounded-xl bg-[#252933] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20232B] text-[#A78BFA]">
              <Headphones size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#F0F0F5]">
                {listener.name}
              </p>

              <p className="text-xs text-[#737B8D]">
                {listener.id === listener.hostId ? "Host" : "Listening"}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#252933] px-5 py-8 text-center">
      <Users size={28} className="mb-3 text-[#A78BFA]" />

      <p className="text-sm font-medium text-[#F0F0F5]">
        You're the first listener
      </p>

      <p className="mt-2 text-xs leading-5 text-[#A0A6B5]">
        Copy your invitation link and share it with your friends.
      </p>
    </div>
  );
}

export default EmptyListeners;