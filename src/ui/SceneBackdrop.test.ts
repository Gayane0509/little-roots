import { describe, expect, it } from '@jest/globals';

import { SCENES } from '@/art/scenes';

import { SCENE_ART_TOP, sceneHeight } from './SceneBackdrop';

/** Smallest y any shape reaches (absolute path control points bound the curve, so their minimum is a safe lower bound). */
function artTop(xml: string): number {
  const tops: number[] = [];
  for (const [, attrs] of xml.matchAll(/<(?:ellipse|circle|rect)\b([^>]*)>/g)) {
    const num = (name: string) => Number(new RegExp(`\\b${name}="([\\d.]+)"`).exec(attrs)?.[1] ?? NaN);
    tops.push(attrs.includes('cy=') ? num('cy') - (attrs.includes('ry=') ? num('ry') : num('r')) : num('y'));
  }
  for (const [, d] of xml.matchAll(/\bd="([^"]+)"/g)) {
    // Only absolute M / C / L / Z commands are x,y pairs; fail loudly on anything else instead of misreading it.
    expect(d.replace(/[\d.\s-]/g, '')).toMatch(/^[MCLZ]*$/);
    const values = d.match(/-?[\d.]+/g)!.map(Number);
    for (let i = 1; i < values.length; i += 2) tops.push(values[i]);
  }
  return Math.min(...tops);
}

describe('sceneHeight', () => {
  it('is about a third of the width on phones and capped on tablets', () => {
    expect(sceneHeight(375)).toBe(113);
    expect(sceneHeight(800)).toBe(240);
    expect(sceneHeight(979)).toBe(240);
  });

  it('grows past 240 on wide tablets so the slice crop never reaches the art', () => {
    expect(sceneHeight(1024)).toBe(251);
    for (const width of [320, 375, 430, 600, 768, 800, 834, 1024, 1180, 1366, 1376]) {
      const height = sceneHeight(width);
      const croppedUnits = 120 - (height * 400) / width;
      expect(croppedUnits).toBeLessThanOrEqual(SCENE_ART_TOP);
    }
  });

  it('keeps every scene shape below SCENE_ART_TOP', () => {
    for (const xml of Object.values(SCENES)) {
      const top = artTop(xml);
      expect(Number.isFinite(top)).toBe(true);
      expect(top).toBeGreaterThanOrEqual(SCENE_ART_TOP);
    }
  });
});
