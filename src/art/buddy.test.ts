import { expect, test } from '@jest/globals';
import { BUDDY_ART } from './buddy';

test('every buddy mood is a self-contained illustration', () => {
  expect(Object.keys(BUDDY_ART).sort()).toEqual(['cheer', 'happy', 'sleep', 'think']);
  for (const xml of Object.values(BUDDY_ART)) {
    expect(xml.startsWith('<svg')).toBe(true);
    expect(xml).toContain('viewBox="0 0 128 128"');
    expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b|href=/);
  }
});
