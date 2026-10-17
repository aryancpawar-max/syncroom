function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className = "",
}) {
  return (
    <article
      className={`rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-5px_-5px_12px_rgba(255,255,255,0.025)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#A0A6B5]">{title}</p>

          <p className="mt-3 text-3xl font-bold text-[#F0F0F5]">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs text-[#737B8D]">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
            <Icon size={21} />
          </div>
        )}
      </div>
    </article>
  );
}

export default StatCard;