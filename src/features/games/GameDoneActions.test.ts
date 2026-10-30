import { expect, test } from '@jest/globals';
import { FREE_LIMITS } from '@/lib/entitlements';
import { canReplayGame } from './gameDone';

test('free replay stops at the daily limit while Premium can continue', () => {
  expect(canReplayGame(false, FREE_LIMITS.gamesPerDay - 1)).toBe(true);
  expect(canReplayGame(false, FREE_LIMITS.gamesPerDay)).toBe(false);
  expect(canReplayGame(true, FREE_LIMITS.gamesPerDay)).toBe(true);
});
