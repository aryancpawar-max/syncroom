import { CheckCircle2, Circle, Clock3, Radio } from "lucide-react";

const variants = {
  active: {
    icon: Radio,
    label: "Active",
    className: "bg-[#86D6A3]/10 text-[#86D6A3]",
  },
  waiting: {
    icon: Clock3,
    label: "Waiting",
    className: "bg-amber-400/10 text-amber-300",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "bg-[#A78BFA]/10 text-[#A78BFA]",
  },
  offline: {
    icon: Circle,
    label: "Offline",
    className: "bg-white/5 text-[#737B8D]",
  },
};

function StatusBadge({ status = "active", label }) {
  const variant = variants[status] || variants.offline;
  const Icon = variant.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${variant.className}`}
    >
      <Icon size={13} />
      {label || variant.label}
    </span>
  );
}

export default StatusBadge;