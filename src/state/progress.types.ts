import type { WordProgressMap } from '@/lib/srs.types';

export interface LessonRecord {
  /** Local calendar day, "YYYY-MM-DD". */
  day: string;
  newWordIds: string[];
  reviewedCount: number;
}

/** Everything is stored on the device only — no accounts, no analytics (COPPA). */
export interface ProgressState {
  childName: string;
  stars: number;
  streakDays: number;
  lastLessonDay: string | null;
  words: WordProgressMap;
  lessons: LessonRecord[];
  stickers: string[];
  isPremium: boolean;
  gamesToday?: { day: string; count: number };
}

export interface LessonSummary {
  newWordIds: string[];
  reviewedCount: number;
  starsEarned: number;
  sticker?: string;
}

export interface ProgressApi {
  state: ProgressState;
  /** False until the stored state has been loaded. */
  ready: boolean;
  storageError: boolean;
  retryStorage(): void;
  setChildName(name: string): void;
  /** Update a word's spaced-repetition box after the child answers (or is taught) it. */
  recordAnswer(wordId: string, correct: boolean): void;
  completeLesson(summary: LessonSummary): void;
  recordGamePlayed(): void;
  /** Paywall stub: flips premium on/off until real purchases are wired. */
  setPremium(value: boolean): void;
  reset(): void;
}

export type ProgressSnapshot = Pick<ProgressApi, 'state' | 'ready' | 'storageError'>;
export type ProgressActions = Omit<ProgressApi, keyof ProgressSnapshot>;
