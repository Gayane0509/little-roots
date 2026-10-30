import type { ArtXml, ThemeArt } from './types';

// Each theme file exports `art: ThemeArt`. Missing files/words fall back to the emoji.
const registry: Record<string, ThemeArt> = {};

export function registerThemeArt(themeId: string, art: ThemeArt): void {
  registry[themeId] = art;
}

/** Illustration for a word id like "family.mom", or undefined if none is drawn yet. */
export function getWordArt(wordId: string): ArtXml | undefined {
  const dot = wordId.indexOf('.');
  if (dot < 0) return undefined;
  return registry[wordId.slice(0, dot)]?.[wordId.slice(dot + 1)];
}
