import { setAudioModeAsync, type AudioMode } from 'expo-audio';

/**
 * Playback session for the whole app: short optional effects and family-voice word recordings (AI_DECISIONS
 * 2026-11-04 "Family voice"). They respect the iOS silent switch, mix with a parent's music instead of pausing it
 * and never play in the background. Only the parent recording screen switches to `RECORDING_AUDIO_MODE`, and
 * restores this mode when it stops.
 */
export const PLAYBACK_AUDIO_MODE: AudioMode = {
  playsInSilentMode: false,
  interruptionMode: 'mixWithOthers',
  allowsRecording: false,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
};

/** Sets the playback session once at startup. iOS rebuilds the whole mode on each call, so always pass a full mode. */
export function startAudioSession(): void {
  void setAudioModeAsync(PLAYBACK_AUDIO_MODE).catch(() => { /* Sound effects are optional. */ });
}

/** Parent recording screen only, while a word is being recorded. */
export const RECORDING_AUDIO_MODE: AudioMode = { ...PLAYBACK_AUDIO_MODE, playsInSilentMode: true, allowsRecording: true, interruptionMode: 'doNotMix' };

export async function restorePlaybackAudioMode(): Promise<void> {
  await setAudioModeAsync(PLAYBACK_AUDIO_MODE).catch(() => { /* Sound is optional. */ });
}
