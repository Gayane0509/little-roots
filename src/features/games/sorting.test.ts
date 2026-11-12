import { describe, expect, it } from '@jest/globals';

import { ACTIVE_PACK, getWord } from '@/content/packs';
import type { Word } from '@/content/types';

import { basketOf, buildSortRounds, canPlaySorting } from './sorting';

const word = (id: string): Word => {
  const found = getWord(id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
};
const themeWords = (id: string) => ACTIVE_PACK.themes.find((theme) => theme.id === id)?.words ?? [];

function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('sorting game', () => {
  it('puts every Food word and the holiday treats in the food basket', () => {
    for (const food of themeWords('food')) expect(basketOf(food)).toBe('food');
    expect(basketOf(word('holidays.gata'))).toBe('food');
    expect(basketOf(word('holidays.cake'))).toBe('food');
    expect(basketOf(word('playground.icecream'))).toBe('food');
  });

  it('puts family, toys and kitchen things in the other basket and leaves arguable pictures out', () => {
    expect(basketOf(word('family.mom'))).toBe('other');
    expect(basketOf(word('toys.ball'))).toBe('other');
    expect(basketOf(word('kitchen.spoon'))).toBe('other');
    expect(basketOf(word('animals.fish'))).toBeUndefined();
    expect(basketOf(word('holidays.fireworks'))).toBeUndefined();
    for (const id of ['kitchen.pot', 'kitchen.pan', 'kitchen.bowl', 'kitchen.cup', 'kitchen.salt']) expect(basketOf(word(id))).toBeUndefined();
    expect(basketOf(word('kitchen.plate'))).toBe('other');
    for (const theme of ['animals', 'nature', 'actions', 'colors', 'numbers', 'feelings', 'phrases', 'weather']) {
      for (const w of themeWords(theme)) expect(basketOf(w)).toBeUndefined();
    }
  });

  it('opens for a free child after three Food and three Family words', () => {
    const food = themeWords('food').slice(0, 3);
    const family = themeWords('family').slice(0, 3);
    expect(canPlaySorting([...food, ...family])).toBe(true);
    expect(canPlaySorting([...food, ...family.slice(0, 2)])).toBe(false);
    expect(canPlaySorting(themeWords('food'))).toBe(false);
  });

  it('builds six different pictures, three from each basket, review words first', () => {
    const seen = [...themeWords('food'), ...themeWords('family')];
    const review = [themeWords('food')[7].id, themeWords('family')[9].id];
    for (let seed = 1; seed < 20; seed++) {
      const rounds = buildSortRounds(seen, seeded(seed), 6, review);
      expect(rounds).toHaveLength(6);
      expect(new Set(rounds.map((r) => r.word.id)).size).toBe(6);
      expect(rounds.filter((r) => r.basket === 'food')).toHaveLength(3);
      for (const r of rounds) expect(basketOf(r.word)).toBe(r.basket);
      for (const id of review) expect(rounds.map((r) => r.word.id)).toContain(id);
    }
  });

  it('splits an odd number of rounds with one basket getting the extra picture', () => {
    const seen = [...themeWords('food'), ...themeWords('family')];
    const food = buildSortRounds(seen, seeded(3), 5).filter((r) => r.basket === 'food').length;
    expect([2, 3]).toContain(food);
  });

  it('builds nothing without enough words for both baskets', () => {
    expect(buildSortRounds(themeWords('food'))).toEqual([]);
  });
});
