import type { Phrase, PhraseKey } from '@/content/packs';
import type { Word } from '@/content/types';

const QUESTIONS: PhraseKey[] = ['talk_show_me', 'talk_is_this', 'talk_say_with_me'];

export interface TalkCard {
  word: Word;
  question: Phrase;
}

/**
 * Up to three questions for a grown-up to ask in the family language (#153), one per word and each a different
 * question that fits people and things alike: this week's new words first, then the practice words, so a quiet week still gets cards.
 */
export function talkTogetherCards(newWords: Word[], practice: Word[], phrases: Record<PhraseKey, Phrase>): TalkCard[] {
  const words = [...new Map([...newWords, ...practice].map((w) => [w.id, w])).values()].slice(0, QUESTIONS.length);
  return words.map((word, i) => {
    const q = phrases[QUESTIONS[i]];
    return {
      word,
      question: {
        hy: q.hy.replace('{word}', word.hy),
        translit: q.translit.replace('{word}', word.translit),
        en: q.en.replace('{word}', word.en),
      },
    };
  });
}
