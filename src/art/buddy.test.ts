import { expect, test } from '@jest/globals';
import { BUDDY_ART, BUDDY_BLINK, BUDDY_FUR_LIT, BUDDY_MOODS, BUDDY_OUTFIT_ART, BUDDY_OUTFITS } from './buddy';

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

test('blink lids use the lit fur tone, and the lit face circle covers each lid inside the head (#155)', () => {
  for (const [mood, lids] of Object.entries(BUDDY_BLINK)) {
    const art = BUDDY_ART[mood as keyof typeof BUDDY_ART];
    const head = /<circle cx="64" cy="65" r="43"/.exec(art);
    const lit = new RegExp(`<circle cx="(\\d+)" cy="(\\d+)" r="(\\d+)" fill="${BUDDY_FUR_LIT}"/>`).exec(art);
    expect(head).not.toBeNull();
    expect(lit).not.toBeNull();
    const [cx, cy, r] = (lit ?? []).slice(1).map(Number) as [number, number, number];
    // The lit circle stays inside the head outline's inner edge (43 − 1.5).
    expect(Math.hypot(cx - 64, cy - 65) + r).toBeLessThanOrEqual(41.5);
    for (const m of (lids ?? '').matchAll(/<circle cx="(\d+)" cy="(\d+)" r="([\d.]+)" fill="([^"]+)"/g)) {
      expect(m[4]).toBe(BUDDY_FUR_LIT);
      expect(Math.hypot(Number(m[1]) - cx, Number(m[2]) - cy) + Number(m[3])).toBeLessThanOrEqual(r);
    }
  }
});

test('every pose and every outfit item has a white sheen for the 3D look (#177)', () => {
  const sheen = /<path d="[^"]+" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0\.\d+"\/>/;
  for (const mood of BUDDY_MOODS) {
    expect(BUDDY_ART[mood]).toMatch(sheen);
    for (const item of BUDDY_OUTFITS) expect(BUDDY_OUTFIT_ART[item][mood]).toMatch(sheen);
  }
});

test('the pointing finger is a filled fur tip inside the canvas, not a bare outline stroke (#178)', () => {
  const art = BUDDY_ART.point;
  expect(art).not.toContain('M120 97 L126 96');
  const tip = art.match(/<ellipse cx="([\d.]+)" cy="[\d.]+" rx="([\d.]+)" ry="[\d.]+" fill="#[0-9A-F]{6}" stroke="#5C3018" stroke-width="3"/);
  expect(tip).not.toBeNull();
  const [, cx, rx] = tip!.map(Number);
  expect(cx + rx + 1.5).toBeLessThanOrEqual(128);
  expect(art.indexOf(tip![0])).toBeLessThan(art.indexOf('M86 96 Q100 90'));
});
