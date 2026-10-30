import { describe, expect, it } from '@jest/globals';
import type { ProgressState } from '@/state/progress.types';
import { daysBetween, localDay } from './date';
import { weeklyReport } from './report';

describe('date and weekly report', () => {
  it('counts calendar days across daylight saving changes', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
    expect(localDay(new Date(2026, 2, 9, 12).getTime())).toBe('2026-03-09');
  });

  it('counts distinct recent days and ranks practice words by accuracy', () => {
    const now = new Date(2026, 2, 9, 12).getTime();
    const state: ProgressState = {
      childName: 'Ani', stars: 5, streakDays: 2, lastLessonDay: '2026-03-09', isPremium: false, stickers: [],
      lessons: [
        { day: '2026-03-09', newWordIds: ['a'], reviewedCount: 1 },
        { day: '2026-03-09', newWordIds: ['b'], reviewedCount: 1 },
        { day: '2026-03-03', newWordIds: ['a'], reviewedCount: 0 },
        { day: '2026-03-02', newWordIds: ['old'], reviewedCount: 0 },
      ],
      words: {
        a: { wordId: 'a', box: 0, dueAt: now, seen: 2, correct: 0, learnedAt: now },
        b: { wordId: 'b', box: 0, dueAt: now, seen: 2, correct: 1, learnedAt: now },
        old: { wordId: 'old', box: 1, dueAt: now, seen: 2, correct: 2, learnedAt: now },
      },
    };
    expect(weeklyReport(state, now)).toEqual({
      daysActive: 2, newWordIds: ['a', 'b'], totalWords: 3, streakDays: 2, practiceWordIds: ['a', 'b'],
    });
  });
});
