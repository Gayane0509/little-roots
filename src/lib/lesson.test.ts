import { describe, expect, it } from '@jest/globals';
import type { Theme, Word } from '@/content/types';
import { buildDailyLesson, isThemeUnlocked, themeProgress } from './lesson';
import { scheduleReview } from './srs';

function theme(id: Theme['id'], free: boolean): Theme {
  const words: Word[] = [0, 1, 2, 3].map((index) => ({
    id: `${id}.${index}`, themeId: id, hy: `հայ${index}`, translit: `hay${index}`, en: `word${index}`, emoji: '🍎',
  }));
  return { id, free, words, titleHy: 'Թեմա', titleEn: id, emoji: '🍎', color: '#fff', song: { id: `${id}.song`, themeId: id, title: 'Song', lines: [] } };
}

describe('daily lesson', () => {
  const now = Date.UTC(2026, 0, 2);
  const locked = theme('animals', false);
  const free = theme('family', true);

  it('selects first unseen words from an unlocked theme', () => {
    const lesson = buildDailyLesson({ themes: [locked, free], words: {}, isPremium: false, now });
    expect(lesson?.theme.id).toBe('family');
    expect(lesson?.newWords.map((word) => word.id)).toEqual(['family.0', 'family.1', 'family.2']);
    expect(lesson?.song).toBe(free.song);
    expect(isThemeUnlocked(locked, false)).toBe(false);
    expect(isThemeUnlocked(locked, true)).toBe(true);
  });

  it('reviews due words when all words have been seen', () => {
    const words = Object.fromEntries(free.words.map((word) => [word.id, scheduleReview(undefined, word.id, true, now - 2 * 86_400_000)]));
    expect(themeProgress(free, words)).toEqual({ learned: 4, total: 4 });
    const lesson = buildDailyLesson({ themes: [free], words, isPremium: false, now, maxReviews: 2 });
    expect(lesson?.newWords).toEqual([]);
    expect(lesson?.reviewWords).toHaveLength(2);
    expect(buildDailyLesson({ themes: [free], words, isPremium: false, now: now - 3 * 86_400_000 })).toBeNull();
  });

  it('includes due reviews from another unlocked theme in due order', () => {
    const next = theme('food', true);
    const words = Object.fromEntries(free.words.map((word, index) => [
      word.id, scheduleReview(undefined, word.id, true, now - (index + 2) * 86_400_000),
    ]));
    const lesson = buildDailyLesson({ themes: [free, next], words, isPremium: false, now, newCount: 2, maxReviews: 2 });
    expect(lesson?.theme.id).toBe('food');
    expect(lesson?.song).toBe(next.song);
    expect(lesson?.newWords.map((word) => word.id)).toEqual(['food.0', 'food.1']);
    expect(lesson?.reviewWords.map((word) => word.id)).toEqual(['family.3', 'family.2']);
  });

  it('excludes locked reviews unless premium and respects both caps', () => {
    const lockedWords = Object.fromEntries(locked.words.map((word) => [
      word.id, scheduleReview(undefined, word.id, true, now - 2 * 86_400_000),
    ]));
    const basic = buildDailyLesson({ themes: [locked, free], words: lockedWords, isPremium: false, now, newCount: 1, maxReviews: 1 });
    expect(basic?.newWords).toHaveLength(1);
    expect(basic?.reviewWords).toEqual([]);
    const premium = buildDailyLesson({ themes: [locked, free], words: lockedWords, isPremium: true, now, newCount: 1, maxReviews: 1 });
    expect(premium?.theme.id).toBe('family');
    expect(premium?.newWords).toHaveLength(1);
    expect(premium?.reviewWords).toHaveLength(1);
    expect(premium?.reviewWords[0].themeId).toBe('animals');
    expect(buildDailyLesson({ themes: [locked], words: lockedWords, isPremium: false, now })).toBeNull();
  });
});
