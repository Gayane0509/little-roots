import { beforeEach, expect, jest, test } from '@jest/globals';
import { playSfx, SFX_REPEAT_WINDOW_MS } from './sfx';

const mockPlayer = { volume: 1, seekTo: jest.fn(async (_seconds: number) => {}), play: jest.fn() };
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => mockPlayer) }));
const audio = jest.requireMock('expo-audio') as { createAudioPlayer: jest.Mock };

let clock = 0;
beforeEach(() => { clock += 10_000; jest.spyOn(Date, 'now').mockImplementation(() => clock); audio.createAudioPlayer.mockClear(); mockPlayer.seekTo.mockReset(); mockPlayer.seekTo.mockResolvedValue(undefined); mockPlayer.play.mockClear(); });

test('disabled sounds do not create a player', () => {
  playSfx('tap', false);
  expect(audio.createAudioPlayer).not.toHaveBeenCalled();
});
test('a sound reuses its player, rewinds, and plays quietly', async () => {
  playSfx('correct'); clock += SFX_REPEAT_WINDOW_MS; playSfx('correct');
  await Promise.resolve(); await Promise.resolve();
  expect(audio.createAudioPlayer).toHaveBeenCalledTimes(1);
  expect(mockPlayer.seekTo).toHaveBeenCalledTimes(2);
  expect(mockPlayer.seekTo).toHaveBeenCalledWith(0);
  expect(mockPlayer.play).toHaveBeenCalledTimes(2);
  expect(mockPlayer.volume).toBe(0.6);
});
test('audio failure never throws', async () => {
  mockPlayer.seekTo.mockRejectedValueOnce(new Error('unavailable'));
  expect(() => playSfx('try')).not.toThrow();
  await Promise.resolve(); await Promise.resolve();
});
test('rapid repeats of one cue play once per window; other cues are unaffected', async () => {
  playSfx('tap'); clock += 50; playSfx('tap'); playSfx('flip'); clock += SFX_REPEAT_WINDOW_MS - 51; playSfx('tap');
  await Promise.resolve(); await Promise.resolve();
  expect(mockPlayer.play).toHaveBeenCalledTimes(2);
  clock += 1; playSfx('tap');
  await Promise.resolve(); await Promise.resolve();
  expect(mockPlayer.play).toHaveBeenCalledTimes(3);
});
test('a disabled cue does not start the repeat window', async () => {
  playSfx('star', false); playSfx('star');
  await Promise.resolve(); await Promise.resolve();
  expect(mockPlayer.play).toHaveBeenCalledTimes(1);
});
test('volumes keep the gentle cues quieter', () => {
  playSfx('try');
  expect(mockPlayer.volume).toBe(0.45);
});
