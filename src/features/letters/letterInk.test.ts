import { expect, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';
import { LETTER_INK, traceBaselineY } from './letterInk';

interface FontBuffer {
  readUInt16BE(offset: number): number; readUInt32BE(offset: number): number; readInt16BE(offset: number): number;
  toString(encoding: 'latin1', start: number, end: number): string;
}
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest runs in Node; the app has no Node types.
const { readFileSync } = require('fs') as { readFileSync(path: string): FontBuffer };

/** Glyph [yMax, yMin] per character from the TTF itself (head, cmap format 4, loca, glyf headers). */
function fontInk(path: string, chars: string[]): Record<string, [number, number]> {
  const buf = readFileSync(path);
  const tables: Record<string, number> = {};
  for (let i = 0; i < buf.readUInt16BE(4); i++) tables[buf.toString('latin1', 12 + i * 16, 16 + i * 16)] = buf.readUInt32BE(20 + i * 16);
  const longLoca = buf.readInt16BE(tables.head + 50) === 1;
  let sub = -1;
  for (let i = 0; i < buf.readUInt16BE(tables.cmap + 2); i++) {
    const offset = tables.cmap + buf.readUInt32BE(tables.cmap + 8 + i * 8);
    if (buf.readUInt16BE(offset) === 4) { sub = offset; break; }
  }
  const segX2 = buf.readUInt16BE(sub + 6);
  const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
  const glyphId = (cp: number) => {
    for (let s = 0; s < segX2; s += 2) {
      if (cp > buf.readUInt16BE(ends + s)) continue;
      const start = buf.readUInt16BE(starts + s);
      if (cp < start) return 0;
      const delta = buf.readInt16BE(deltas + s);
      const range = buf.readUInt16BE(ranges + s);
      if (!range) return (cp + delta) & 0xffff;
      const g = buf.readUInt16BE(ranges + s + range + 2 * (cp - start));
      return g ? (g + delta) & 0xffff : 0;
    }
    return 0;
  };
  const loca = (g: number) => longLoca ? buf.readUInt32BE(tables.loca + 4 * g) : buf.readUInt16BE(tables.loca + 2 * g) * 2;
  return Object.fromEntries(chars.map((char) => {
    const glyph = tables.glyf + loca(glyphId(char.codePointAt(0)!));
    return [char, [buf.readInt16BE(glyph + 8), buf.readInt16BE(glyph + 4)]];
  }));
}

const alphabetChars = [...new Set(ACTIVE_PACK.alphabet.flatMap((letter) => [...letter.upper, ...letter.lower]))];

test('the ink table covers every alphabet character and matches the bundled font file', () => {
  const font = 'node_modules/@expo-google-fonts/noto-sans-armenian/700Bold/NotoSansArmenian_700Bold.ttf';
  expect(Object.keys(LETTER_INK).sort()).toEqual([...alphabetChars].sort());
  expect(LETTER_INK).toEqual(fontInk(font, alphabetChars));
});

test('every alphabet letter is drawn with its ink centred in the box', () => {
  for (const letter of ACTIVE_PACK.alphabet) {
    for (const [text, upper] of [[letter.upper, true], [letter.lower, false]] as const) {
      const baseline = traceBaselineY(text, 200, 140, upper);
      const ink = [...text].map((char) => LETTER_INK[char]);
      const top = baseline - 140 * Math.max(...ink.map((i) => i[0])) / 1000;
      const bottom = baseline - 140 * Math.min(...ink.map((i) => i[1])) / 1000;
      expect((top + bottom) / 2).toBeCloseTo(100, 6);
      expect(top).toBeGreaterThanOrEqual(30);
      expect(bottom).toBeLessThanOrEqual(170);
    }
  }
});

test('ascender and descender letters no longer share one baseline', () => {
  expect(traceBaselineY('ե', 200, 140, false)).toBeCloseTo(152.5, 1);
  expect(traceBaselineY('բ', 200, 140, false)).toBeCloseTo(119, 1);
  expect(traceBaselineY('Ու', 200, 140, true)).toBeCloseTo(150.7, 1);
});

test('text outside the table keeps the old fixed offsets', () => {
  expect(traceBaselineY('A', 200, 140, true)).toBe(149);
  expect(traceBaselineY('a', 200, 140, false)).toBe(121);
  expect(traceBaselineY('', 200, 140, true)).toBe(100);
});
