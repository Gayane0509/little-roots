import { ALPHABET } from '../alphabet';
import { BUNDLED_AUDIO } from '../audio';
import { PHRASES } from '../phrases';
import { THEMES } from '../themes';
import type { LanguagePack } from './types';

/** Eastern Armenian — the first pack. */
export const ARMENIAN_PACK: LanguagePack = {
  id: 'hy',
  name: { native: 'Հայերեն', en: 'Armenian' },
  speech: { locale: 'hy-AM', voicePrefix: 'hy' },
  themes: THEMES,
  alphabet: ALPHABET,
  phrases: PHRASES,
  audio: BUNDLED_AUDIO,
};
