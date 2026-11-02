import { setAudioModeAsync, type AudioMode } from 'expo-audio';
import { AppState } from 'react-native';

/**
 * Playback session for the whole app (see AI_DECISIONS 2026-11-02 "Audio session").
 * Words are the lesson itself, so they play even with the iOS silent switch on; we mix with other apps
 * instead of pausing a parent's music, and never keep playing in the background.
 * The parent voices screen switches recording on and back off on top of this.
 */
export const PLAYBACK_AUDIO_MODE: AudioMode = {
  playsInSilentMode: true,
  interruptionMode: 'mixWithOthers',
  allowsRecording: false,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
};
/**
 * iOS rebuilds the whole mode on every call and fills omitted fields with native defaults (`playsInSilentMode`
 * false), so a partial `{ allowsRecording: false }` would let the silent switch mute words again.
 * Always pass one of these complete modes.
 */
export const RECORDING_AUDIO_MODE: AudioMode = { ...PLAYBACK_AUDIO_MODE, allowsRecording: true };

export function restorePlaybackAudioMode(): Promise<void> {
  return setAudioModeAsync(PLAYBACK_AUDIO_MODE);
}

/** Sets the playback session once and stops speech/word audio when the app goes to the background. */
export function startAudioSession(stopAudio: () => void): () => void {
  void restorePlaybackAudioMode().catch(() => { /* Sound is optional; defaults still play. */ });
  const subscription = AppState.addEventListener('change', (status) => {
    if (status === 'background') stopAudio();
  });
  return () => subscription.remove();
}
