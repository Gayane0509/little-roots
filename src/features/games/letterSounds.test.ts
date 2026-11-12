import { describe, expect, it } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';

import { buildSoundRounds, canPlaySounds, MIN_SOUND_LETTERS, SOUND_OPTIONS, soundLetters, startsWithLetter } from './letterSounds';

const ALPHABET = ACTIVE_PACK.alphabet;

function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const ALL = new Set(ALPHABET.map((letter) => letter.upper));
const upper = (...letters: string[]) => new Set(letters);

describe('letter sounds game', () => {
  it('uses every letter whose example starts with it, which leaves out only և (արև)', () => {
    expect(ALPHABET.filter((letter) => !startsWithLetter(letter)).map((letter) => letter.upper)).toEqual(['և']);
  });

  it('asks only traced letters and needs three of them', () => {
    expect(canPlaySounds(ALPHABET, upper('Ա', 'Բ'))).toBe(false);
    expect(canPlaySounds(ALPHABET, upper('Ա', 'Բ', 'և'))).toBe(false);
    expect(canPlaySounds(ALPHABET, upper('Ա', 'Բ', 'Գ'))).toBe(true);
    expect(buildSoundRounds(ALPHABET, upper('Ա', 'Բ'))).toEqual([]);
    for (let seed = 1; seed < 30; seed++) {
      for (const round of buildSoundRounds(ALPHABET, upper('Ա', 'Բ', 'Գ'), seeded(seed))) expect(['Ա', 'Բ', 'Գ']).toContain(round.answer.upper);
    }
    expect(soundLetters(ALPHABET, upper('Գ', 'Ա', 'Բ')).map((letter) => letter.upper)).toEqual(['Ա', 'Բ', 'Գ']);
    expect(MIN_SOUND_LETTERS).toBe(3);
  });

  it('gives six rounds of three different pictures, one of them the answer, never the same letter twice running', () => {
    for (let seed = 1; seed < 50; seed++) {
      const rounds = buildSoundRounds(ALPHABET, upper('Ա', 'Բ', 'Գ'), seeded(seed));
      expect(rounds).toHaveLength(6);
      rounds.forEach((round, i) => {
        expect(round.options).toHaveLength(SOUND_OPTIONS);
        expect(new Set(round.options).size).toBe(SOUND_OPTIONS);
        expect(round.options).toContain(round.answer);
        if (i > 0) expect(round.answer).not.toBe(rounds[i - 1].answer);
      });
    }
  });

  it('never offers a wrong picture whose word starts with the asked letter, or the other way round (Ո and Ու)', () => {
    for (let seed = 1; seed < 200; seed++) {
      for (const round of buildSoundRounds(ALPHABET, ALL, seeded(seed))) {
        for (const option of round.options) {
          if (option === round.answer) continue;
          expect(option.example.hy.startsWith(round.answer.lower)).toBe(false);
          expect(round.answer.example.hy.startsWith(option.lower)).toBe(false);
          expect(startsWithLetter(option)).toBe(true);
        }
      }
    }
  });

  it('keeps Ո and Ու apart', () => {
    for (let seed = 1; seed < 200; seed++) {
      for (const round of buildSoundRounds(ALPHABET, upper('Ո', 'Ու', 'Ա'), seeded(seed))) {
        const letters = round.options.map((option) => option.upper);
        expect(letters.includes('Ո') && letters.includes('Ու')).toBe(false);
      }
    }
  });
});
