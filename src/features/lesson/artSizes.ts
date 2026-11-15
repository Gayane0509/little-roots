import { font, SHORT_WINDOW_BELOW, spacing, WIDE_BREAKPOINT } from '@/ui/tokens';

export type LessonArtSizes = {
  option: number; card: number; reward: number; sticker: number; rewardRowsSideBySide: boolean;
  /** Gap and vertical padding of the step content, and the rhyme lines' padding (tighter on short windows). */
  gap: number; songLinePadding: number;
  /** The rhyme step's gap: 4 lines + Buddy's bubble overflow a 375×812 phone with the regular gap (#85). */
  songGap: number;
  /** The intro's row of seeds, one per new word (#109); left out where it would make the step scroll. */
  introSeeds: boolean;
  /** The intro's theme picture: phone size kept 140 px on tall tablets while the rest of the lesson art grew (#141). */
  intro: number;
  /** Pictures beside each rhyme line (#112); smaller where the rhyme step is tight. */
  songPicture: number;
  /**
   * Short windows show a rhyme line's English only once it's tapped, and a smaller rhyme title: four lines with English
   * pushed the step 50 px past a 375×667 window (#115). Screen readers always get the English in the line's label.
   */
  songEnglishOnTap: boolean;
  songTitleSize: number;
  /**
   * Largest size of the word to find in a lesson round. Tall tablets use the big word size, as the Find game does: the
   * 30 px word looked small beside the 120 px answer pictures, with ~165 px free at 1024×768 (#184).
   */
  promptWord: number;
  /** The reward's row of today's new words (#113); left out where it would make the reward scroll (short windows with a new outfit). */
  rewardWords: boolean;
  /** The reward step's gap: tighter on wide windows below REWARD_BIG_FROM_HEIGHT so today's words stay above the footer (#187). */
  rewardGap: number;
};

/** Windows shorter than this (iPhone SE 375×667) get the compact lesson (#84): the word card, rhyme and reward overflowed. */
export const LESSON_COMPACT_BELOW = SHORT_WINDOW_BELOW;
/** Windows shorter than this use the tight gap on the rhyme step. */
export const SONG_TIGHT_BELOW = 860;
/** Windows at least this tall show the intro's seed row; at 320×568 it pushed the step 62 px past the window (#109). */
export const INTRO_SEEDS_FROM = 640;
/** Windows at least this tall show the reward's row of new words (#113). */
export const REWARD_WORDS_FROM = 640;

/**
 * Picture sizes in the lesson. Answer pictures grow on any wide window so they fill the wider option cards (#71). The
 * word card picture and the reward's star and sticker (#81) grow only on tall tablets, so those steps needn't scroll;
 * on short windows they shrink and the step spacing tightens instead.
 * On wide windows a new sticker and a new outfit sit side by side (#82) instead of stacking, so a reward with both
 * fits a 768-tall iPad without scrolling. With the big art that row is ~575 px wide and would wrap in the 568 px
 * column of a 600 px window, so a reward with an outfit gets the big art only from REWARD_BIG_WITH_OUTFIT_FROM.
 */
export const REWARD_BIG_WITH_OUTFIT_FROM = 768;
/**
 * Windows at least this tall get the big reward art. With today's words below it (#113) the big reward was 660 px, 84 px
 * past the 576 px step of a 1024×768 iPad, so the word cards sat under the Back home button (#187).
 */
export const REWARD_BIG_FROM_HEIGHT = 860;

export function lessonArtSizes(width: number, height: number, hasNewOutfit: boolean): LessonArtSizes {
  const wide = width >= WIDE_BREAKPOINT;
  const tallTablet = wide && height >= LESSON_COMPACT_BELOW;
  const bigReward = tallTablet && height >= REWARD_BIG_FROM_HEIGHT && (!hasNewOutfit || width >= REWARD_BIG_WITH_OUTFIT_FROM);
  const compact = height < LESSON_COMPACT_BELOW;
  const gap = compact ? spacing.sm : spacing.lg;
  return {
    option: wide ? 120 : 88,
    card: tallTablet ? 220 : compact ? 104 : 160,
    reward: bigReward ? 180 : compact ? 104 : 140,
    sticker: bigReward ? 128 : compact ? 80 : 96,
    rewardRowsSideBySide: wide,
    gap,
    songLinePadding: compact ? spacing.sm : spacing.md,
    songGap: height < SONG_TIGHT_BELOW ? spacing.sm : spacing.lg,
    introSeeds: height >= INTRO_SEEDS_FROM,
    intro: tallTablet ? 200 : 140,
    // Short windows: two stacked 24 px pictures (52 px) match two lines of rhyme text, so the pictures add no height (#115).
    songPicture: compact ? 24 : height < SONG_TIGHT_BELOW ? 32 : 40,
    songEnglishOnTap: compact,
    songTitleSize: compact ? font.heading : font.title,
    promptWord: tallTablet ? font.word : font.title,
    // At 375×667 a reward that also unlocks an outfit scrolled 69 px with the words row; without the outfit row it fits.
    rewardWords: height >= REWARD_WORDS_FROM && !(compact && hasNewOutfit),
    rewardGap: wide && !compact && height < REWARD_BIG_FROM_HEIGHT ? spacing.md : gap,
  };
}
