import { ARMENIAN_PACK } from './armenian';
import type { LanguagePack } from './types';

export type { LanguagePack } from './types';
export { validatePack } from './validate';

/** Packs shipped in this build. Add a new language here after `validatePack` passes for it. */
export const PACKS: readonly LanguagePack[] = [ARMENIAN_PACK];

/** The pack the app teaches. One pack today; a parent choice once a second pack ships. */
export const ACTIVE_PACK: LanguagePack = ARMENIAN_PACK;

export function getPack(id: string): LanguagePack | undefined {
  return PACKS.find((pack) => pack.id === id);
}
