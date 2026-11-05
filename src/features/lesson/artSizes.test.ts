import { expect, test } from '@jest/globals';

import { spacing } from '@/ui/tokens';

import { INTRO_SEEDS_FROM, LESSON_COMPACT_BELOW, lessonArtSizes, REWARD_BIG_WITH_OUTFIT_FROM, SONG_TIGHT_BELOW } from './artSizes';

test('phones keep the small pictures', () => {
  expect(lessonArtSizes(375, 812, false)).toEqual({ option: 88, card: 160, reward: 140, sticker: 96, rewardRowsSideBySide: false, gap: spacing.lg, songLinePadding: spacing.md, songGap: spacing.sm, introSeeds: true });
});

test('tall tablets get bigger pictures, a bigger reward and the sticker + outfit side by side', () => {
  expect(lessonArtSizes(1024, 768, false)).toEqual({ option: 120, card: 220, reward: 180, sticker: 128, rewardRowsSideBySide: true, gap: spacing.lg, songLinePadding: spacing.md, songGap: spacing.sm, introSeeds: true });
});

test('short windows (iPhone SE, landscape) get the compact lesson; wide ones keep the big answer pictures', () => {
  expect(lessonArtSizes(375, 667, false)).toEqual({ option: 88, card: 104, reward: 104, sticker: 80, rewardRowsSideBySide: false, gap: spacing.sm, songLinePadding: spacing.sm, songGap: spacing.sm, introSeeds: true });
  expect(lessonArtSizes(1024, 600, false)).toMatchObject({ option: 120, card: 104, reward: 104, sticker: 80, gap: spacing.sm });
  expect(lessonArtSizes(375, LESSON_COMPACT_BELOW - 1, false).gap).toBe(spacing.sm);
  expect(lessonArtSizes(375, LESSON_COMPACT_BELOW, false)).toMatchObject({ card: 160, gap: spacing.lg });
});

test('the thresholds are 600 px wide and 700 px tall, inclusive', () => {
  expect(lessonArtSizes(599, 900, false).option).toBe(88);
  expect(lessonArtSizes(599, 900, false).rewardRowsSideBySide).toBe(false);
  expect(lessonArtSizes(600, 900, false).option).toBe(120);
  expect(lessonArtSizes(600, 699, false).card).toBe(104);
  expect(lessonArtSizes(600, 700, false)).toMatchObject({ option: 120, card: 220, reward: 180, sticker: 128, rewardRowsSideBySide: true });
});

test('a reward with a new outfit gets the big art only where the side-by-side row fits', () => {
  expect(lessonArtSizes(1024, 768, true)).toMatchObject({ reward: 180, sticker: 128, rewardRowsSideBySide: true });
  expect(lessonArtSizes(REWARD_BIG_WITH_OUTFIT_FROM - 1, 900, true)).toMatchObject({ reward: 140, sticker: 96, rewardRowsSideBySide: true });
  expect(lessonArtSizes(REWARD_BIG_WITH_OUTFIT_FROM, 900, true)).toMatchObject({ reward: 180, sticker: 128 });
  expect(lessonArtSizes(375, 812, true)).toMatchObject({ reward: 140, sticker: 96, rewardRowsSideBySide: false });
});

test('the rhyme step uses the tight gap below SONG_TIGHT_BELOW only', () => {
  expect(lessonArtSizes(375, SONG_TIGHT_BELOW - 1, false)).toMatchObject({ songGap: spacing.sm, gap: spacing.lg });
  expect(lessonArtSizes(375, SONG_TIGHT_BELOW, false).songGap).toBe(spacing.lg);
});

test('the intro seed row shows from 640 px tall; 320×568 leaves it out so the step does not scroll (#109)', () => {
  expect(lessonArtSizes(375, 667, false).introSeeds).toBe(true);
  expect(lessonArtSizes(320, 568, false).introSeeds).toBe(false);
  expect(lessonArtSizes(375, INTRO_SEEDS_FROM - 1, false).introSeeds).toBe(false);
  expect(lessonArtSizes(375, INTRO_SEEDS_FROM, false).introSeeds).toBe(true);
});
