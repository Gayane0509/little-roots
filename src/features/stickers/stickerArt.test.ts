import { describe, expect, it } from '@jest/globals';

import { stickerLabel, wordIdForSticker } from './stickerArt';

describe('wordIdForSticker', () => {
  it('finds saved word stickers across themes', () => {
    expect(wordIdForSticker('👩')).toBe('family.mom');
    expect(wordIdForSticker('🍎')).toBe('food.apple');
    expect(wordIdForSticker('🚗')).toBe('transport.car');
  });

  it('leaves unknown stickers as emoji', () => {
    expect(wordIdForSticker('🪄')).toBeUndefined();
  });
});

describe('stickerLabel', () => {
  it('names the word, not the emoji', () => {
    expect(stickerLabel('👩', 'family.mom')).toBe('Sticker: mom');
  });

  it('falls back to the emoji for an unknown sticker', () => {
    expect(stickerLabel('🪄')).toBe('Sticker: 🪄');
    expect(stickerLabel('🪄', 'no.such')).toBe('Sticker: 🪄');
  });
});
