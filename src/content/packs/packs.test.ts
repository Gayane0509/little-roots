import { expect, test } from '@jest/globals';

import { ACTIVE_PACK, getPack, getTheme, getWord, PACKS, validatePack } from './index';
import type { LanguagePack } from './types';

test('every shipped pack is valid', () => {
  for (const pack of PACKS) expect(validatePack(pack, PACKS[0])).toEqual([]);
});

test('pack ids are unique and the active pack is shipped', () => {
  expect(new Set(PACKS.map((pack) => pack.id)).size).toBe(PACKS.length);
  expect(getPack(ACTIVE_PACK.id)).toBe(ACTIVE_PACK);
  expect(getPack('zz')).toBeUndefined();
});

test('validator reports broken packs', () => {
  const base = PACKS[0];
  const [first, ...rest] = base.themes;
  const broken: LanguagePack = {
    ...base,
    themes: [{ ...first, free: false, words: [first.words[0], first.words[0], { ...first.words[1], hy: ' ' }] }, ...rest.map((t) => ({ ...t, free: false }))],
    phrases: { ...base.phrases, greeting: { ...base.phrases.greeting, hy: 'Բարև' } },
  };
  const problems = validatePack(broken, base);
  expect(problems).toEqual(expect.arrayContaining([
    'duplicate word ids',
    'no free theme',
    `${first.words[1].id}: empty text`,
    'phrase greeting: placeholders differ',
    `${first.id}: missing word ids ${first.words.slice(2).map((w) => w.id).join(', ')}`,
  ]));
});

test('language content is read only through the active pack (no direct imports outside src/content)', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync, readFileSync, statSync } = require('fs') as {
    readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
  };
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = `${dir}/${name}`;
    if (path === 'src/content') return [];
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
  const direct = /from '@\/content\/(themes|alphabet|phrases)'/;
  expect(files('src').filter((path) => direct.test(readFileSync(path, 'utf8')))).toEqual([]);
});
test('getTheme and getWord resolve against the active pack', () => {
  const theme = ACTIVE_PACK.themes[0];
  expect(getTheme(theme.id)).toBe(theme);
  expect(getWord(theme.words[0].id)).toBe(theme.words[0]);
  expect(getWord('nope')).toBeUndefined();
});
