import { describe, expect, it } from '@jest/globals';

import { canPlayGame, canRecordMore, canSeeFullReport, canTraceLetter, FREE_LIMITS, gamesLeftToday } from './entitlements';

describe('entitlements', () => {
  it('limits free recordings and lifts the limit for premium', () => {
    expect(canRecordMore(false, FREE_LIMITS.recordings - 1)).toBe(true);
    expect(canRecordMore(false, FREE_LIMITS.recordings)).toBe(false);
    expect(canRecordMore(true, 500)).toBe(true);
  });

  it('lets free children trace the first letters only', () => {
    expect(canTraceLetter(false, 0)).toBe(true);
    expect(canTraceLetter(false, FREE_LIMITS.tracingLetters - 1)).toBe(true);
    expect(canTraceLetter(false, FREE_LIMITS.tracingLetters)).toBe(false);
    expect(canTraceLetter(true, 38)).toBe(true);
  });

  it('limits free games per day', () => {
    expect(canPlayGame(false, 2)).toBe(true);
    expect(canPlayGame(false, 3)).toBe(false);
    expect(canPlayGame(true, 99)).toBe(true);
    expect(gamesLeftToday(false, 1)).toBe(2);
    expect(gamesLeftToday(false, 7)).toBe(0);
    expect(gamesLeftToday(true, 7)).toBeNull();
  });

  it('keeps the full report premium', () => {
    expect(canSeeFullReport(false)).toBe(false);
    expect(canSeeFullReport(true)).toBe(true);
  });
});
