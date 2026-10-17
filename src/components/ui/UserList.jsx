import { Crown, Users, Circle } from "lucide-react";
import Avatar from "./Avatar";

function UserList({
  users = [],
  hostId,
  currentUserId,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-7px_-7px_14px_rgba(255,255,255,0.025)] ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
            <Users size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-[#F0F0F5]">Listeners</h2>
            <p className="mt-1 text-xs text-[#737B8D]">
              Everyone in this room
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#20232B] px-3 py-1.5 text-xs text-[#A78BFA]">
          {users.length}
        </span>
      </div>

      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => {
            const userId = user.id ?? user.userId;
            const isHost = userId === hostId || user.isHost;
            const isCurrentUser = userId === currentUserId;

            return (
              <div
                key={userId ?? user.name}
                className="flex items-center gap-3 rounded-xl bg-[#252933] p-3 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.015)]"
              >
                <Avatar
                  src={user.avatar}
                  name={user.name || "Listener"}
                  size="md"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#F0F0F5]">
                    {user.name || "Listener"}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-[#737B8D]">
                        (You)
                      </span>
                    )}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <Circle
                      size={7}
                      fill={user.online === false ? "#737B8D" : "#86D6A3"}
                      stroke="none"
                    />
                    <span className="text-xs text-[#737B8D]">
                      {user.online === false ? "Offline" : "Listening"}
                    </span>
                  </div>
                </div>

                {isHost && (
                  <span
                    title="Room host"
                    className="flex items-center gap-1 rounded-lg bg-[#A78BFA]/10 px-2 py-1.5 text-xs text-[#A78BFA]"
                  >
                    <Crown size={14} />
                    <span className="hidden sm:inline">Host</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center">
          <Users size={28} className="mx-auto text-[#737B8D]" />
          <p className="mt-3 text-sm text-[#A0A6B5]">
            No listeners yet
          </p>
        </div>
      )}
    </section>
  );
}

export default UserList;