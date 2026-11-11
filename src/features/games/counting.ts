import type { Word } from '@/content/types';

import { ROUNDS, shuffle, type Random } from './logic';

/** Numbers theme word slugs and the amount each one names (#151). */
const NUMBER_VALUES: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };

/** Pictures the child counts: plain objects that read well in a row (free and premium alike; the game itself needs the Numbers theme). */
export const COUNT_OBJECT_IDS = ['food.apple', 'food.banana', 'animals.fish', 'toys.ball', 'toys.balloon', 'nature.star', 'nature.flower', 'transport.car'] as const;

/** The game needs three met numbers so every round has three different answers. */
export const MIN_COUNT_NUMBERS = 3;
export const COUNT_OPTIONS = 3;

export function numberValue(word: Word): number | undefined {
  return word.themeId === 'numbers' ? NUMBER_VALUES[word.id.slice('numbers.'.length)] : undefined;
}

/** Number words among the met words, smallest first. */
export function metNumbers(seen: readonly Word[]): Word[] {
  return seen.filter((word) => numberValue(word) !== undefined).sort((a, b) => (numberValue(a) ?? 0) - (numberValue(b) ?? 0));
}

export function canPlayCounting(seen: readonly Word[]): boolean {
  return metNumbers(seen).length >= MIN_COUNT_NUMBERS;
}

export interface CountRound {
  answer: Word;
  value: number;
  objectId: string;
  /** Three met numbers including the answer, smallest first (a counting line, not a shuffle). */
  options: Word[];
}

/** One round per met number (cycled to `rounds`), each with a different object picture where possible. */
export function buildCountRounds(seen: readonly Word[], random: Random = Math.random, rounds = ROUNDS): CountRound[] {
  const numbers = metNumbers(seen);
  if (numbers.length < MIN_COUNT_NUMBERS) return [];
  const order: Word[] = [];
  while (order.length < rounds) {
    const batch = shuffle(numbers, random);
    // No number twice in a row across batches (with three met numbers a fresh shuffle often starts with the last one).
    if (batch[0] === order[order.length - 1]) batch.push(batch.shift() as Word);
    order.push(...batch);
  }
  const objects: string[] = [];
  while (objects.length < rounds) objects.push(...shuffle(COUNT_OBJECT_IDS, random));
  return order.slice(0, rounds).map((answer, i) => {
    const distractors = shuffle(numbers.filter((word) => word.id !== answer.id), random).slice(0, COUNT_OPTIONS - 1);
    const options = [answer, ...distractors].sort((a, b) => (numberValue(a) ?? 0) - (numberValue(b) ?? 0));
    return { answer, value: numberValue(answer) ?? 0, objectId: objects[i], options };
  });
}

/** Side of one counting picture: four a row inside the content column, never above 120. */
export function countItemSize(windowWidth: number, contentMax = 720, padding = 16, gap = 8): number {
  const column = Math.min(windowWidth - padding * 2, contentMax);
  return Math.min(120, Math.floor((column - gap * 3) / 4));
}
