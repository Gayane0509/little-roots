import type { ProgressState } from '@/state/progress.types';
import { daysBetween, localDay } from './date';

export function currentStreak(state: ProgressState, now: number): number {
  if (!state.lastLessonDay) return 0;
  const age = daysBetween(state.lastLessonDay, localDay(now));
  return age >= 0 && age <= 1 ? state.streakDays : 0;
}
