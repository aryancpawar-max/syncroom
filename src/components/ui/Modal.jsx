import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="
          w-full max-w-lg rounded-3xl
          bg-[#252933] p-6 sm:p-8
          text-[#F0F0F5]
          shadow-[12px_12px_24px_rgba(0,0,0,0.45),_-6px_-6px_16px_rgba(255,255,255,0.025)]
        "
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              rounded-xl p-2 text-[#A0A6B5]
              shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.025)]
              transition
              hover:text-[#A78BFA]
              active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]
              focus-visible:outline-2
              focus-visible:outline-[#A78BFA]
            "
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;