/**
 * Average bold Armenian letter width measured on the web was about 0.74 em (Տրանսպորտ); a little over that leaves room for
 * the native fonts (#104).
 */
export const EM_PER_LETTER = 0.75;

/** Only letters measured at 0.77–0.99 em (other capitals such as Ա 0.72 and Տ 0.67 are not wide) (Խաղահրապարակ averages 0.83 em and broke mid-word at a flat 0.75, #144). */
const WIDE_LETTERS = new Set('աթխպտփֆևԹԽՄՊՌՎՓՖ');
const WIDE_EM = 0.95;
/** Letters measured at 0.27–0.45 em; counted at 0.55 to leave room for other fonts (Android's Noto Sans Armenian). */
const NARROW_LETTERS = new Set('լյչւՒ');
const NARROW_EM = 0.55;

/** Estimated width of `word` in em: wide and narrow letters weighed apart, the rest at `EM_PER_LETTER`. */
export function wordEms(word: string): number {
  const ems = [...word].reduce((sum, ch) => sum + (WIDE_LETTERS.has(ch) ? WIDE_EM : NARROW_LETTERS.has(ch) ? NARROW_EM : EM_PER_LETTER), 0);
  // Rounded so a size that exactly fills its box isn't rejected by float error (5.1000000000000005 em).
  return Math.round(ems * 100) / 100;
}

/**
 * Largest font size (≤ `base`) at which the widest word of `text` fits in `width`, so a long word like Զգացմունքներ
 * shrinks instead of breaking in the middle. `fontScale` is the system text size the font will be multiplied by; `min` is
 * the smallest size on screen (after that scaling), so larger system text never pushes a word past its box (#105).
 */
export function fitFontSize(text: string, width: number, base: number, min: number, fontScale = 1): number {
  const widest = Math.max(EM_PER_LETTER, ...text.split(/\s+/).map(wordEms));
  const fit = Math.floor(width / (widest * fontScale));
  return Math.max(Math.floor(min / fontScale), Math.min(base, fit));
}
