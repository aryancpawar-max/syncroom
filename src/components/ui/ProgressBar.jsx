function ProgressBar({
  progress = 0,
  onSeek,
  disabled = false,
  className = "",
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  function handleChange(event) {
    onSeek?.(Number(event.target.value));
  }

  return (
    <div className={`w-full ${className}`}>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={safeProgress}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Playback progress"
        style={{
          background: `linear-gradient(to right, #A78BFA ${safeProgress}%, #20232B ${safeProgress}%)`,
        }}
        className="
          h-2 w-full cursor-pointer appearance-none rounded-full
          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.35)]
          accent-[#A78BFA]
          disabled:cursor-not-allowed disabled:opacity-50
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-[#A78BFA]
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-[#A78BFA]
          [&::-webkit-slider-thumb]:bg-[#F0F0F5]
          [&::-webkit-slider-thumb]:shadow-[2px_2px_5px_rgba(0,0,0,0.4)]
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-[#A78BFA]
          [&::-moz-range-thumb]:bg-[#F0F0F5]
        "
      />
    </div>
  );
}

export default ProgressBar;