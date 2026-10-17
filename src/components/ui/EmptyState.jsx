import { Music2, Plus } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  description = "Add something to get started.",
  actionLabel,
  onAction,
  icon: Icon = Music2,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#252933] px-6 py-12 text-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[6px_6px_12px_rgba(0,0,0,0.3),_-6px_-6px_12px_rgba(255,255,255,0.025)]">
        <Icon size={28} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-[#F0F0F5]">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#A0A6B5]">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#20232B] transition hover:bg-[#B8A3FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A78BFA]"
        >
          <Plus size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;