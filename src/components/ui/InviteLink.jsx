import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

function InviteLink({ roomId }) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/join?roomId=${encodeURIComponent(
    roomId
  )}`;

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy invite link:", error);
    }
  }

  return (
    <div className="rounded-2xl bg-[#252933] p-4 shadow-[7px_7px_14px_rgba(0,0,0,0.25),_-7px_-7px_14px_rgba(255,255,255,0.025)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#F0F0F5]">
        <Share2 size={17} className="text-[#A78BFA]" />
        Invite friends
      </div>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={inviteUrl}
          aria-label="Room invitation link"
          className="min-w-0 flex-1 rounded-xl bg-[#20232B] px-3 py-3 text-xs text-[#A0A6B5] outline-none"
          onFocus={(event) => event.target.select()}
        />

        <button
          type="button"
          onClick={copyInvite}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#A78BFA] px-3 py-3 text-sm font-semibold text-[#20232B] transition hover:bg-[#B8A3FF]"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default InviteLink;