import { expect, test } from '@jest/globals';
import { comparison, freeWordsFinished, offerHeadline, parseOfferReason, PREMIUM_THEMES, PREMIUM_WORDS, premiumStripLayout } from './offer';
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
test('the themes headline counts the Premium words, so new themes keep it true (#144)', () => {
  const premium = ACTIVE_PACK.themes.filter((t) => !t.free).reduce((sum, t) => sum + t.words.length, 0);
  expect(offerHeadline('themes')).toBe(`${premium} more words to discover`);
});
test('free word celebration waits until all 16 words were seen', () => {
  const state = { words: {} } as ProgressState;
  expect(freeWordsFinished(state)).toBe(false);
  state.words = Object.fromEntries(ACTIVE_PACK.themes.filter((t) => t.free).flatMap((t) => t.words).map((w) => [w.id, { wordId: w.id, seen: 1, box: 0, dueAt: 0, correct: 1, learnedAt: 0 }]));
  expect(freeWordsFinished(state)).toBe(true);
});

test('the paywall picture strip matches the comparison table (#121)', () => {
  const words = comparison.find((row) => row.feature === 'Words');
  expect(PREMIUM_THEMES.length).toBeGreaterThan(0);
  expect(PREMIUM_THEMES.every((theme) => !theme.free)).toBe(true);
  expect(Number(words?.free) + PREMIUM_WORDS).toBe(Number(words?.premium));
});

test('the picture strip makes even rows and stays inside the column (#139)', () => {
  for (const width of [280, 320, 375, 414, 768, 1024]) {
    const { tile, art, rowWidth } = premiumStripLayout(width, 10);
    expect(rowWidth).toBeLessThanOrEqual(width - 32);
    const perRow = (rowWidth + 8) / (tile + 8);
    expect([5, 10]).toContain(perRow);
    expect(art).toBeLessThan(tile);
  }
  expect(premiumStripLayout(375, 10).tile).toBe(56);
  expect(premiumStripLayout(320, 10)).toEqual({ tile: 51, art: 36, rowWidth: 287 });
  expect(premiumStripLayout(1024, 10).rowWidth).toBe(632);
});
