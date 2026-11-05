import { spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

export type ChoiceLayout = { optionArt: number; pictureArt: number; picturePadding: number; optionMinHeight: number };

/** Windows shorter than this get the compact layout (iPhone SE 375×667: the third Read answer was below the fold). */
export const CHOICE_COMPACT_BELOW = 760;

/** Phones at least this tall (375×812 and up) get bigger Find pictures: at 80 px about 200 px sat empty above Back (#101). */
export const CHOICE_TALL_FROM = 800;

/** Largest Find picture on a tall phone; the drawings are 128×128. */
const TALL_OPTION_ART_MAX = 128;

/**
 * Inner width of one Find answer card: the screen gutter on both sides, 46% of the rest (the grid column),
 * minus the card's 3 px border and `spacing.sm` padding on each side.
 */
function findCardInner(width: number) {
  return Math.floor((width - 2 * spacing.md) * 0.46) - 2 * 3 - 2 * spacing.sm;
}

/**
 * Sizes for the Find and Read games. Wide windows get bigger answer pictures to fill the wider option cards (#71).
 * Short windows shrink the Read picture and the answer rows so every answer is on screen without scrolling (#83);
 * rows stay above the touch minimum. Tall phones get Find pictures as big as the answer card allows (#101); Read is
 * unchanged there because its picture and three rows already fill a 375×812 screen. Phones get slightly lower answer
 * rows than tablets so Read's Back stays on screen at 375×812 when Buddy speaks Armenian and English (#102).
 */
export function choiceLayout(window: { width: number; height: number }): ChoiceLayout {
  const compact = window.height < CHOICE_COMPACT_BELOW;
  const wide = window.width >= WIDE_BREAKPOINT;
  const tallPhone = !wide && window.height >= CHOICE_TALL_FROM;
  return {
    optionArt: wide ? 112 : tallPhone ? Math.max(80, Math.min(TALL_OPTION_ART_MAX, findCardInner(window.width))) : 80,
    pictureArt: compact ? 88 : 128,
    picturePadding: compact ? spacing.md : spacing.lg,
    optionMinHeight: compact ? TOUCH_MIN + 16 : wide ? TOUCH_MIN + 40 : TOUCH_MIN + 24,
  };
}
