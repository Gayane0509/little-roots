import type { Letter } from '@/content/packs';
import type { Theme } from '@/content/types';

/**
 * Art id for a letter's example word: the theme word's drawing when the word is in a theme, otherwise its own picture
 * in `src/art/words/letters.ts`, keyed by the English word (`ship's wheel` → `letters.ship_s_wheel`) (#89).
 */
export function letterExampleArtId(letter: Letter, themes: Theme[]): string {
  const word = themes.flatMap((theme) => theme.words).find((item) => item.hy === letter.example.hy);
  return word ? word.id : `letters.${letter.example.en.toLowerCase().replace(/[^a-z]+/g, '_')}`;
}
