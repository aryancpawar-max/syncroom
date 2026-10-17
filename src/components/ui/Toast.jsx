import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "text-[#86D6A3]",
  error: "text-red-400",
  info: "text-[#A78BFA]",
};

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const Icon = icons[toast.type] || Info;

  return (
    <div
      role="status"
      className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl bg-[#252933] p-4 text-[#F0F0F5] shadow-[8px_8px_20px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.025)]"
    >
      <Icon size={21} className={styles[toast.type] || styles.info} />

      <p className="flex-1 text-sm">{toast.message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="rounded-lg p-1 text-[#737B8D] transition hover:text-[#F0F0F5]"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default Toast;