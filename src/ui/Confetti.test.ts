import { expect, test } from '@jest/globals';

import { confettiPieces } from './Confetti';

test('confetti spreads to both sides, uses several colours, and is the same every time', () => {
  const pieces = confettiPieces();
  expect(pieces.some((p) => p.dx < -50)).toBe(true);
  expect(pieces.some((p) => p.dx > 50)).toBe(true);
  expect(new Set(pieces.map((p) => p.color)).size).toBeGreaterThanOrEqual(5);
  expect(confettiPieces()).toEqual(pieces);
});
