import { beforeEach, expect, jest, test } from '@jest/globals';
import { PLAYBACK_AUDIO_MODE, RECORDING_AUDIO_MODE, restorePlaybackAudioMode, startAudioSession } from './audioSession';

type Listener = (status: string) => void;
const mockListeners: Listener[] = [];
const mockRemove = jest.fn();
jest.mock('react-native', () => ({ AppState: { addEventListener: (_type: string, listener: (status: string) => void) => {
  mockListeners.push(listener);
  return { remove: mockRemove };
} } }));
jest.mock('expo-audio', () => ({ setAudioModeAsync: jest.fn(async () => {}) }));
const audio = jest.requireMock('expo-audio') as { setAudioModeAsync: jest.Mock<(mode: unknown) => Promise<void>> };

beforeEach(() => { mockListeners.length = 0; mockRemove.mockClear(); audio.setAudioModeAsync.mockClear(); });

test('sets the playback session once: silent-switch playback, mixing, no background audio', () => {
  startAudioSession(() => {});
  expect(audio.setAudioModeAsync).toHaveBeenCalledTimes(1);
  expect(audio.setAudioModeAsync).toHaveBeenCalledWith(PLAYBACK_AUDIO_MODE);
  expect(PLAYBACK_AUDIO_MODE).toMatchObject({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
});
test('stops audio only when the app goes to the background', () => {
  const stop = jest.fn();
  startAudioSession(stop);
  mockListeners.forEach((listener) => listener('inactive'));
  mockListeners.forEach((listener) => listener('active'));
  expect(stop).not.toHaveBeenCalled();
  mockListeners.forEach((listener) => listener('background'));
  expect(stop).toHaveBeenCalledTimes(1);
});
test('a failing audio mode call never throws, and cleanup removes the listener', async () => {
  audio.setAudioModeAsync.mockRejectedValueOnce(new Error('unavailable'));
  const cleanup = startAudioSession(() => {});
  await Promise.resolve();
  cleanup();
  expect(mockRemove).toHaveBeenCalledTimes(1);
});
test('recording keeps silent-switch playback; restoring sets the full playback mode', async () => {
  expect(RECORDING_AUDIO_MODE).toEqual({ ...PLAYBACK_AUDIO_MODE, allowsRecording: true });
  await restorePlaybackAudioMode();
  expect(audio.setAudioModeAsync).toHaveBeenCalledWith(PLAYBACK_AUDIO_MODE);
});
test('no code passes a partial inline mode (iOS would reset playsInSilentMode to false)', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync, readFileSync, statSync } = require('fs') as {
    readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
  };
  const join = (...parts: string[]) => parts.join('/');
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
  const offenders = files('src').filter((path) => /setAudioModeAsync\(\s*\{/.test(readFileSync(path, 'utf8')));
  expect(offenders).toEqual([]);
});
