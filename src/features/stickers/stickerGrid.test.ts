import { expect, test } from '@jest/globals';

import { stickerGrid, stickerSlots } from './stickerGrid';

test('phones get three columns, wide windows four', () => {
  expect(stickerGrid(320).columns).toBe(3);
  expect(stickerGrid(375).columns).toBe(3);
  expect(stickerGrid(768).columns).toBe(4);
  expect(stickerGrid(1024).columns).toBe(4);
});

test('the drawing grows with its tile and still fits inside it', () => {
  for (const width of [320, 375, 430, 599, 600, 768, 1024, 1400]) {
    const { artSize, tileWidth } = stickerGrid(width);
    const tile = Math.min(width - 32, 720) * (parseFloat(tileWidth) / 100);
    expect(artSize).toBeLessThanOrEqual(tile - 6); // inside the 3 px border
  }
  expect(stickerGrid(1024).artSize).toBeGreaterThan(stickerGrid(375).artSize);
  expect(stickerGrid(1024).artSize).toBeGreaterThanOrEqual(120);
});

test('the book always shows whole rows and at least 24 slots', () => {
  expect(stickerSlots(5, 3)).toBe(24);
  expect(stickerSlots(25, 3)).toBe(27);
  expect(stickerSlots(25, 4)).toBe(28);
});
