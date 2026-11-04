import { expect, test } from '@jest/globals';
import { BUDDY_ART, BUDDY_BLINK, BUDDY_MOODS, BUDDY_OUTFIT_ART, BUDDY_OUTFITS } from './buddy';

test('every buddy mood is a self-contained illustration', () => {
  expect(Object.keys(BUDDY_ART).sort()).toEqual(['cheer', 'happy', 'point', 'proud', 'sleep', 'think', 'wave']);
  for (const xml of [...Object.values(BUDDY_ART), ...Object.values(BUDDY_BLINK)]) {
    expect(xml.startsWith('<svg')).toBe(true);
    expect(xml).toContain('viewBox="0 0 128 128"');
    expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b|href=/);
  }
});

test('poses differ from each other', () => {
  expect(new Set(BUDDY_MOODS.map((mood) => BUDDY_ART[mood])).size).toBe(BUDDY_MOODS.length);
});

test('only moods with open eyes blink, and each lid covers an eye of that mood', () => {
  expect(Object.keys(BUDDY_BLINK).sort()).toEqual(['cheer', 'happy', 'point', 'wave']);
  for (const [mood, lids] of Object.entries(BUDDY_BLINK)) {
    const eyes = [...BUDDY_ART[mood as keyof typeof BUDDY_ART].matchAll(/<circle cx="(\d+)" cy="65" r="3.5"/g)].map((m) => m[1]);
    const lidCentres = [...(lids ?? '').matchAll(/<circle cx="(\d+)" cy="65"/g)].map((m) => m[1]);
    expect(lidCentres).toEqual(eyes);
  }
});

test('every outfit has a self-contained overlay for every mood', () => {
  for (const item of BUDDY_OUTFITS) {
    for (const mood of BUDDY_MOODS) {
      const xml = BUDDY_OUTFIT_ART[item][mood];
      expect(xml.startsWith('<svg')).toBe(true);
      expect(xml).toContain('viewBox="0 0 128 128"');
      expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b|href=/);
    }
  }
});

test('glasses frame the open eyes of each mood', () => {
  for (const [mood, lids] of Object.entries(BUDDY_BLINK)) {
    const lidCentres = [...(lids ?? '').matchAll(/<circle cx="(\d+)" cy="65"/g)].map((m) => m[1]);
    const frames = [...BUDDY_OUTFIT_ART.glasses[mood as keyof typeof BUDDY_ART].matchAll(/<circle cx="(\d+)" cy="65"/g)].map((m) => m[1]);
    expect(frames).toEqual(lidCentres);
  }
});
