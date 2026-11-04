import { expect, test } from '@jest/globals';

import { lessonArtSizes } from './artSizes';

test('phones keep the small pictures', () => {
  expect(lessonArtSizes(375, 812, false)).toEqual({ option: 88, card: 160, reward: 140, sticker: 96 });
});

test('tall tablets get bigger pictures and a bigger reward', () => {
  expect(lessonArtSizes(1024, 768, false)).toEqual({ option: 120, card: 220, reward: 180, sticker: 128 });
});

test('a reward with a new outfit keeps the phone-sized star and sticker', () => {
  expect(lessonArtSizes(1024, 768, true)).toEqual({ option: 120, card: 220, reward: 140, sticker: 96 });
});

test('wide but short windows grow only the answer pictures', () => {
  expect(lessonArtSizes(1024, 600, false)).toEqual({ option: 120, card: 160, reward: 140, sticker: 96 });
});

test('the thresholds are 600 px wide and 700 px tall, inclusive', () => {
  expect(lessonArtSizes(599, 900, false).option).toBe(88);
  expect(lessonArtSizes(600, 900, false).option).toBe(120);
  expect(lessonArtSizes(600, 699, false).card).toBe(160);
  expect(lessonArtSizes(600, 700, false)).toEqual({ option: 120, card: 220, reward: 180, sticker: 128 });
});
