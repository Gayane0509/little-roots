import type { ProgressState } from '@/state/progress.types';
import { daysBetween, localDay } from './date';
import { currentStreak } from './streak';

const PRACTICE_MIN = 3;
const PRACTICE_MAX = 5;

export interface WeeklyReport {
  daysActive: number;
  newWordIds: string[];
  totalWords: number;
  streakDays: number;
  /** 3–5 words to practise together (fewer only when fewer have been seen): shaky words first, then this week's. */
  practiceWordIds: string[];
}

export function weeklyReport(state: ProgressState, now: number): WeeklyReport {
  const today = localDay(now);
  const recent = state.lessons.filter((lesson) => {
    const age = daysBetween(lesson.day, today);
    return age >= 0 && age < 7;
  });
  const newWordIds = [...new Set(recent.flatMap((lesson) => lesson.newWordIds))];
  const seen = Object.values(state.words).filter((word) => word.seen > 0);
  const accuracy = (word: (typeof seen)[number]) => word.correct / word.seen;
  const byNeed = [...seen].sort((a, b) => a.box - b.box || accuracy(a) - accuracy(b) || a.learnedAt - b.learnedAt);
  const practiceWordIds = byNeed.filter((word) => word.box <= 1).slice(0, PRACTICE_MAX).map((word) => word.wordId);
  const seenIds = new Set(seen.map((word) => word.wordId));
  for (const id of [...newWordIds, ...byNeed.map((word) => word.wordId)]) {
    if (practiceWordIds.length >= PRACTICE_MIN) break;
    if (seenIds.has(id) && !practiceWordIds.includes(id)) practiceWordIds.push(id);
  }
  return {
    daysActive: new Set(recent.map((lesson) => lesson.day)).size,
    newWordIds,
    totalWords: Object.keys(state.words).length,
    streakDays: currentStreak(state, now),
    practiceWordIds,
  };
}

/** One plain sentence for the parent: how the week went and what to do next. */
export function weeklySummary(name: string, report: WeeklyReport): string {
  if (report.daysActive === 0) {
    return report.totalWords > 0
      ? `${name} hasn't had a lesson this week yet. A few minutes together today keeps the words fresh.`
      : `${name} hasn't started yet. The first lesson takes about five minutes.`;
  }
  const days = `${name} learned on ${report.daysActive} of 7 days`;
  const count = report.newWordIds.length;
  const words = count > 0 ? ` and met ${count} new ${count === 1 ? 'word' : 'words'}` : ' and practised words already learned';
  const practice = report.practiceWordIds.length;
  const next = practice > 0 ? ` Try the ${practice === 1 ? 'word' : `${practice} words`} below together.` : '';
  return `${days}${words}.${next}`;
}
