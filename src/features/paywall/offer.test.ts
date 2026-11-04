import { expect, test } from '@jest/globals';
import { comparison, freeWordsFinished, offerHeadline, parseOfferReason } from './offer';
import { ACTIVE_PACK } from '@/content/packs';
import type { ProgressState } from '@/state/progress.types';

test('offer reasons and limits stay consistent', () => {
  expect(offerHeadline('children')).toBe('Room for every child in your family');
  expect(comparison.find((row) => row.feature === 'Children')).toMatchObject({ free: '1', premium: '4' });
  expect(offerHeadline('games')).toBe('Unlimited games');
  expect(offerHeadline('unknown')).toBe('Every theme, letter and game for your family');
  expect(parseOfferReason('toString')).toBeUndefined();
  expect(parseOfferReason('games')).toBe('games');
  expect(comparison.find((row) => row.feature === 'Games per day')?.free).toBe('3');
});
test('free word celebration waits until all 16 words were seen', () => {
  const state = { words: {} } as ProgressState;
  expect(freeWordsFinished(state)).toBe(false);
  state.words = Object.fromEntries(ACTIVE_PACK.themes.filter((t) => t.free).flatMap((t) => t.words).map((w) => [w.id, { wordId: w.id, seen: 1, box: 0, dueAt: 0, correct: 1, learnedAt: 0 }]));
  expect(freeWordsFinished(state)).toBe(true);
});
