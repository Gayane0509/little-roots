import type { ThemeId, Word } from '@/content/types';

import { ROUNDS, shuffle, type Random } from './logic';

/** Words outside the Food theme that are plainly food in their picture (#149). */
const OTHER_FOOD_IDS: ReadonlySet<string> = new Set(['holidays.gata', 'holidays.cake', 'playground.icecream']);

/** Kitchen pictures that show food in them (pot of stew, fried egg, cereal, hot drink, salt): left out, not argued. */
const LEFT_OUT_IDS: ReadonlySet<string> = new Set(['kitchen.pot', 'kitchen.pan', 'kitchen.bowl', 'kitchen.cup', 'kitchen.salt']);

/**
 * Themes whose pictures are plainly not food. Animals (fish, chicken), nature (fruit on trees), actions (eat) and the
 * abstract themes sit the game out, so no picture can be argued either way.
 */
const NOT_FOOD_THEMES: ReadonlySet<ThemeId> = new Set(['family', 'body', 'clothes', 'home', 'toys', 'transport', 'school', 'kitchen', 'playground']);

export type Basket = 'food' | 'other';

/** Which basket a word goes in, or undefined when the game leaves it out. */
export function basketOf(word: Word): Basket | undefined {
  if (word.themeId === 'food' || OTHER_FOOD_IDS.has(word.id)) return 'food';
  if (LEFT_OUT_IDS.has(word.id)) return undefined;
  return NOT_FOOD_THEMES.has(word.themeId) ? 'other' : undefined;
}

/** Each basket needs three met words, so a game always has both kinds. Free children reach it through Family + Food. */
export const MIN_SORT_WORDS = 3;

export function canPlaySorting(seen: readonly Word[]): boolean {
  return seen.filter((word) => basketOf(word) === 'food').length >= MIN_SORT_WORDS
    && seen.filter((word) => basketOf(word) === 'other').length >= MIN_SORT_WORDS;
}

export interface SortRound {
  word: Word;
  basket: Basket;
}

/**
 * `rounds` pictures, half from each basket (the extra one goes to a random side), no word twice, in random order; review
 * words (#146) are taken first within each basket.
 */
export function buildSortRounds(seen: readonly Word[], random: Random = Math.random, rounds = ROUNDS, reviewIds: readonly string[] = []): SortRound[] {
  if (!canPlaySorting(seen)) return [];
  const pick = (basket: Basket, count: number): SortRound[] => {
    const words = shuffle(seen.filter((word) => basketOf(word) === basket), random);
    const due = (word: Word) => (reviewIds.includes(word.id) ? 0 : 1);
    return words.sort((a, b) => due(a) - due(b)).slice(0, count).map((word) => ({ word, basket }));
  };
  const food = Math.floor(rounds / 2) + (rounds % 2 === 1 && random() < 0.5 ? 1 : 0);
  return shuffle([...pick('food', food), ...pick('other', rounds - food)], random);
}
