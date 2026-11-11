import { describe, expect, it } from '@jest/globals';
import { ACTIVE_PACK } from '@/content/packs';
import type { Word } from '@/content/types';
import { talkTogetherCards } from './talkTogether';

const words = ACTIVE_PACK.themes[0].words;
const [a, b, c, d] = words as [Word, Word, Word, Word];

describe('talkTogetherCards', () => {
  it('asks a different question about each of up to three words, new words first', () => {
    const cards = talkTogetherCards([a, b], [c, d], ACTIVE_PACK.phrases);
    expect(cards.map((card) => card.word.id)).toEqual([a.id, b.id, c.id]);
    expect(new Set(cards.map((card) => card.question.en.replace(/\{|\}/g, ''))).size).toBe(3);
    expect(cards[0].question).toEqual({
      hy: ACTIVE_PACK.phrases.talk_show_me.hy.replace('{word}', a.hy),
      translit: ACTIVE_PACK.phrases.talk_show_me.translit.replace('{word}', a.translit),
      en: ACTIVE_PACK.phrases.talk_show_me.en.replace('{word}', a.en),
    });
  });

  it('fills every placeholder and skips a word listed twice', () => {
    const cards = talkTogetherCards([a], [a, b], ACTIVE_PACK.phrases);
    expect(cards.map((card) => card.word.id)).toEqual([a.id, b.id]);
    for (const { question } of cards) expect(Object.values(question).join()).not.toMatch(/\{word\}/);
  });

  it('has no cards before any word was seen', () => {
    expect(talkTogetherCards([], [], ACTIVE_PACK.phrases)).toEqual([]);
  });
});
