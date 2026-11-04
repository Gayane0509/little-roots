import { describe, expect, it } from '@jest/globals';
import type { ProgressState } from '@/state/progress.types';
import { daysBetween, localDay } from './date';
import { weeklyReport, weeklySummary } from './report';

describe('date and weekly report', () => {
  it('counts calendar days across daylight saving changes', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
    expect(localDay(new Date(2026, 2, 9, 12).getTime())).toBe('2026-03-09');
  });

  it('counts distinct recent days and ranks practice words by box, then accuracy', () => {
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
      daysActive: 2, newWordIds: ['a', 'b'], totalWords: 3, streakDays: 2, practiceWordIds: ['a', 'b', 'old'],
    });
  });

  const now = new Date(2026, 2, 9, 12).getTime();
  const word = (id: string, box: number, correct = 1) => ({ wordId: id, box, dueAt: now, seen: 2, correct, learnedAt: now });
  const base: ProgressState = { childName: 'Ani', stars: 0, streakDays: 0, lastLessonDay: null, isPremium: false, stickers: [], lessons: [], words: {} };

  it('fills practice words up to 3 with this week\'s new words, then other learned words', () => {
    const state: ProgressState = { ...base,
      lessons: [{ day: '2026-03-09', newWordIds: ['new'], reviewedCount: 0 }],
      words: { weak: word('weak', 0), new: word('new', 2), strong: word('strong', 4), stronger: word('stronger', 5) } };
    expect(weeklyReport(state, now).practiceWordIds).toEqual(['weak', 'new', 'strong']);
  });

  it('suggests at most 5 practice words and none before any word is seen', () => {
    const words = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`w${i}`, word(`w${i}`, 0, i % 2)]));
    expect(weeklyReport({ ...base, words }, now).practiceWordIds).toHaveLength(5);
    expect(weeklyReport(base, now).practiceWordIds).toEqual([]);
  });

  it('sums the week up in one sentence', () => {
    const report = { daysActive: 4, newWordIds: ['a', 'b', 'c'], totalWords: 9, streakDays: 2, practiceWordIds: ['a', 'b', 'c'] };
    expect(weeklySummary('Ani', report)).toBe('Ani learned on 4 of 7 days and met 3 new words. Try the 3 words below together.');
    expect(weeklySummary('Ani', { ...report, newWordIds: [], practiceWordIds: ['a'] })).toBe('Ani learned on 4 of 7 days and practised words already learned. Try the word below together.');
    expect(weeklySummary('Ani', { ...report, daysActive: 0 })).toMatch(/hasn't had a lesson this week/);
    expect(weeklySummary('Ani', { ...report, daysActive: 0, totalWords: 0, practiceWordIds: [] })).toMatch(/hasn't started yet/);
  });
});
