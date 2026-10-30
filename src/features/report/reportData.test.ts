import { expect, test } from '@jest/globals';
import { fullReport, masteryStars } from './reportData';
import type { ProgressState } from '@/state/progress.types';

test('mastery stars follow Leitner boxes', () => {
  expect([0, 1, 2, 3].map(masteryStars)).toEqual([1, 2, 2, 3]);
});
test('groups seen words and counts recent weekly learning', () => {
  const now = new Date(2026, 9, 30, 12).getTime();
  const state: ProgressState = { childName: '', stars: 0, streakDays: 0, lastLessonDay: null, stickers: [], isPremium: false, gamesToday: { day: '', count: 0 }, words: {
    'food.apple': { wordId: 'food.apple', box: 2, dueAt: now, seen: 2, correct: 2, learnedAt: now },
  }, lessons: [{ day: '2026-10-30', newWordIds: ['food.apple'], reviewedCount: 0 }] };
  const report = fullReport(state, now);
  expect(report.seenTotal).toBe(1);
  expect(report.themes.find((item) => item.theme.id === 'food')?.words[0].stars).toBe(2);
  expect(report.themes.find((item) => item.theme.id === 'food')?.mastery).toBe(2 / 24);
  expect(report.weeks.at(-1)).toEqual({ label: 'Last 7 days', count: 1 });
  expect(report.weeks.at(-2)?.label).toBe('1 week ago');
});
