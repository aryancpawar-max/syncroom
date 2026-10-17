import { Wifi, WifiOff, LoaderCircle } from "lucide-react";

function ConnectionStatus({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs ${
        connected
          ? "bg-[#252933] text-emerald-400"
          : "bg-[#252933] text-amber-400"
      }`}
    >
      {connected ? (
        <Wifi size={14} />
      ) : (
        <LoaderCircle size={14} className="animate-spin" />
      )}

      <span>{connected ? "Connected" : "Connecting..."}</span>
    </div>
  );
}

export default ConnectionStatus;