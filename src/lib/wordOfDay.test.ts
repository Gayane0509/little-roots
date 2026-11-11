import { describe, expect, it } from '@jest/globals';
import type { Theme, Word } from '@/content/types';
import { localDay } from './date';
import { scheduleReview } from './srs';
import { wordOfTheDay } from './wordOfDay';

function theme(id: Theme['id'], free: boolean): Theme {
  const words: Word[] = [0, 1, 2, 3, 4, 5].map((index) => ({
    id: `${id}.${index}`, themeId: id, hy: `հայ${index}`, translit: `hay${index}`, en: `word${index}`, emoji: '🍎',
  }));
  return { id, free, words, titleHy: 'Թեմա', titleEn: id, emoji: '🍎', color: '#fff', song: { id: `${id}.song`, themeId: id, title: 'Song', lines: [] } };
}

const family = theme('family', true);
const food = theme('food', true);
const animals = theme('animals', false);
const themes = [family, food, animals];
const now = Date.UTC(2026, 10, 11);
/** Words met `at` (default: weeks before every test day). */
const met = (ids: string[], at = now - 30 * 86_400_000) => Object.fromEntries(ids.map((id) => [id, scheduleReview(undefined, id, true, at)]));

describe('word of the day', () => {
  it('stays the same all day when today\'s lesson adds words', () => {
    const morning = met(family.words.map((word) => word.id));
    const evening = { ...morning, ...met(food.words.map((word) => word.id), Date.now()) };
    const day = localDay(Date.now());
    expect(wordOfTheDay({ themes, words: evening, isPremium: false, day, seed: 'child-1' }))
      .toBe(wordOfTheDay({ themes, words: morning, isPremium: false, day, seed: 'child-1' }));
  });

  it('keeps the next-lesson preview after the first lesson of the day', () => {
    const day = localDay(Date.now());
    const preview = wordOfTheDay({ themes, words: {}, isPremium: false, day, seed: 'kid' });
    const afterLesson = met(['family.0', 'family.1', 'family.2'], Date.now());
    expect(wordOfTheDay({ themes, words: afterLesson, isPremium: false, day, seed: 'kid' })).toBe(preview);
  });

  it('gives siblings different words on some days', () => {
    const words = met([...family.words, ...food.words].map((word) => word.id));
    const days = Array.from({ length: 14 }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);
    const differs = days.filter((day) => wordOfTheDay({ themes, words, isPremium: false, day, seed: 'mari' })?.id !== wordOfTheDay({ themes, words, isPremium: false, day, seed: 'aram' })?.id);
    expect(differs.length).toBeGreaterThan(0);
  });

  it('includes met words of premium themes with Premium', () => {
    const words = met(['animals.3']);
    expect(wordOfTheDay({ themes, words, isPremium: true, day: '2026-11-11', seed: 'kid' })?.id).toBe('animals.3');
  });

  it('changes across days', () => {
    const words = met([...family.words, ...food.words].map((word) => word.id));
    const days = Array.from({ length: 14 }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);
    const picked = new Set(days.map((day) => wordOfTheDay({ themes, words, isPremium: false, day, seed: 'child-1' })?.id));
    expect(picked.size).toBeGreaterThan(3);
  });

  it('comes only from words the child has met', () => {
    const words = met(['food.2', 'family.4']);
    for (let d = 1; d <= 30; d++) {
      const word = wordOfTheDay({ themes, words, isPremium: false, day: `2026-12-${String(d).padStart(2, '0')}`, seed: 'kid' });
      expect(['food.2', 'family.4']).toContain(word?.id);
    }
  });

  it('skips met words of locked themes', () => {
    const words = met(['animals.0', 'family.1']);
    for (let d = 1; d <= 30; d++) {
      expect(wordOfTheDay({ themes, words, isPremium: false, day: `2026-12-${String(d).padStart(2, '0')}`, seed: 'kid' })?.id).toBe('family.1');
    }
  });

  it('previews the next lesson theme before any word is met', () => {
    const word = wordOfTheDay({ themes, words: {}, isPremium: false, day: '2026-11-11', seed: 'kid' });
    expect(word?.themeId).toBe('family');
  });

  it('is null when there are no words', () => {
    expect(wordOfTheDay({ themes: [], words: {}, isPremium: false, day: '2026-11-11', seed: 'kid' })).toBeNull();
  });
});
