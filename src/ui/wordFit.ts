import { fitFontSize } from './fitFontSize';
import { CONTENT_MAX_WIDTH, DISPLAY_MAX_FONT_SCALE, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from './tokens';

/**
 * Text boxes that show one Armenian word, from the window width (#105). A word that doesn't fit its box would break in the
 * middle (նարնջագույն → նարնջագու / յն), so the font shrinks instead. Widths mirror each component's styles; keep them in step.
 */

/** Content column: the screen gutter on both sides, capped on tablets (`Screen`). */
export const contentWidth = (width: number) => Math.min(width - 2 * spacing.md, CONTENT_MAX_WIDTH);

/** Room a family-voice button takes beside a prompt (button plus the row gap); only there when a recording exists. */
const VOICE_BUTTON = TOUCH_MIN + spacing.sm;

export const wordBox = {
  /** Lesson word card: 2 px border and `spacing.lg` padding. */
  lessonCard: (width: number) => contentWidth(width) - 2 * 2 - 2 * spacing.lg,
  /** Lesson "find the picture" prompt: `spacing.lg` side padding, beside the voice button. */
  lessonPrompt: (width: number, hasVoice: boolean) => contentWidth(width) - 2 * spacing.lg - (hasVoice ? VOICE_BUTTON : 0),
  /** Find game prompt: 2 px border and `spacing.lg` side padding, beside the voice button. */
  findPrompt: (width: number, hasVoice: boolean) => contentWidth(width) - 2 * 2 - 2 * spacing.lg - (hasVoice ? VOICE_BUTTON : 0),
  /** Read game answer row: full width, 3 px border and `spacing.sm` padding. */
  readRow: (width: number) => contentWidth(width) - 2 * 3 - 2 * spacing.sm,
  /** Theme page word card: 48% of the column (31.5% on wide windows), `spacing.md` padding. */
  themeCard: (width: number) => Math.floor(contentWidth(width) * (width >= WIDE_BREAKPOINT ? 0.315 : 0.48)) - 2 * spacing.md,
  /** Memory word card face (card width from `memoryLayout`): 3 px border and `spacing.sm` padding. */
  memoryCard: (cardWidth: number) => cardWidth - 2 * 3 - 2 * spacing.sm,
  /** Parent "New this week" tile: 96 px wide with `spacing.sm` padding. */
  parentLearned: () => 96 - 2 * spacing.sm,
};

/**
 * Smallest a word shrinks to on screen. Only the 11-letter նարնջագույն on a Memory card or parent tile of a 320 px phone
 * (a width iOS no longer ships) gets this small; a small whole word reads better than a broken one.
 */
export const WORD_MIN_SIZE = 8;

/** Font size for one word in `box`; system text growth is capped at DISPLAY_MAX_FONT_SCALE where these are used. */
export function wordFontSize(text: string, box: number, base: number, fontScale = 1) {
  return fitFontSize(text, box, base, WORD_MIN_SIZE, Math.min(fontScale, DISPLAY_MAX_FONT_SCALE));
}
