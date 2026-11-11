import { describe, expect, it } from '@jest/globals';

import { getWord, ACTIVE_PACK } from '@/content/packs';
import type { Word } from '@/content/types';

import { buildCountRounds, canPlayCounting, COUNT_OBJECT_IDS, countItemSize, metNumbers, numberValue } from './counting';

const word = (id: string): Word => {
  const found = getWord(id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
};
const NUMBERS = ACTIVE_PACK.themes.find((theme) => theme.id === 'numbers')?.words ?? [];

function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('counting game', () => {
  it('knows the value of every Numbers word, 1 to 8', () => {
    expect(NUMBERS.map(numberValue)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(numberValue(word('food.apple'))).toBeUndefined();
  });

  it('every object picture is a real word', () => {
    for (const id of COUNT_OBJECT_IDS) expect(getWord(id)).toBeDefined();
  });

  it('needs three met numbers', () => {
    const two = [word('numbers.two'), word('numbers.five'), word('food.apple')];
    expect(canPlayCounting(two)).toBe(false);
    expect(buildCountRounds(two)).toEqual([]);
    expect(canPlayCounting([...two, word('numbers.one')])).toBe(true);
    expect(metNumbers([...two, word('numbers.one')]).map((w) => w.id)).toEqual(['numbers.one', 'numbers.two', 'numbers.five']);
  });

  it('asks only met numbers, with three ordered options including the answer', () => {
    const seen = [word('numbers.three'), word('numbers.one'), word('numbers.seven'), word('numbers.four'), word('food.apple')];
    const rounds = buildCountRounds(seen, seeded(3));
    expect(rounds).toHaveLength(6);
    const met = new Set(['numbers.one', 'numbers.three', 'numbers.four', 'numbers.seven']);
    for (const round of rounds) {
      expect(met.has(round.answer.id)).toBe(true);
      expect(round.value).toBe(numberValue(round.answer));
      expect(round.options).toHaveLength(3);
      expect(round.options.map((o) => o.id)).toContain(round.answer.id);
      expect(new Set(round.options.map((o) => o.id)).size).toBe(3);
      const values = round.options.map((o) => numberValue(o) ?? 0);
      expect(values).toEqual([...values].sort((a, b) => a - b));
      expect(COUNT_OBJECT_IDS).toContain(round.objectId);
    }
    // Every met number comes up before any repeats.
    expect(new Set(rounds.slice(0, 4).map((r) => r.answer.id)).size).toBe(4);
  });

  it('never asks the same number twice in a row', () => {
    const seen = [word('numbers.one'), word('numbers.two'), word('numbers.three')];
    for (let seed = 1; seed < 60; seed++) {
      const ids = buildCountRounds(seen, seeded(seed)).map((r) => r.answer.id);
      for (let i = 1; i < ids.length; i++) expect(ids[i]).not.toBe(ids[i - 1]);
    }
  });

  it('fits four pictures a row from 320 px to tablets', () => {
    for (const width of [320, 375, 430, 768, 1024]) {
      const size = countItemSize(width);
      const column = Math.min(width - 32, 720);
      expect(size * 4 + 8 * 3).toBeLessThanOrEqual(column);
      expect(size).toBeGreaterThanOrEqual(56);
      expect(size).toBeLessThanOrEqual(120);
    }
  });
});
