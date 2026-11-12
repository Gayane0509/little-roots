import { expect, test } from '@jest/globals';

import { WIDE_BREAKPOINT } from '@/ui/tokens';

import { gameCardColumns, gameCardIconSize } from './gameListLayout';

test('game card pictures stay 56 on phones and grow to 88 on tablets', () => {
  expect(gameCardIconSize(320)).toBe(56);
  expect(gameCardIconSize(375)).toBe(56);
  expect(gameCardIconSize(WIDE_BREAKPOINT - 1)).toBe(56);
  expect(gameCardIconSize(WIDE_BREAKPOINT)).toBe(88);
  expect(gameCardIconSize(1024)).toBe(88);
});

test('games list shows two columns on tablets and one on phones', () => {
  expect(gameCardColumns(320)).toBe(1);
  expect(gameCardColumns(WIDE_BREAKPOINT - 1)).toBe(1);
  expect(gameCardColumns(WIDE_BREAKPOINT)).toBe(2);
  expect(gameCardColumns(1024)).toBe(2);
});
