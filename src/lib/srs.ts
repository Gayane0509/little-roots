import type { WordProgress, WordProgressMap } from './srs.types';

export const INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;
const DAY_MS = 86_400_000;

export function scheduleReview(prev: WordProgress | undefined, wordId: string, correct: boolean, now: number): WordProgress {
  const box = prev && correct ? Math.min(prev.box + 1, INTERVAL_DAYS.length - 1) : 0;
  return {
    wordId,
    box,
    dueAt: now + INTERVAL_DAYS[box] * DAY_MS,
    seen: (prev?.seen ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    learnedAt: prev?.learnedAt ?? now,
  };
}

export function dueWordIds(words: WordProgressMap, now: number): string[] {
  return Object.values(words)
    .filter((word) => word.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || a.wordId.localeCompare(b.wordId))
    .map((word) => word.wordId);
}

export function isLearned(progress: WordProgress): boolean {
  return progress.box >= 1;
}
