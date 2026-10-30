import { describe, expect, it } from '@jest/globals';

import { THEMES } from '@/content/themes';

import { getWordArt } from './index';
import './words';

describe('word art', () => {
  it('has an illustration for every word', () => {
    const missing = THEMES.flatMap((t) => t.words).filter((w) => !getWordArt(w.id)).map((w) => w.id);
    expect(missing).toEqual([]);
  });

  it('uses only the allowed, self-contained SVG subset', () => {
    for (const word of THEMES.flatMap((t) => t.words)) {
      const xml = getWordArt(word.id) ?? '';
      expect(xml.startsWith('<svg')).toBe(true);
      expect(xml).toContain('viewBox="0 0 128 128"');
      expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b/);
      expect(xml).not.toMatch(/href=/);
    }
  });
});
