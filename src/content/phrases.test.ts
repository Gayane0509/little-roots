import { describe, expect, it } from '@jest/globals';
import { PHRASES } from './phrases';

describe('PHRASES', () => {
  it('has hy, translit and en for every key', () => {
    for (const p of Object.values(PHRASES) as { hy: string; translit: string; en: string }[]) {
      expect(p.hy.length).toBeGreaterThan(0);
      expect(p.translit.length).toBeGreaterThan(0);
      expect(p.en.length).toBeGreaterThan(0);
    }
  });
  it('has a singular English line for one new word', () => {
    expect(PHRASES.lesson_new_word.en.replace('{count}', '1')).toBe("Let's learn 1 new word!");
    expect(PHRASES.lesson_new_words.en.replace('{count}', '3')).toBe("Let's learn 3 new words!");
    expect(PHRASES.lesson_new_word.hy).toBe(PHRASES.lesson_new_words.hy);
  });
  it('uses the same placeholders in every language', () => {
    for (const p of Object.values(PHRASES) as { hy: string; translit: string; en: string }[]) {
      const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
      expect(ph(p.hy)).toBe(ph(p.en));
      expect(ph(p.translit)).toBe(ph(p.en));
    }
  });
});
