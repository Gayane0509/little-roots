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
const players: Partial<Record<SfxName, Player>> = {};

/** Fire and forget. Separate players let short cues mix with family voice and TTS. */
export function playSfx(name: SfxName, enabled = true): void {
  if (!enabled) return;
  try {
    const player = players[name] ?? createAudioPlayer(sources[name]);
    players[name] = player;
    player.volume = 0.6;
    void Promise.resolve(player.seekTo(0)).then(() => player.play()).catch(() => {});
  } catch { /* Sound is optional; gameplay continues. */ }
}
