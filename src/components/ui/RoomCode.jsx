import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

function RoomCode({ roomId, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!roomId) return;

    const roomUrl = `${window.location.origin}/join-room?roomId=${encodeURIComponent(roomId)}`;

    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const input = document.createElement("textarea");
        input.value = roomUrl;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const successful = document.execCommand("copy");
        input.remove();

        if (successful) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div
      className={`rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-7px_-7px_14px_rgba(255,255,255,0.025)] ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
          <Link2 size={19} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#F0F0F5]">
            Invite your friends
          </h2>
          <p className="mt-1 text-xs text-[#A0A6B5]">
            Share this room link
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-[#20232B] p-2 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
        <p className="min-w-0 flex-1 truncate px-2 text-xs text-[#A0A6B5] sm:text-sm">
          {roomId || "No room ID available"}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!roomId}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[#A78BFA] px-3 py-2.5 text-xs font-semibold text-[#20232B] transition hover:bg-[#B8A3FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A78BFA]"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {copied && (
        <p role="status" className="mt-3 text-xs text-[#86D6A3]">
          Room link copied to clipboard.
        </p>
      )}
    </div>
  );
}

export default RoomCode;