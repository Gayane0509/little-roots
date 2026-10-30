import { expect, test } from '@jest/globals';
import { comparison, freeWordsFinished, offerHeadline, parseOfferReason } from './offer';
import { THEMES } from '@/content/themes';
import type { ProgressState } from '@/state/progress.types';

test('offer reasons and limits stay consistent', () => {
  expect(offerHeadline('games')).toBe('Unlimited games');
  expect(offerHeadline('unknown')).toContain('grandma');
  expect(parseOfferReason('toString')).toBeUndefined();
  expect(parseOfferReason('games')).toBe('games');
  expect(comparison.find((row) => row.feature === 'Games per day')?.free).toBe('3');
});
test('free word celebration waits until all 16 words were seen', () => {
  const state = { words: {} } as ProgressState;
  expect(freeWordsFinished(state)).toBe(false);
  state.words = Object.fromEntries(THEMES.filter((t) => t.free).flatMap((t) => t.words).map((w) => [w.id, { wordId: w.id, seen: 1, box: 0, dueAt: 0, correct: 1, learnedAt: 0 }]));
  expect(freeWordsFinished(state)).toBe(true);
});
