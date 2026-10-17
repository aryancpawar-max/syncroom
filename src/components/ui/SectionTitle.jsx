function SectionTitle({
  title,
  subtitle,
  icon: Icon,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#252933] text-[#A78BFA] shadow-[4px_4px_8px_rgba(0,0,0,0.25),-4px_-4px_8px_rgba(255,255,255,0.02)]">
            <Icon size={20} />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-[#F0F0F5] sm:text-xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-[#A0A6B5]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SectionTitle;