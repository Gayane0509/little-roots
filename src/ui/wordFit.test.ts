import { expect, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';
import { memoryLayout } from '@/features/games/memoryLayout';

import { wordEms } from './fitFontSize';
import { font } from './tokens';
import { wordBox, wordFontSize } from './wordFit';

const words = ACTIVE_PACK.themes.flatMap((t) => t.words);
const widestWord = (text: string) => Math.max(...text.split(/\s+/).map(wordEms));
const fits = (text: string, box: number, base: number, fontScale = 1) =>
  wordFontSize(text, box, base, fontScale) * fontScale * widestWord(text) <= box;

test('box widths match the components at 375 px', () => {
  expect(wordBox.lessonCard(375)).toBe(291);
  expect(wordBox.readRow(375)).toBe(321);
  expect(wordBox.findPrompt(375, false)).toBe(291);
  expect(wordBox.findPrompt(375, true)).toBe(219);
  expect(wordBox.themeCard(375)).toBe(132);
  expect(wordBox.letterExample(320)).toBe(240);
  expect(wordBox.memoryCard(memoryLayout({ width: 375, height: 812, fontScale: 1 }, 12).cardWidth)).toBe(86);
});

test('every word stays one whole word in every box, 320 px phones to tablets, at normal and large text (#105)', () => {
  const bad: string[] = [];
  for (const width of [320, 360, 375, 430, 768, 1024]) {
    const memoryCard = memoryLayout({ width, height: 900, fontScale: 1 }, 12).cardWidth;
    const boxes: [string, number, number][] = [
      ['lessonCard', wordBox.lessonCard(width), font.word],
      ['lessonPrompt', wordBox.lessonPrompt(width, true), font.title],
      ['findPrompt', wordBox.findPrompt(width, true), font.word],
      ['readRow', wordBox.readRow(width), font.word],
      ['themeCard', wordBox.themeCard(width), font.heading],
      ['memoryCard', wordBox.memoryCard(memoryCard), font.heading],
      ['parentLearned', wordBox.parentLearned(), font.small],
    ];
    for (const example of ACTIVE_PACK.alphabet.map((letter) => letter.example.hy)) {
      for (const scale of [1, 1.5]) if (!fits(example, wordBox.letterExample(width), font.word, scale)) bad.push(`letterExample@${width}x${scale}: ${example}`);
    }
    for (const word of words) {
      for (const [name, box, base] of boxes) {
        for (const scale of [1, 1.5]) if (!fits(word.hy, box, base, scale)) bad.push(`${name}@${width}x${scale}: ${word.hy}`);
      }
    }
  }
  expect(bad).toEqual([]);
});

test('short words keep the base size in roomy boxes', () => {
  expect(wordFontSize('մայրիկ', wordBox.lessonCard(375), font.word)).toBe(font.word);
  expect(wordFontSize('մայրիկ', wordBox.themeCard(375), font.heading)).toBe(font.heading);
  expect(wordFontSize('նարնջագույն', wordBox.lessonCard(375), font.word)).toBe(35);
});
