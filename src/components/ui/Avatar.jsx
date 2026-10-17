import { User } from "lucide-react";

function Avatar({
  src,
  name = "User",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  return (
    <div
      className={`
        ${sizes[size] || sizes.md}
        flex shrink-0 items-center justify-center
        overflow-hidden rounded-full
        bg-[#252933]
        text-[#A78BFA]
        shadow-[5px_5px_10px_rgba(0,0,0,0.35),_-5px_-5px_10px_rgba(255,255,255,0.035)]
        ${className}
      `}
      title={name}
      role="img"
      aria-label={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : name ? (
        name.charAt(0).toUpperCase()
      ) : (
        <User size={20} />
      )}
    </div>
  );
}

export default Avatar;