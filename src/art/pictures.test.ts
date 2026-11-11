import { describe, expect, it } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';
import { letterExampleArtId } from '@/features/letters/exampleArt';

import { getWordArt } from './index';
import { WORD_PICTURES } from './pictures';
import './words';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { existsSync, readFileSync, statSync } = require('fs') as {
  existsSync(path: string): boolean;
  readFileSync(path: string): Uint8Array;
  readFileSync(path: string, encoding: 'utf8'): string;
  statSync(path: string): { size: number };
};

// Jest runs from the project root.
const SOURCE = readFileSync('src/art/pictures.ts', 'utf8');
const files = [...SOURCE.matchAll(/require\('\.\.\/\.\.\/(assets\/words\/[^']+\.png)'\)/g)].map((m) => m[1]);

describe('word pictures (Fluent 3D)', () => {
  it('only name words the app shows: theme words and letter examples', () => {
    const ids = new Set([
      ...ACTIVE_PACK.themes.flatMap((theme) => theme.words).map((word) => word.id),
      ...ACTIVE_PACK.alphabet.map((letter) => letterExampleArtId(letter, ACTIVE_PACK.themes)),
    ]);
    expect(Object.keys(WORD_PICTURES).filter((id) => !ids.has(id))).toEqual([]);
  });

  it('every picture is a bundled PNG under 100 KB, shipped with its MIT licence', () => {
    expect(files).toHaveLength(Object.keys(WORD_PICTURES).length);
    for (const file of files) {
      expect(existsSync(file)).toBe(true);
      expect([...readFileSync(file).subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
      expect(statSync(file).size).toBeLessThan(100_000);
    }
    expect(readFileSync('assets/words/LICENSE', 'utf8')).toContain('MIT License');
  });

  it('every word still has a drawn SVG fallback, so a picture never falls back to an emoji', () => {
    expect(Object.keys(WORD_PICTURES).filter((id) => !getWordArt(id))).toEqual([]);
  });
});
