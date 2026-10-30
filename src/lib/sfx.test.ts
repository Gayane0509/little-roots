import { beforeEach, expect, jest, test } from '@jest/globals';
import { playSfx } from './sfx';

const mockPlayer = { volume: 1, seekTo: jest.fn(async (_seconds: number) => {}), play: jest.fn() };
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => mockPlayer) }));
const audio = jest.requireMock('expo-audio') as { createAudioPlayer: jest.Mock };

beforeEach(() => { audio.createAudioPlayer.mockClear(); mockPlayer.seekTo.mockReset(); mockPlayer.seekTo.mockResolvedValue(undefined); mockPlayer.play.mockClear(); });

test('disabled sounds do not create a player', () => {
  playSfx('tap', false);
  expect(audio.createAudioPlayer).not.toHaveBeenCalled();
});
test('a sound reuses its player, rewinds, and plays quietly', async () => {
  playSfx('correct'); playSfx('correct');
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
