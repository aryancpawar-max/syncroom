import { Music2, ArrowLeft, Users } from "lucide-react";
import CopyButton from "./CopyButton";

function RoomHeader({
  roomName,
  roomId,
  hostName,
  isHost = false,
  onLeave,
}) {
  const roomLink = `${window.location.origin}/join?roomId=${encodeURIComponent(
    roomId
  )}`;

  return (
    <header className="border-b border-white/[0.05] bg-[#252933]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onLeave}
            aria-label="Leave room"
            className="rounded-xl bg-[#20232B] p-3 text-[#A0A6B5] shadow-[4px_4px_8px_rgba(0,0,0,0.25),-4px_-4px_8px_rgba(255,255,255,0.02)] transition hover:text-[#A78BFA]"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#20232B] text-[#A78BFA]">
            <Music2 size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[#F0F0F5]">
              {roomName}
            </h1>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#A0A6B5]">
              <Users size={13} />
              Hosted by {hostName}
              {isHost && (
                <span className="ml-1 rounded-md bg-[#A78BFA]/10 px-2 py-0.5 text-[#A78BFA]">
                  Host
                </span>
              )}
            </p>
          </div>
        </div>

        <CopyButton
          text={roomLink}
          label="Invite friends"
          className="shrink-0"
        />
      </div>
    </header>
  );
}

export default RoomHeader;