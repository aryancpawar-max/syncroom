import { useState } from "react";
import { Check, Copy } from "lucide-react";

function CopyButton({
  text,
  label = "Copy",
  onCopied,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);
      onCopied?.();

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      onCopied?.("Copy failed. Please copy the text manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#252933] px-4 py-3 text-sm font-medium text-[#F0F0F5] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(255,255,255,0.02)] transition hover:text-[#A78BFA] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)] ${className}`}
    >
      {copied ? (
        <Check size={16} className="text-[#86D6A3]" />
      ) : (
        <Copy size={16} />
      )}

      {copied ? "Copied!" : label}
    </button>
  );
}

export default CopyButton;