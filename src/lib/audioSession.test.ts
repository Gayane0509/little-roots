import { beforeEach, expect, jest, test } from '@jest/globals';
import { PLAYBACK_AUDIO_MODE, RECORDING_AUDIO_MODE, restorePlaybackAudioMode, startAudioSession } from './audioSession';

jest.mock('expo-audio', () => ({ setAudioModeAsync: jest.fn(async () => {}) }));
const audio = jest.requireMock('expo-audio') as { setAudioModeAsync: jest.Mock<(mode: unknown) => Promise<void>> };

beforeEach(() => { audio.setAudioModeAsync.mockClear(); });

test('sets one complete mode: respects the silent switch, mixes, never records or plays in the background', () => {
  startAudioSession();
  expect(audio.setAudioModeAsync).toHaveBeenCalledTimes(1);
  expect(audio.setAudioModeAsync).toHaveBeenCalledWith(PLAYBACK_AUDIO_MODE);
  expect(PLAYBACK_AUDIO_MODE).toEqual({
    playsInSilentMode: false, interruptionMode: 'mixWithOthers', allowsRecording: false, shouldPlayInBackground: false, shouldRouteThroughEarpiece: false,
  });
});
test('a failing audio mode call never throws', async () => {
  audio.setAudioModeAsync.mockRejectedValueOnce(new Error('unavailable'));
  expect(() => startAudioSession()).not.toThrow();
  await Promise.resolve();
});
/** The only files allowed to record (AI_DECISIONS 2026-11-04 "Family voice"): the parent screen and the session. */
const RECORDING_FILES = ['src/app/parent/voice.tsx', 'src/lib/audioSession.ts'];
function sourceFiles(): { path: string; text: string }[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync, readFileSync, statSync } = require('fs') as {
    readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
  };
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
  return files('src').map((path) => ({ path, text: readFileSync(path, 'utf8') }));
}
test('never: speech recognition, text-to-speech, voice services or speaker/mic emoji anywhere in src', () => {
  const banned = /expo-speech|speechRecognition|SpeechRecognition|expo-speech-recognition|@react-native-voice|speechSynthesis|webkitSpeech|🔊|🎙️|🎤/;
  expect(sourceFiles().filter(({ text }) => banned.test(text)).map(({ path }) => path)).toEqual([]);
});
test('recording APIs only on the parent family-voice screen (never in front of the child)', () => {
  const recording = /useAudioRecorder|RecordingPresets|requestRecordingPermissions|allowsRecording:\s*true/;
  expect(sourceFiles().filter(({ path, text }) => recording.test(text) && !RECORDING_FILES.includes(path)).map(({ path }) => path)).toEqual([]);
});
test('the recording mode is separate and the playback mode never records', () => {
  expect(RECORDING_AUDIO_MODE.allowsRecording).toBe(true);
  expect(PLAYBACK_AUDIO_MODE.allowsRecording).toBe(false);
});
test('restoring playback after recording sets the full playback mode', async () => {
  await restorePlaybackAudioMode();
  expect(audio.setAudioModeAsync).toHaveBeenLastCalledWith(PLAYBACK_AUDIO_MODE);
});
