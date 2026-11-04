import { describe, expect, it } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';

import { ICONS } from './icons';
import { getWordArt } from './index';
import './words';

describe('word art', () => {
  it('has an illustration for every word', () => {
    const missing = ACTIVE_PACK.themes.flatMap((t) => t.words).filter((w) => !getWordArt(w.id)).map((w) => w.id);
    expect(missing).toEqual([]);
  });

  it('uses only the allowed, self-contained SVG subset', () => {
    for (const word of ACTIVE_PACK.themes.flatMap((t) => t.words)) {
      const xml = getWordArt(word.id) ?? '';
      expect(xml.startsWith('<svg')).toBe(true);
      expect(xml).toContain('viewBox="0 0 128 128"');
      expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b/);
      expect(xml).not.toMatch(/href=/);
    }
  });

  it('polyline and polygon points are plain numbers (a path command there stops the shape drawing)', () => {
    const svgs = [...ACTIVE_PACK.themes.flatMap((t) => t.words).map((w) => getWordArt(w.id) ?? ''), ...Object.values(ICONS)];
    const bad = svgs.flatMap((xml) => [...xml.matchAll(/<poly(?:line|gon)\b[^>]*\bpoints="([^"]*)"/g)].map((m) => m[1]))
      .filter((points) => !/^[\d\s.,-]*$/.test(points));
    expect(bad).toEqual([]);
  });

  it('UI icons follow the same SVG rules', () => {
    for (const xml of Object.values(ICONS)) {
      expect(xml.startsWith('<svg')).toBe(true);
      expect(xml).toContain('viewBox="0 0 128 128"');
      expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b/);
      expect(xml).not.toMatch(/href=/);
    }
  });
});
