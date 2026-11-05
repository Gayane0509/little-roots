import type { Letter } from '@/content/packs';

export type HighlightedWord = { before: string; letter: string; after: string };

/**
 * Splits a letter's example word around the first place the letter appears (upper or lower case), so the sheet can colour
 * it and a child sees the link: Բ → **բ**ադ, ԵՒ → ար**և** (#110). Letters may be two characters (ու). Null if it's not there.
 */
export function highlightLetter(word: string, letter: Pick<Letter, 'upper' | 'lower'>): HighlightedWord | null {
  const hits = [letter.upper, letter.lower]
    .map((form) => ({ form, at: word.indexOf(form) }))
    .filter((hit) => hit.at >= 0)
    .sort((a, b) => a.at - b.at || b.form.length - a.form.length);
  const first = hits[0];
  if (!first) return null;
  return { before: word.slice(0, first.at), letter: first.form, after: word.slice(first.at + first.form.length) };
}
