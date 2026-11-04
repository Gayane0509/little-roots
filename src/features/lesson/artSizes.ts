import { spacing, WIDE_BREAKPOINT } from '@/ui/tokens';

export type LessonArtSizes = {
  option: number; card: number; reward: number; sticker: number; rewardRowsSideBySide: boolean;
  /** Gap and vertical padding of the step content, and the rhyme lines' padding (tighter on short windows). */
  gap: number; songLinePadding: number;
};

/** Windows shorter than this (iPhone SE 375×667) get the compact lesson (#84): the word card, rhyme and reward overflowed. */
export const LESSON_COMPACT_BELOW = 700;

/**
 * Picture sizes in the lesson. Answer pictures grow on any wide window so they fill the wider option cards (#71). The
 * word card picture and the reward's star and sticker (#81) grow only on tall tablets, so those steps needn't scroll;
 * on short windows they shrink and the step spacing tightens instead.
 * On wide windows a new sticker and a new outfit sit side by side (#82) instead of stacking, so a reward with both
 * fits a 768-tall iPad without scrolling. With the big art that row is ~575 px wide and would wrap in the 568 px
 * column of a 600 px window, so a reward with an outfit gets the big art only from REWARD_BIG_WITH_OUTFIT_FROM.
 */
export const REWARD_BIG_WITH_OUTFIT_FROM = 768;

export function lessonArtSizes(width: number, height: number, hasNewOutfit: boolean): LessonArtSizes {
  const wide = width >= WIDE_BREAKPOINT;
  const tallTablet = wide && height >= 700;
  const bigReward = tallTablet && (!hasNewOutfit || width >= REWARD_BIG_WITH_OUTFIT_FROM);
  const compact = height < LESSON_COMPACT_BELOW;
  return {
    option: wide ? 120 : 88,
    card: tallTablet ? 220 : compact ? 104 : 160,
    reward: bigReward ? 180 : compact ? 104 : 140,
    sticker: bigReward ? 128 : compact ? 80 : 96,
    rewardRowsSideBySide: wide,
    gap: compact ? spacing.sm : spacing.lg,
    songLinePadding: compact ? spacing.sm : spacing.md,
  };
}
