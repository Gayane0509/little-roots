import { spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

export type ChoiceLayout = { optionArt: number; pictureArt: number; picturePadding: number; optionMinHeight: number };

/** Windows shorter than this get the compact layout (iPhone SE 375×667: the third Read answer was below the fold). */
export const CHOICE_COMPACT_BELOW = 760;

/**
 * Sizes for the Find and Read games. Wide windows get bigger answer pictures to fill the wider option cards (#71).
 * Short windows shrink the Read picture and the answer rows so every answer is on screen without scrolling (#83);
 * rows stay above the touch minimum.
 */
export function choiceLayout(window: { width: number; height: number }): ChoiceLayout {
  const compact = window.height < CHOICE_COMPACT_BELOW;
  return {
    optionArt: window.width >= WIDE_BREAKPOINT ? 112 : 80,
    pictureArt: compact ? 88 : 128,
    picturePadding: compact ? spacing.md : spacing.lg,
    optionMinHeight: compact ? TOUCH_MIN + 16 : TOUCH_MIN + 40,
  };
}
