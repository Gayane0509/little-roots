import { describe, expect, it } from '@jest/globals';

import { wordIdForSticker } from './stickerArt';

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
