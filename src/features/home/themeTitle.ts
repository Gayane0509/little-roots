import { fitFontSize } from '@/ui/fitFontSize';
import { CONTENT_MAX_WIDTH, DISPLAY_MAX_FONT_SCALE, font, spacing, WIDE_BREAKPOINT } from '@/ui/tokens';

type Window = { width: number; fontScale?: number };

/** Content column width: the screen gutter on both sides, capped on tablets. */
const contentWidth = (width: number) => Math.min(width - 2 * spacing.md, CONTENT_MAX_WIDTH);

/** Text box of a Home theme card: 48% of the column (31.5% on wide windows) minus padding and the 3 px "Next" border. */
export function homeCardTitleWidth(width: number) {
  return Math.floor(contentWidth(width) * (width >= WIDE_BREAKPOINT ? 0.315 : 0.48)) - 2 * spacing.md - 2 * 3;
}

/** Room left for the "12/12" count beside the theme page title (heading size, bold, plus its padding). */
const HEADER_COUNT_WIDTH = 72;
/** Theme page header picture size. */
export const HEADER_ART = 64;

/** Text box of the theme page title: the column minus the picture, the count and the two gaps between them. */
export function themeHeaderTitleWidth(width: number) {
  return contentWidth(width) - HEADER_ART - HEADER_COUNT_WIDTH - 2 * spacing.md;
}

/** Smallest sizes a theme name shrinks to: only Զգացմունքներ on a 320 px phone gets this small, and it stays whole. */
const HOME_TITLE_MIN = 11;
const HEADER_TITLE_MIN = 12;

/**
 * Theme names shrink to stay whole instead of breaking mid-word (Զգացմունքներ, #104). Both titles cap system text growth at
 * `DISPLAY_MAX_FONT_SCALE`, so that is the most the size is multiplied by.
 */
export function homeCardTitleSize(text: string, { width, fontScale = 1 }: Window) {
  return fitFontSize(text, homeCardTitleWidth(width), font.body, HOME_TITLE_MIN, Math.min(fontScale, DISPLAY_MAX_FONT_SCALE));
}

export function themeHeaderTitleSize(text: string, { width, fontScale = 1 }: Window) {
  return fitFontSize(text, themeHeaderTitleWidth(width), font.title, HEADER_TITLE_MIN, Math.min(fontScale, DISPLAY_MAX_FONT_SCALE));
}
