import { ACTIVE_PACK, getWord } from '@/content/packs';
import type { Word } from '@/content/types';

/** Returns a number in [0, 1). Injectable so tests are deterministic. */
export type Random = () => number;

export const MIN_SEEN_WORDS = 3;
export const MEMORY_PAIRS = 6;
export const ROUNDS = 6;

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Words the child has met (keys of the progress map), shuffled, unknown ids dropped. */
export function pickSeenWords(
  seen: Record<string, unknown>,
  random: Random = Math.random,
  limit = Infinity,
  resolve: (id: string) => Word | undefined = getWord,
  isPremium = true,
): Word[] {
  const unlocked = new Set(ACTIVE_PACK.themes.filter((theme) => isPremium || theme.free).map((theme) => theme.id));
  const words = Object.keys(seen)
    .map((id) => resolve(id))
    .filter((word): word is Word => word !== undefined && unlocked.has(word.themeId));
  return shuffle(words, random).slice(0, limit);
}

/** Drops words that share an emoji or spelling with an earlier word, so every choice is unambiguous. */
export function uniqueWords(words: readonly Word[]): Word[] {
  const emojis = new Set<string>();
  const spellings = new Set<string>();
  const result: Word[] = [];
  for (const word of words) {
    if (emojis.has(word.emoji) || spellings.has(word.hy)) continue;
    emojis.add(word.emoji);
    spellings.add(word.hy);
    result.push(word);
  }
  return result;
}

export interface MemoryCard {
  key: string;
  word: Word;
  kind: 'emoji' | 'word';
}

/** `fits` says whether a word's card can show it whole; words that can't are used only when too few others are seen. */
export function buildMemoryDeck(seen: readonly Word[], random: Random = Math.random, pairs = MEMORY_PAIRS, fits: (word: Word) => boolean = () => true): MemoryCard[] {
  const words = uniqueWords(shuffle(seen, random));
  const chosen = [...words.filter(fits), ...words.filter((word) => !fits(word))].slice(0, pairs);
  const cards = chosen.flatMap<MemoryCard>((word) => [
    { key: `${word.id}:emoji`, word, kind: 'emoji' },
    { key: `${word.id}:word`, word, kind: 'word' },
  ]);
  return shuffle(cards, random);
}

export interface ChoiceRound {
  answer: Word;
  options: Word[];
}

/**
 * One round per answer; answers cycle through the seen words if there are fewer words than rounds.
 * Options always include the answer, with unique ids, emojis and spellings.
 * `reviewIds` (most overdue first) are asked before other words, so a game doubles as a spaced review (#146).
 */
export function buildChoiceRounds(
  seen: readonly Word[],
  optionCount: number,
  random: Random = Math.random,
  rounds = ROUNDS,
  reviewIds: readonly string[] = [],
): ChoiceRound[] {
  const pool = uniqueWords(shuffle(seen, random));
  if (pool.length < optionCount) return [];
  const byId = new Map(pool.map((word) => [word.id, word] as const));
  const due = shuffle(reviewIds.map((id) => byId.get(id)).filter((word): word is Word => word !== undefined).slice(0, rounds), random);
  const dueIds = new Set(due.map((word) => word.id));
  const order: Word[] = [...due, ...pool.filter((word) => !dueIds.has(word.id))];
  while (order.length < rounds) order.push(...shuffle(pool, random));
  return order.slice(0, rounds).map((answer) => {
    const distractors = shuffle(pool.filter((word) => word.id !== answer.id), random).slice(0, optionCount - 1);
    return { answer, options: shuffle([answer, ...distractors], random) };
  });
}
