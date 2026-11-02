import { createAudioPlayer } from 'expo-audio';

type SfxName = 'correct' | 'try' | 'reward' | 'flip' | 'tap' | 'star';
type Player = ReturnType<typeof createAudioPlayer>;

// Static require calls let Metro bundle these sounds for offline use.
const sources: Record<SfxName, number> = {
  correct: require('../../assets/sounds/correct.wav'),
  try: require('../../assets/sounds/try.wav'),
  reward: require('../../assets/sounds/reward.wav'),
  flip: require('../../assets/sounds/flip.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  star: require('../../assets/sounds/star.wav'),
};
// Files are mastered near -21 dB RMS (tap.wav is ~3 dB softer). Frequent cues and "try again" sit lower so feedback
// stays gentle and never sounds like a scolding.
const volumes: Record<SfxName, number> = { correct: 0.6, try: 0.45, reward: 0.6, flip: 0.5, tap: 0.6, star: 0.6 };
/** Rapid taps replay the same cue at most once per window, so mashing a button doesn't stack noise. */
export const SFX_REPEAT_WINDOW_MS = 120;
const players: Partial<Record<SfxName, Player>> = {};
const lastPlayedAt: Partial<Record<SfxName, number>> = {};

/** Fire and forget. Separate players let short cues mix with family voice and TTS. */
export function playSfx(name: SfxName, enabled = true): void {
  if (!enabled) return;
  const now = Date.now();
  const last = lastPlayedAt[name];
  if (last !== undefined && now - last < SFX_REPEAT_WINDOW_MS) return;
  lastPlayedAt[name] = now;
  try {
    const player = players[name] ?? createAudioPlayer(sources[name]);
    players[name] = player;
    player.volume = volumes[name];
    void Promise.resolve(player.seekTo(0)).then(() => player.play()).catch(() => {});
  } catch { /* Sound is optional; gameplay continues. */ }
}
