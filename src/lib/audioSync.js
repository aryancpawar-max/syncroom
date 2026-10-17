export function getPlaybackPosition(playback) {
  if (!playback) return 0;

  const basePosition = Number(playback.currentTime) || 0;

  if (!playback.isPlaying || !playback.updatedAt) {
    return basePosition;
  }

  const elapsed = (Date.now() - playback.updatedAt) / 1000;

  return Math.max(0, basePosition + elapsed);
}

export function createPlaybackState(audio, isPlaying) {
  return {
    isPlaying,
    currentTime: audio?.currentTime || 0,
    duration: audio?.duration || 0,
    updatedAt: Date.now(),
    track: audio?.track || null,
  };
}

export function calculateDrift(localTime, expectedTime) {
  return Math.abs(localTime - expectedTime);
}