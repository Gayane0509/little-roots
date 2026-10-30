import type { Letter } from '../alphabet';
import type { Phrase, PhraseKey } from '../phrases';
import type { Theme } from '../types';

/**
 * Everything the app needs to teach one family language. Text fields named `hy` hold the pack's target-language
 * text (the name is kept from the first, Armenian pack so stored progress and word ids never change).
 */
export interface LanguagePack {
  /** BCP 47 language code, e.g. "hy". */
  id: string;
  /** Name in the language itself and in English, e.g. Հայերեն / Armenian. */
  name: { native: string; en: string };
  /** Device text-to-speech locale and the voice-language prefix that counts as "has a voice". */
  speech: { locale: string; voicePrefix: string };
  themes: Theme[];
  alphabet: Letter[];
  /** Every Buddy line, translated, with the same {placeholders} as the English text. */
  phrases: Record<PhraseKey, Phrase>;
  /** Bundled native-speaker recordings by word id (require() asset numbers). */
  audio: Record<string, number>;
}
