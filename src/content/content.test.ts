import { describe, expect, it } from '@jest/globals';
import { THEMES, getTheme, getWord } from './themes';

describe('content', () => {
  const all = THEMES.flatMap((t) => t.words);

  it('has 12 themes in order', () => {
    expect(THEMES.map((t) => t.id)).toEqual([
      'family',
      'food',
      'animals',
      'colors',
      'numbers',
      'body',
      'clothes',
      'home',
      'toys',
      'nature',
      'transport',
      'feelings',
    ]);
  });

  it('has unique word ids', () => {
    expect(new Set(all.map((w) => w.id)).size).toBe(all.length);
  });

  it('has 8 words per theme with prefixed ids and a 4-line song', () => {
    for (const t of THEMES) {
      expect(t.words).toHaveLength(8);
      expect(t.song.lines).toHaveLength(4);
      for (const w of t.words) {
        expect(w.themeId).toBe(t.id);
        expect(w.id.startsWith(`${t.id}.`)).toBe(true);
      }
    }
  });

  it('only family and food are free', () => {
    for (const t of THEMES) expect(t.free).toBe(t.id === 'family' || t.id === 'food');
  });

  it('has unique ids and unique emojis within each theme', () => {
    for (const t of THEMES) {
      expect(new Set(t.words.map((w) => w.id)).size).toBe(t.words.length);
      expect(new Set(t.words.map((w) => w.emoji)).size).toBe(t.words.length);
    }
  });

  it('has complete word fields', () => {
    for (const w of all) {
      for (const v of [w.hy, w.translit, w.en, w.emoji]) expect(v.trim()).not.toBe('');
    }
  });

  it('looks words and themes up', () => {
    expect(getWord('family.mom')?.hy).toBe('մայրիկ');
    expect(getWord('nope')).toBeUndefined();
    expect(getTheme('food').id).toBe('food');
  });
});
