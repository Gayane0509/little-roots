import { expect, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';
import { memoryLayout } from '@/features/games/memoryLayout';

import { wordEms } from './fitFontSize';
import { font } from './tokens';
import { WORD_OF_DAY_VOICE_ICON, wordBox, wordFits, wordFontSize, wordOfDayPicture, wordOfDayText } from './wordFit';

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
  // The one known exception: Memory leaves հրավառություն out of a 320 px phone's deck (`wordFits`, #144).
  expect(bad).toEqual(['memoryCard@320x1: հրավառություն', 'memoryCard@320x1.5: հրավառություն']);
});

test('wordFits agrees with the check above and is what Memory uses to skip a word (#144)', () => {
  const box320 = wordBox.memoryCard(memoryLayout({ width: 320, height: 900, fontScale: 1 }, 12).cardWidth);
  const box375 = wordBox.memoryCard(memoryLayout({ width: 375, height: 900, fontScale: 1 }, 12).cardWidth);
  expect(wordFits('հրավառություն', box320, font.heading)).toBe(false);
  expect(wordFits('հրավառություն', box375, font.heading)).toBe(true);
  expect(words.filter((word) => !wordFits(word.hy, box320, font.heading)).map((word) => word.hy)).toEqual(['հրավառություն']);
});

test('short words keep the base size in roomy boxes', () => {
  expect(wordFontSize('մայրիկ', wordBox.lessonCard(375), font.word)).toBe(font.word);
  expect(wordFontSize('մայրիկ', wordBox.themeCard(375), font.heading)).toBe(font.heading);
  expect(wordFontSize('նարնջագույն', wordBox.lessonCard(375), font.word)).toBe(35);
});

test('word of the day: every word reads at heading size or larger, beside the picture or under it (#147)', () => {
  const bad: string[] = [];
  for (const width of [320, 375, 430, 599, 600, 768, 1024]) {
    for (const hasVoice of [false, true]) {
      for (const scale of [1, 1.5, 2]) {
        for (const word of words) {
          const { stacked, size } = wordOfDayText(word.hy, width, hasVoice, scale);
          const box = stacked ? wordBox.wordOfDay(width, 0) : wordBox.wordOfDay(width, wordOfDayPicture(width)) - (hasVoice ? WORD_OF_DAY_VOICE_ICON : 0);
          const shown = size * Math.min(scale, 1.5);
          if (shown < font.heading || shown * widestWord(word.hy) > box) bad.push(`${width}${hasVoice ? ' voice' : ''} x${scale}: ${word.hy} ${size}`);
        }
      }
    }
  }
  expect(bad).toEqual([]);
  expect(wordOfDayPicture(599)).toBe(112);
  expect(wordOfDayPicture(600)).toBe(160);
  expect(wordOfDayText('հրավառություն', 375, false).stacked).toBe(true);
  expect(wordOfDayText('մայրիկ', 375, false)).toEqual({ stacked: false, size: font.title });
});
