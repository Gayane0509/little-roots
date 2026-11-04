import { expect, test } from '@jest/globals';
import { getWordArt } from '@/art';
import '@/art/words';
import { ACTIVE_PACK } from '@/content/packs';
import { letterExampleArtId } from './exampleArt';

test('every letter example has a drawing, so the letter sheet never falls back to an emoji (#89)', () => {
  const missing = ACTIVE_PACK.alphabet.filter((letter) => !getWordArt(letterExampleArtId(letter, ACTIVE_PACK.themes))).map((letter) => `${letter.upper} ${letter.example.en}`);
  expect(missing).toEqual([]);
});

test('theme words reuse their theme drawing; other examples use a letters.* picture keyed by the English word', () => {
  const byUpper = (upper: string) => ACTIVE_PACK.alphabet.find((letter) => letter.upper === upper)!;
  expect(letterExampleArtId(byUpper('Ա'), ACTIVE_PACK.themes)).toBe('animals.bear');
  expect(letterExampleArtId(byUpper('Բ'), ACTIVE_PACK.themes)).toBe('letters.duck');
  expect(letterExampleArtId(byUpper('Ղ'), ACTIVE_PACK.themes)).toBe('letters.ship_s_wheel');
});

test('letter pictures follow the word-art SVG rules', () => {
  for (const letter of ACTIVE_PACK.alphabet) {
    const xml = getWordArt(letterExampleArtId(letter, ACTIVE_PACK.themes)) ?? '';
    expect(xml.startsWith('<svg')).toBe(true);
    expect(xml).toContain('viewBox="0 0 128 128"');
    expect(xml).not.toMatch(/<(text|style|image|script|linearGradient|radialGradient|filter|use)\b/);
    expect(xml).not.toMatch(/href=/);
    expect([...xml.matchAll(/<poly(?:line|gon)\b[^>]*\bpoints="([^"]*)"/g)].map((m) => m[1]).filter((points) => !/^[\d\s.,-]*$/.test(points))).toEqual([]);
  }
});
