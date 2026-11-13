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

/**
 * Big / small (#168): only pictures no child would argue about — much bigger than a child, or fits in a hand. Anything
 * whose size depends on the picture (ball, boat, bird, fish, sun…) or that a child sees both ways (car) is left out.
 */
export const BIG_IDS: ReadonlySet<string> = new Set([
  'animals.horse', 'animals.cow', 'animals.bear', 'home.house', 'transport.bus', 'transport.train', 'transport.plane',
  'transport.truck', 'transport.helicopter', 'nature.tree', 'nature.mountain', 'school.school', 'playground.carousel',
  'playground.slide',
]);
export const SMALL_IDS: ReadonlySet<string> = new Set([
  'food.apple', 'food.egg', 'food.banana', 'food.pear', 'food.apricot', 'food.grapes', 'food.carrot', 'food.tomato',
  'home.key', 'school.pencil', 'school.crayon', 'kitchen.spoon', 'kitchen.cup', 'clothes.socks', 'clothes.gloves',
  'school.scissors', 'kitchen.salt',
]);

/** The two sorting games: food / not food (#149) and big / small (#168). */
export type SortPair = 'food' | 'size';
export type Basket = 'food' | 'other' | 'big' | 'small';

/** Each pair's two baskets, in screen order (left, right). */
export const PAIR_BASKETS: Record<SortPair, readonly [Basket, Basket]> = { food: ['food', 'other'], size: ['big', 'small'] };

/** Which basket a word goes in for a pair, or undefined when that game leaves it out. */
export function basketOf(word: Word, pair: SortPair = 'food'): Basket | undefined {
  if (pair === 'size') return BIG_IDS.has(word.id) ? 'big' : SMALL_IDS.has(word.id) ? 'small' : undefined;
  if (word.themeId === 'food' || OTHER_FOOD_IDS.has(word.id)) return 'food';
  if (LEFT_OUT_IDS.has(word.id)) return undefined;
  return NOT_FOOD_THEMES.has(word.themeId) ? 'other' : undefined;
}

/**
 * Each basket needs three met words, so a game always has both kinds. Free children reach food / not food through
 * Family + Food; big / small needs Premium themes (no free word is big), so free children never see it locked.
 */
export const MIN_SORT_WORDS = 3;

export function canPlaySorting(seen: readonly Word[], pair: SortPair = 'food'): boolean {
  return PAIR_BASKETS[pair].every((basket) => seen.filter((word) => basketOf(word, pair) === basket).length >= MIN_SORT_WORDS);
}

export interface SortRound {
  word: Word;
  basket: Basket;
}

/**
 * `rounds` pictures, half from each basket (the extra one goes to a random side), no word twice, in random order; review
 * words (#146) are taken first within each basket.
 */
export function buildSortRounds(seen: readonly Word[], random: Random = Math.random, rounds = ROUNDS, reviewIds: readonly string[] = [], pair: SortPair = 'food'): SortRound[] {
  if (!canPlaySorting(seen, pair)) return [];
  const [first, second] = PAIR_BASKETS[pair];
  const pick = (basket: Basket, count: number): SortRound[] => {
    const words = shuffle(seen.filter((word) => basketOf(word, pair) === basket), random);
    const due = (word: Word) => (reviewIds.includes(word.id) ? 0 : 1);
    return words.sort((a, b) => due(a) - due(b)).slice(0, count).map((word) => ({ word, basket }));
  };
  const firstCount = Math.floor(rounds / 2) + (rounds % 2 === 1 && random() < 0.5 ? 1 : 0);
  return shuffle([...pick(first, firstCount), ...pick(second, rounds - firstCount)], random);
}
