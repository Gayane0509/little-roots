import { expect, test } from '@jest/globals';

import { isBuddyOutfit, stickersNeeded, unlockedOutfits, wornOutfit } from './outfits';

test('outfits unlock at 3, 6 and 10 stickers', () => {
  expect(unlockedOutfits(0)).toEqual([]);
  expect(unlockedOutfits(2)).toEqual([]);
  expect(unlockedOutfits(3)).toEqual(['hat']);
  expect(unlockedOutfits(6)).toEqual(['hat', 'glasses']);
  expect(unlockedOutfits(9)).toEqual(['hat', 'glasses']);
  expect(unlockedOutfits(10)).toEqual(['hat', 'glasses', 'crown']);
});

test('counts the stickers still needed', () => {
  expect(stickersNeeded('crown', 4)).toBe(6);
  expect(stickersNeeded('hat', 12)).toBe(0);
});

test('only known outfit ids are accepted', () => {
  expect(isBuddyOutfit('hat')).toBe(true);
  expect(isBuddyOutfit('scarf')).toBe(false);
  expect(isBuddyOutfit(3)).toBe(false);
});

test('a saved outfit is worn only while it is unlocked', () => {
  expect(wornOutfit({ buddyOutfit: 'glasses', stickers: Array(6).fill('s') })).toBe('glasses');
  expect(wornOutfit({ buddyOutfit: 'glasses', stickers: Array(5).fill('s') })).toBeUndefined();
  expect(wornOutfit({ stickers: Array(10).fill('s') })).toBeUndefined();
});
