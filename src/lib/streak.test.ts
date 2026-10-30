import { describe, expect, it } from '@jest/globals';
import type { ProgressState } from '@/state/progress.types';
import { currentStreak } from './streak';

const state = { lastLessonDay: '2026-03-09', streakDays: 4 } as ProgressState;
describe('currentStreak', () => {
  it('keeps today and yesterday, expires stale streaks', () => {
    expect(currentStreak(state, new Date(2026, 2, 9, 12).getTime())).toBe(4);
    expect(currentStreak(state, new Date(2026, 2, 10, 12).getTime())).toBe(4);
    expect(currentStreak(state, new Date(2026, 2, 11, 12).getTime())).toBe(0);
    expect(currentStreak({ ...state, lastLessonDay: null }, Date.now())).toBe(0);
  });
});
