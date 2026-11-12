import type { Letter } from '@/content/packs';

import { ROUNDS, shuffle, type Random } from './logic';

/** The game needs three traced letters so it never opens on a letter the child has not met (#150). */
export const MIN_SOUND_LETTERS = 3;
export const SOUND_OPTIONS = 3;

/** Whether a letter's example word starts with it (և's example արև only ends with it, so it sits the game out). */
export function startsWithLetter(letter: Letter): boolean {
  return letter.example.hy.startsWith(letter.lower);
}

/**
 * Whether `other`'s picture could pass for an answer to `letter`: either word starts with the other's letter. This keeps
 * Ո (ոչխար) and Ու (ուլ) apart, since ուլ starts with ո.
 */
function clashes(letter: Letter, other: Letter): boolean {
  return other.example.hy.startsWith(letter.lower) || letter.example.hy.startsWith(other.lower);
}

/** Traced letters the game can ask, in alphabet order. */
export function soundLetters(alphabet: readonly Letter[], traced: ReadonlySet<string>): Letter[] {
  return alphabet.filter((letter) => traced.has(letter.upper) && startsWithLetter(letter));
}

export function canPlaySounds(alphabet: readonly Letter[], traced: ReadonlySet<string>): boolean {
  return soundLetters(alphabet, traced).length >= MIN_SOUND_LETTERS;
}

export interface SoundRound {
  answer: Letter;
  /** Three example pictures in random order: the answer's and two from letters that cannot pass for it. */
  options: Letter[];
}

/**
 * One round per traced letter (cycled to `rounds`, never the same letter twice in a row). Wrong pictures come from any
 * letter whose example starts with it, traced or not: the child knows the pictures, only the asked letter must be met.
 */
export function buildSoundRounds(alphabet: readonly Letter[], traced: ReadonlySet<string>, random: Random = Math.random, rounds = ROUNDS): SoundRound[] {
  const letters = soundLetters(alphabet, traced);
  if (letters.length < MIN_SOUND_LETTERS) return [];
  const pool = alphabet.filter(startsWithLetter);
  const order: Letter[] = [];
  while (order.length < rounds) {
    const batch = shuffle(letters, random);
    if (batch[0] === order[order.length - 1]) batch.push(batch.shift() as Letter);
    order.push(...batch);
  }
  return order.slice(0, rounds).map((answer) => {
    const distractors = shuffle(pool.filter((other) => other !== answer && !clashes(answer, other)), random).slice(0, SOUND_OPTIONS - 1);
    return { answer, options: shuffle([answer, ...distractors], random) };
  });
}
