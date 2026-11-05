import { expect, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';

import { highlightLetter } from './exampleHighlight';

test('the letter is found at the start or inside the example word (#110)', () => {
  expect(highlightLetter('բադ', { upper: 'Բ', lower: 'բ' })).toEqual({ before: '', letter: 'բ', after: 'ադ' });
  expect(highlightLetter('արև', { upper: 'ԵՒ', lower: 'և' })).toEqual({ before: 'ար', letter: 'և', after: '' });
  expect(highlightLetter('ծով', { upper: 'Բ', lower: 'բ' })).toBeNull();
});

test('every alphabet example shows its letter, and the parts rebuild the word', () => {
  for (const letter of ACTIVE_PACK.alphabet) {
    const parts = highlightLetter(letter.example.hy, letter);
    expect(parts).not.toBeNull();
    expect(`${parts?.before}${parts?.letter}${parts?.after}`).toBe(letter.example.hy);
  }
});
