import { describe, expect, it, jest } from '@jest/globals';
import type { Word } from '@/content/types';
import { gameOptions } from './game';

jest.mock('@/content/themes', () => {
  const word = (id: string, themeId: string, emoji: string) => ({ id, themeId, emoji, en: id, hy: id, translit: id });
  const themes = [
    { id: 'family', words: [word('family.a', 'family', '🍎'), word('family.same', 'family', '🍎'), word('family.b', 'family', '🍌')] },
    { id: 'food', words: [word('food.a', 'food', '🥛'), word('food.b', 'food', '🍞'), word('food.c', 'food', '🧀')] },
  ];
  return { THEMES: themes, getTheme: (id: string) => themes.find((theme) => theme.id === id) };
});

describe('picture choices', () => {
  it('uses the answer theme first, tops up to four, and keeps ids and emoji unique', () => {
    const answer: Word = { id: 'family.a', themeId: 'family', emoji: '🍎', en: 'apple', hy: 'խնձոր', translit: 'khndzor' };
    const options = gameOptions(answer);
    expect(options).toHaveLength(4);
    expect(options.some((word) => word.id === answer.id)).toBe(true);
    expect(options.some((word) => word.id === 'family.b')).toBe(true);
    expect(new Set(options.map((word) => word.id)).size).toBe(4);
    expect(new Set(options.map((word) => word.emoji)).size).toBe(4);
  });
});
