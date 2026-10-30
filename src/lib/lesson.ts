import type { Song, Theme, Word } from '@/content/types';
import type { WordProgressMap } from './srs.types';
import { dueWordIds } from './srs';

export interface DailyLesson {
  theme: Theme;
  newWords: Word[];
  reviewWords: Word[];
  song: Song;
}

interface BuildDailyLessonArgs {
  themes: Theme[];
  words: WordProgressMap;
  isPremium: boolean;
  now: number;
  newCount?: number;
  maxReviews?: number;
}

export function isThemeUnlocked(theme: Theme, isPremium: boolean): boolean {
  return theme.free || isPremium;
}

export function themeProgress(theme: Theme, words: WordProgressMap): { learned: number; total: number } {
  return { learned: theme.words.filter((word) => words[word.id] !== undefined).length, total: theme.words.length };
}

export function buildDailyLesson({ themes, words, isPremium, now, newCount = 3, maxReviews }: BuildDailyLessonArgs): DailyLesson | null {
  const unlocked = themes.filter((theme) => isThemeUnlocked(theme, isPremium));
  const unlockedWords = new Map(unlocked.flatMap((theme) => theme.words.map((word) => [word.id, word] as const)));
  const firstNewTheme = unlocked.find((theme) => theme.words.some((word) => !words[word.id]));
  const dueIds = dueWordIds(words, now).filter((id) => unlockedWords.has(id));
  const reviewOnly = dueIds.length >= 8;
  const dueSet = new Set(dueIds);
  const firstReviewTheme = unlocked.find((theme) => theme.words.some((word) => dueSet.has(word.id)));
  const theme = reviewOnly ? firstReviewTheme : firstNewTheme ?? firstReviewTheme;
  if (!theme) return null;

  const newWords = firstNewTheme && !reviewOnly
    ? theme.words.filter((word) => !words[word.id]).slice(0, Math.max(0, newCount))
    : [];
  const newIds = new Set(newWords.map((word) => word.id));
  const reviewWords = dueIds
    .filter((id) => !newIds.has(id))
    .map((id) => unlockedWords.get(id))
    .filter((word): word is Word => word !== undefined)
    .slice(0, Math.max(0, Math.min(maxReviews ?? (reviewOnly ? 6 : 4), reviewOnly ? 6 : Infinity)));
  if (newWords.length === 0 && reviewWords.length === 0) return null;
  return { theme, newWords, reviewWords, song: theme.song };
}
