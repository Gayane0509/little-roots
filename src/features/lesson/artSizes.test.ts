import { expect, test } from '@jest/globals';

import { lessonArtSizes, REWARD_BIG_WITH_OUTFIT_FROM } from './artSizes';

test('phones keep the small pictures', () => {
  expect(lessonArtSizes(375, 812, false)).toEqual({ option: 88, card: 160, reward: 140, sticker: 96, rewardRowsSideBySide: false });
});

test('tall tablets get bigger pictures, a bigger reward and the sticker + outfit side by side', () => {
  expect(lessonArtSizes(1024, 768, false)).toEqual({ option: 120, card: 220, reward: 180, sticker: 128, rewardRowsSideBySide: true });
});


test('wide but short windows grow only the answer pictures', () => {
  expect(lessonArtSizes(1024, 600, false)).toEqual({ option: 120, card: 160, reward: 140, sticker: 96, rewardRowsSideBySide: true });
});

test('the thresholds are 600 px wide and 700 px tall, inclusive', () => {
  expect(lessonArtSizes(599, 900, false).option).toBe(88);
  expect(lessonArtSizes(599, 900, false).rewardRowsSideBySide).toBe(false);
  expect(lessonArtSizes(600, 900, false).option).toBe(120);
  expect(lessonArtSizes(600, 699, false).card).toBe(160);
  expect(lessonArtSizes(600, 700, false)).toEqual({ option: 120, card: 220, reward: 180, sticker: 128, rewardRowsSideBySide: true });
});

test('a reward with a new outfit gets the big art only where the side-by-side row fits', () => {
  expect(lessonArtSizes(1024, 768, true)).toMatchObject({ reward: 180, sticker: 128, rewardRowsSideBySide: true });
  expect(lessonArtSizes(REWARD_BIG_WITH_OUTFIT_FROM - 1, 900, true)).toMatchObject({ reward: 140, sticker: 96, rewardRowsSideBySide: true });
  expect(lessonArtSizes(REWARD_BIG_WITH_OUTFIT_FROM, 900, true)).toMatchObject({ reward: 180, sticker: 128 });
  expect(lessonArtSizes(375, 812, true)).toMatchObject({ reward: 140, sticker: 96, rewardRowsSideBySide: false });
});
