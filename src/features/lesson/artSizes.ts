import { WIDE_BREAKPOINT } from '@/ui/tokens';

export type LessonArtSizes = { option: number; card: number; reward: number; sticker: number };

/**
 * Picture sizes in the lesson. Answer pictures grow on any wide window so they fill the wider option cards (#71). The
 * word card picture and the reward's star and sticker (#81) grow only on tall tablets, so those steps needn't scroll.
 * A reward that also shows a new outfit has an extra row, so its star and sticker keep the phone size.
 */
export function lessonArtSizes(width: number, height: number, hasNewOutfit: boolean): LessonArtSizes {
  const wide = width >= WIDE_BREAKPOINT;
  const tallTablet = wide && height >= 700;
  const bigReward = tallTablet && !hasNewOutfit;
  return {
    option: wide ? 120 : 88,
    card: tallTablet ? 220 : 160,
    reward: bigReward ? 180 : 140,
    sticker: bigReward ? 128 : 96,
  };
}
