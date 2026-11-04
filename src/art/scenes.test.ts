import { describe, expect, it } from '@jest/globals';

import { contrastRatio } from '@/ui/contrast';
import { colors } from '@/ui/tokens';

import { SCENES } from './scenes';

describe('scene backdrops', () => {
  it('follow the word-art SVG rules', () => {
    for (const xml of Object.values(SCENES)) {
      expect(xml.startsWith('<svg')).toBe(true);
      expect(xml).toMatch(/viewBox="0 0 \d+ \d+"/);
      expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b/);
      expect(xml).not.toMatch(/href=/);
    }
  });

  it('keep body text readable on every fill (≥ 4.5:1)', () => {
    for (const xml of Object.values(SCENES)) {
      const fills = [...xml.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
      expect(fills.length).toBeGreaterThan(0);
      for (const fill of fills) expect(contrastRatio(colors.text, fill)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
