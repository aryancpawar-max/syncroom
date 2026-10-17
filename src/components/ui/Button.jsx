const variants = {
  primary: "text-[#A78BFA]",
  secondary: "text-[#A0A6B5]",
  danger: "text-red-400",
};

function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        rounded-2xl
        px-5 py-3
        font-medium
        bg-[#252933]
        shadow-[7px_7px_14px_rgba(0,0,0,0.35),_-7px_-7px_14px_rgba(255,255,255,0.035)]
        transition-all duration-200
        hover:brightness-110
        active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.30),_inset_-4px_-4px_8px_rgba(255,255,255,0.025)]
        active:translate-y-px
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#A78BFA]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;