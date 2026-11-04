import type { Theme, ThemeId, Word } from '../types';
import { ARMENIAN_PACK } from './armenian';
import type { LanguagePack } from './types';

/** The only way screens, features and state read language content (themes, alphabet, Buddy lines). */
export type { LanguagePack } from './types';
export type { Letter } from '../alphabet';
export type { Phrase, PhraseKey } from '../phrases';
export { validatePack } from './validate';

/** Packs shipped in this build. Add a new language here after `validatePack` passes for it. */
export const PACKS: readonly LanguagePack[] = [ARMENIAN_PACK];

/** The pack the app teaches. One pack today; a parent choice once a second pack ships. */
export const ACTIVE_PACK: LanguagePack = ARMENIAN_PACK;

export function getPack(id: string): LanguagePack | undefined {
  return PACKS.find((pack) => pack.id === id);
}

export function getTheme(id: ThemeId): Theme {
  const theme = ACTIVE_PACK.themes.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);
  return theme;
}

const WORDS_BY_ID = new Map<string, Word>(ACTIVE_PACK.themes.flatMap((t) => t.words).map((w) => [w.id, w]));

export function getWord(id: string): Word | undefined {
  return WORDS_BY_ID.get(id);
}
