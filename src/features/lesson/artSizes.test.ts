import { expect, test } from '@jest/globals';

import { font, spacing } from '@/ui/tokens';

import { INTRO_SEEDS_FROM, LESSON_COMPACT_BELOW, lessonArtSizes, REWARD_BIG_FROM_HEIGHT, REWARD_BIG_WITH_OUTFIT_FROM, REWARD_WORDS_FROM, SONG_TIGHT_BELOW } from './artSizes';

test('phones keep the small pictures', () => {
  expect(lessonArtSizes(375, 812, false)).toEqual({ option: 88, card: 160, reward: 140, sticker: 96, rewardRowsSideBySide: false, gap: spacing.lg, songLinePadding: spacing.md, songGap: spacing.sm, introSeeds: true, intro: 140, songPicture: 32, songEnglishOnTap: false, songTitleSize: font.title, promptWord: font.title, rewardWords: true, rewardGap: spacing.lg });
});

test('tall tablets get bigger pictures, a bigger reward and the sticker + outfit side by side', () => {
  expect(lessonArtSizes(1024, 1366, false)).toMatchObject({ reward: 180, sticker: 128, rewardGap: spacing.lg });
  expect(lessonArtSizes(1024, 768, false)).toEqual({ option: 120, card: 220, reward: 140, sticker: 96, rewardRowsSideBySide: true, gap: spacing.lg, songLinePadding: spacing.md, songGap: spacing.sm, introSeeds: true, intro: 200, songPicture: 32, songEnglishOnTap: false, songTitleSize: font.title, promptWord: font.word, rewardWords: true, rewardGap: spacing.md });
});

test('short windows (iPhone SE, landscape) get the compact lesson; wide ones keep the big answer pictures', () => {
  expect(lessonArtSizes(375, 667, false)).toEqual({ option: 88, card: 104, reward: 104, sticker: 80, rewardRowsSideBySide: false, gap: spacing.sm, songLinePadding: spacing.sm, songGap: spacing.sm, introSeeds: true, intro: 140, songPicture: 24, songEnglishOnTap: true, songTitleSize: font.heading, promptWord: font.title, rewardWords: true, rewardGap: spacing.sm });
  expect(lessonArtSizes(1024, 600, false)).toMatchObject({ option: 120, card: 104, reward: 104, sticker: 80, gap: spacing.sm, promptWord: font.title });
  expect(lessonArtSizes(375, LESSON_COMPACT_BELOW - 1, false).gap).toBe(spacing.sm);
  expect(lessonArtSizes(375, LESSON_COMPACT_BELOW, false)).toMatchObject({ card: 160, gap: spacing.lg });
});

test('the thresholds are 600 px wide and 700 px tall, inclusive', () => {
  expect(lessonArtSizes(599, 900, false).option).toBe(88);
  expect(lessonArtSizes(599, 900, false).rewardRowsSideBySide).toBe(false);
  expect(lessonArtSizes(600, 900, false).option).toBe(120);
  expect(lessonArtSizes(600, 699, false).card).toBe(104);
  expect(lessonArtSizes(600, 700, false)).toMatchObject({ option: 120, card: 220, reward: 140, sticker: 96, rewardRowsSideBySide: true });
  expect(lessonArtSizes(600, REWARD_BIG_FROM_HEIGHT, false)).toMatchObject({ reward: 180, sticker: 128 });
});

test('a reward with a new outfit gets the big art only where the side-by-side row fits', () => {
  expect(lessonArtSizes(1024, 1366, true)).toMatchObject({ reward: 180, sticker: 128, rewardRowsSideBySide: true });
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

test('the Family rhyme fits a 375×667 window with one line opened (#115)', () => {
  const art = lessonArtSizes(375, 667, false);
  // Measured at 375×667 before #115: each line 89 px (two 22 px lines of Armenian 52 + English 17, padding 8, border 2) and
  // the step 50 px too tall. Now a line is the taller of the text and the stacked pictures, plus padding and border.
  const line = (english: boolean) => Math.max(52 + (english ? 17 : 0), 2 * art.songPicture + 4) + 2 * art.songLinePadding + 4;
  const saved = 4 * 89 - (3 * line(false) + line(true)) + (36 - 27); // title line height at 30 px → 22 px
  expect(saved).toBeGreaterThanOrEqual(50);
});

test("the reward's word row shows unless a short window also shows a new outfit (#113)", () => {
  expect(lessonArtSizes(375, 667, false).rewardWords).toBe(true);
  expect(lessonArtSizes(375, 667, true).rewardWords).toBe(false);
  expect(lessonArtSizes(375, 812, true).rewardWords).toBe(true);
  expect(lessonArtSizes(320, REWARD_WORDS_FROM - 1, false).rewardWords).toBe(false);
});

test('the intro theme picture grows only on tall tablets (#141)', () => {
  expect(lessonArtSizes(1024, 768, false).intro).toBe(200);
  expect(lessonArtSizes(768, 1024, false).intro).toBe(200);
  expect(lessonArtSizes(375, 812, false).intro).toBe(140);
  expect(lessonArtSizes(320, 568, false).intro).toBe(140);
  expect(lessonArtSizes(1024, 600, false).intro).toBe(140);
});

test('below REWARD_BIG_FROM_HEIGHT a tablet reward keeps today\'s words above the footer (#187)', () => {
  // 1024×768 iPad landscape: the big art + words row was 660 px in a 576 px step.
  expect(lessonArtSizes(1024, 768, true)).toMatchObject({ reward: 140, sticker: 96, rewardWords: true, rewardGap: spacing.md });
  expect(lessonArtSizes(1024, REWARD_BIG_FROM_HEIGHT - 1, false)).toMatchObject({ reward: 140, rewardGap: spacing.md });
  expect(lessonArtSizes(1024, REWARD_BIG_FROM_HEIGHT, false)).toMatchObject({ reward: 180, rewardGap: spacing.lg });
  // Phones keep their gap; the reward gap only tightens on wide windows.
  expect(lessonArtSizes(375, 812, true).rewardGap).toBe(spacing.lg);
});
