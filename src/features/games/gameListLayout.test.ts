import { expect, test } from '@jest/globals';

import { WIDE_BREAKPOINT } from '@/ui/tokens';

import { gameCardIconSize } from './gameListLayout';

test('game card pictures stay 56 on phones and grow to 88 on tablets', () => {
  expect(gameCardIconSize(320)).toBe(56);
  expect(gameCardIconSize(375)).toBe(56);
  expect(gameCardIconSize(WIDE_BREAKPOINT - 1)).toBe(56);
  expect(gameCardIconSize(WIDE_BREAKPOINT)).toBe(88);
  expect(gameCardIconSize(1024)).toBe(88);
});
