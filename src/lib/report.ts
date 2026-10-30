import type { ProgressState } from '@/state/progress.types';
import { daysBetween, localDay } from './date';
import { currentStreak } from './streak';

export function weeklyReport(state: ProgressState, now: number): {
  daysActive: number;
  newWordIds: string[];
  totalWords: number;
  streakDays: number;
  practiceWordIds: string[];
} {
  const today = localDay(now);
  const recent = state.lessons.filter((lesson) => {
    const age = daysBetween(lesson.day, today);
    return age >= 0 && age < 7;
  });
  const newWordIds = [...new Set(recent.flatMap((lesson) => lesson.newWordIds))];
  const practiceWordIds = Object.values(state.words)
    .filter((word) => word.box === 0 && word.seen > 0)
    .sort((a, b) => a.correct / a.seen - b.correct / b.seen || a.learnedAt - b.learnedAt)
    .slice(0, 5)
    .map((word) => word.wordId);
  return {
    daysActive: new Set(recent.map((lesson) => lesson.day)).size,
    newWordIds,
    totalWords: Object.keys(state.words).length,
    streakDays: currentStreak(state, now),
    practiceWordIds,
  };
}
