import { expect, test } from '@jest/globals';

import { ACTIVE_PACK, getPack, PACKS, validatePack } from './index';
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
    audio: { 'nope.word': 1 },
  };
  const problems = validatePack(broken, base);
  expect(problems).toEqual(expect.arrayContaining([
    'duplicate word ids',
    'no free theme',
    `${first.words[1].id}: empty text`,
    'phrase greeting: placeholders differ',
    'audio nope.word: unknown word',
    `${first.id}: missing word ids ${first.words.slice(2).map((w) => w.id).join(', ')}`,
  ]));
});
