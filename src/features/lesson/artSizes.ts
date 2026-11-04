import { WIDE_BREAKPOINT } from '@/ui/tokens';

export type LessonArtSizes = { option: number; card: number; reward: number; sticker: number; rewardRowsSideBySide: boolean };

/**
 * Picture sizes in the lesson. Answer pictures grow on any wide window so they fill the wider option cards (#71). The
 * word card picture and the reward's star and sticker (#81) grow only on tall tablets, so those steps needn't scroll.
 * On wide windows a new sticker and a new outfit sit side by side (#82) instead of stacking, so a reward with both
 * fits a 768-tall iPad without scrolling. With the big art that row is ~575 px wide and would wrap in the 568 px
 * column of a 600 px window, so a reward with an outfit gets the big art only from REWARD_BIG_WITH_OUTFIT_FROM.
 */
export const REWARD_BIG_WITH_OUTFIT_FROM = 768;

export function lessonArtSizes(width: number, height: number, hasNewOutfit: boolean): LessonArtSizes {
  const wide = width >= WIDE_BREAKPOINT;
  const tallTablet = wide && height >= 700;
  const bigReward = tallTablet && (!hasNewOutfit || width >= REWARD_BIG_WITH_OUTFIT_FROM);
  return {
    option: wide ? 120 : 88,
    card: tallTablet ? 220 : 160,
    reward: bigReward ? 180 : 140,
    sticker: bigReward ? 128 : 96,
    rewardRowsSideBySide: wide,
  };
}
