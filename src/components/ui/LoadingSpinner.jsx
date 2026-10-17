import { LoaderCircle } from "lucide-react";

function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
  size = 24,
}) {
  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 text-sm text-[#A0A6B5] ${
        fullScreen ? "min-h-screen bg-[#20232B]" : "py-8"
      }`}
    >
      <LoaderCircle
        size={size}
        className="animate-spin text-[#A78BFA]"
      />

      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;