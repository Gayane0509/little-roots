import type { Theme, Word } from '@/content/types';
import { isThemeUnlocked, nextNewTheme } from './lesson';
import type { WordProgressMap } from './srs.types';

/** FNV-1a: a small, stable string hash, so the same child gets the same word all day on every device. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

interface WordOfTheDayArgs {
  themes: Theme[];
  words: WordProgressMap;
  isPremium: boolean;
  /** Local calendar day (`localDay`). */
  day: string;
  /** Per child, so siblings don't all get the same word. */
  seed: string;
}

/** Epoch ms of local midnight that starts `day` (YYYY-MM-DD). */
function startOfDay(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

/**
 * Home's word of the day (#147): one word a day, the same all day for a child. It comes from the words the child had met
 * before today in unlocked themes, so it is a calm reminder rather than a test, and today's lesson doesn't swap it; before
 * any word was met, from the theme the next lesson started with this morning.
 */
export function wordOfTheDay({ themes, words, isPremium, day, seed }: WordOfTheDayArgs): Word | null {
  const midnight = startOfDay(day);
  const before = Object.fromEntries(Object.entries(words).filter(([, progress]) => progress.learnedAt < midnight));
  const unlocked = themes.filter((theme) => isThemeUnlocked(theme, isPremium)).flatMap((theme) => theme.words);
  const met = unlocked.filter((word) => before[word.id] !== undefined);
  const pool = met.length > 0 ? met : nextNewTheme(themes, before, isPremium)?.words ?? [];
  if (pool.length === 0) return null;
  return pool[hash(`${seed}|${day}`) % pool.length];
}
