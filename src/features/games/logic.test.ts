import { describe, expect, it } from '@jest/globals';

import type { Word } from '@/content/types';

import { buildChoiceRounds, buildMemoryDeck, pickSeenWords, shuffle, uniqueWords } from './logic';

function makeWord(n: number, overrides: Partial<Word> = {}): Word {
  return { id: `family.w${n}`, themeId: 'family', hy: `hy${n}`, translit: `t${n}`, en: `en${n}`, emoji: `e${n}`, ...overrides };
}
const WORDS = Array.from({ length: 8 }, (_, i) => makeWord(i));

function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('shuffle', () => {
  it('keeps all items and does not mutate', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded());
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
  it('is deterministic for the same random', () => {
    expect(shuffle(WORDS, seeded(7))).toEqual(shuffle(WORDS, seeded(7)));
  });
});

describe('pickSeenWords', () => {
  const resolve = (id: string) => WORDS.find((w) => w.id === id);
  it('resolves seen ids, drops unknown ones and respects the limit', () => {
    const seen = { 'family.w1': {}, 'family.w2': {}, 'gone.x': {} };
    const all = pickSeenWords(seen, seeded(), Infinity, resolve);
    expect(all.map((w) => w.id).sort()).toEqual(['family.w1', 'family.w2']);
    expect(pickSeenWords(seen, seeded(), 1, resolve)).toHaveLength(1);
  });
});

describe('uniqueWords', () => {
  it('removes duplicate emojis and spellings', () => {
    const list = [makeWord(1), makeWord(2, { emoji: 'e1' }), makeWord(3, { hy: 'hy1' }), makeWord(4)];
    expect(uniqueWords(list).map((w) => w.id)).toEqual(['family.w1', 'family.w4']);
  });
});

describe('buildMemoryDeck', () => {
  it('builds an emoji and a word card per chosen word', () => {
    const deck = buildMemoryDeck(WORDS, seeded(), 6);
    expect(deck).toHaveLength(12);
    expect(new Set(deck.map((c) => c.key)).size).toBe(12);
    for (const card of deck) {
      const pair = deck.filter((c) => c.word.id === card.word.id);
      expect(pair.map((c) => c.kind).sort()).toEqual(['emoji', 'word']);
    }
  });
  it('makes fewer pairs when fewer words are available', () => {
    expect(buildMemoryDeck(WORDS.slice(0, 4), seeded(), 6)).toHaveLength(8);
  });
});

describe('buildChoiceRounds', () => {
  it('builds rounds whose options contain the answer once, uniquely', () => {
    const rounds = buildChoiceRounds(WORDS, 4, seeded(3), 6);
    expect(rounds).toHaveLength(6);
    for (const { answer, options } of rounds) {
      expect(options).toHaveLength(4);
      expect(options.filter((w) => w.id === answer.id)).toHaveLength(1);
      expect(new Set(options.map((w) => w.emoji)).size).toBe(4);
    }
  });
  it('uses each word before repeating an answer', () => {
    const rounds = buildChoiceRounds(WORDS, 3, seeded(5), 6);
    expect(new Set(rounds.map((r) => r.answer.id)).size).toBe(6);
  });
  it('cycles answers when there are fewer words than rounds', () => {
    const rounds = buildChoiceRounds(WORDS.slice(0, 4), 4, seeded(), 6);
    expect(rounds).toHaveLength(6);
  });
  it('returns no rounds when there are not enough distinct words', () => {
    expect(buildChoiceRounds(WORDS.slice(0, 2), 3, seeded())).toEqual([]);
  });
});
