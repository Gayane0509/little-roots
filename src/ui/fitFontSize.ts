/**
 * Widest bold Armenian letters measured on the web were about 0.74 em each (Տրանսպորտ); a little over that leaves room for
 * the native fonts (#104).
 */
export const EM_PER_LETTER = 0.75;

/**
 * Largest font size (≤ `base`) at which the longest word of `text` fits in `width`, so a long word like Զգացմունքներ
 * shrinks instead of breaking in the middle. `fontScale` is the system text size the font will be multiplied by; `min` is
 * the smallest size on screen (after that scaling), so larger system text never pushes a word past its box (#105).
 */
export function fitFontSize(text: string, width: number, base: number, min: number, fontScale = 1): number {
  const longest = Math.max(1, ...text.split(/\s+/).map((word) => [...word].length));
  const fit = Math.floor(width / (longest * EM_PER_LETTER * fontScale));
  return Math.max(Math.floor(min / fontScale), Math.min(base, fit));
}
