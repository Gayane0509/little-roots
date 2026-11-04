import { ALPHABET } from '../alphabet';
import { PHRASES } from '../phrases';
import { THEMES } from '../themes';
import type { LanguagePack } from './types';

/** Eastern Armenian — the first pack. */
export const ARMENIAN_PACK: LanguagePack = {
  id: 'hy',
  name: { native: 'Հայերեն', en: 'Armenian' },
  themes: THEMES,
  alphabet: ALPHABET,
  phrases: PHRASES,
};
