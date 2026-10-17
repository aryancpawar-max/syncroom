import { AlertTriangle, X } from "lucide-react";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-3xl bg-[#252933] p-6 text-[#F0F0F5] shadow-[10px_10px_25px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.025)]"
      >
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[#20232B] ${
              danger ? "text-red-400" : "text-[#A78BFA]"
            }`}
          >
            <AlertTriangle size={23} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-[#737B8D] hover:text-[#F0F0F5]"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-5 text-xl font-bold"
        >
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#A0A6B5]">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-[#20232B] px-4 py-3 text-sm font-medium text-[#A0A6B5] transition hover:text-[#F0F0F5]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              danger
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-[#A78BFA] text-[#20232B] hover:bg-[#B8A3FF]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;