import { getWord } from '@/content/themes';
import type { Word } from '@/content/types';

/** Returns a number in [0, 1). Injectable so tests are deterministic. */
export type Random = () => number;

export const MIN_SEEN_WORDS = 4;
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
): Word[] {
  const words = Object.keys(seen)
    .map((id) => resolve(id))
    .filter((word): word is Word => word !== undefined);
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

export function buildMemoryDeck(seen: readonly Word[], random: Random = Math.random, pairs = MEMORY_PAIRS): MemoryCard[] {
  const chosen = uniqueWords(shuffle(seen, random)).slice(0, pairs);
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
 */
export function buildChoiceRounds(
  seen: readonly Word[],
  optionCount: number,
  random: Random = Math.random,
  rounds = ROUNDS,
): ChoiceRound[] {
  const pool = uniqueWords(shuffle(seen, random));
  if (pool.length < optionCount) return [];
  const order: Word[] = [];
  while (order.length < rounds) order.push(...shuffle(pool, random));
  return order.slice(0, rounds).map((answer) => {
    const distractors = shuffle(pool.filter((word) => word.id !== answer.id), random).slice(0, optionCount - 1);
    return { answer, options: shuffle([answer, ...distractors], random) };
  });
}
