export default function ProgressBar({ value = 0, max = 100, onChange, label = "Playback position" }) {
  return <input aria-label={label} className="range-input" type="range" min="0" max={max || 100} value={Math.min(value, max || 100)} onChange={(event) => onChange?.(Number(event.target.value))} />;
}
