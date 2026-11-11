import { fitFontSize, wordEms } from './fitFontSize';
import { CONTENT_MAX_WIDTH, DISPLAY_MAX_FONT_SCALE, font, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from './tokens';

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
  /** Letter sheet example word (`LetterDetail`): the sheet (full window, capped), `spacing.lg` content padding and
   * `spacing.md` card padding. The word wraps below the picture when it doesn't fit beside it, so this is its widest line. */
  letterExample: (width: number) => Math.min(width, CONTENT_MAX_WIDTH) - 2 * spacing.lg - 2 * spacing.md,
  /** Home word of the day (`WordOfTheDay`): 2 px border and `spacing.md` padding; beside the picture (plus a `spacing.md`
   * gap) or, for a long word, below it at full width. */
  wordOfDay: (width: number, besidePicture: number) => contentWidth(width) - 2 * 2 - 2 * spacing.md - (besidePicture > 0 ? besidePicture + spacing.md : 0),
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

/**
 * Whether `text` fits `box` as whole words at its `wordFontSize`. False only when even WORD_MIN_SIZE is too wide, e.g.
 * հրավառություն (9.75 em) on a 320 px phone's Memory card (67 px), so the game can pick another word (#144).
 */
export function wordFits(text: string, box: number, base: number, fontScale = 1) {
  const scale = Math.min(fontScale, DISPLAY_MAX_FONT_SCALE);
  return wordFontSize(text, box, base, fontScale) * scale * Math.max(...text.split(/\s+/).map(wordEms)) <= box;
}

/** Word of the day picture (`WordOfTheDay`): phones, then from WIDE_BREAKPOINT. */
export const wordOfDayPicture = (width: number) => (width >= WIDE_BREAKPOINT ? 160 : 112);

/** Room the `Wiggle` voice icon takes at the card's top right (28 px icon, 8 px inset) when the word has a recording. */
export const WORD_OF_DAY_VOICE_ICON = 36;

/**
 * Word of the day sizing (#147): the word sits beside the picture at up to `font.title` (clear of the voice icon when there
 * is a recording); a word that would shrink below `font.heading` there (հրավառություն on a phone) goes under the picture
 * at full card width instead, where the icon sits beside the centred picture.
 */
export function wordOfDayText(text: string, width: number, hasVoice: boolean, fontScale = 1): { stacked: boolean; size: number } {
  const picture = wordOfDayPicture(width);
  const beside = wordFontSize(text, wordBox.wordOfDay(width, picture) - (hasVoice ? WORD_OF_DAY_VOICE_ICON : 0), font.title, fontScale);
  if (beside >= font.heading) return { stacked: false, size: beside };
  return { stacked: true, size: wordFontSize(text, wordBox.wordOfDay(width, 0), font.title, fontScale) };
}
