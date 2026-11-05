import { expect, test } from '@jest/globals';

import { TOUCH_MIN } from '@/ui/tokens';

import { CHOICE_COMPACT_BELOW, CHOICE_TALL_FROM, choiceLayout } from './choiceLayout';

test('regular phones and tablets keep the full-size picture; phones get slightly lower rows', () => {
  expect(choiceLayout({ width: 375, height: 812 })).toEqual({ optionArt: 128, pictureArt: 128, picturePadding: 24, optionMinHeight: 88 });
  expect(choiceLayout({ width: 1024, height: 768 })).toEqual({ optionArt: 112, pictureArt: 128, picturePadding: 24, optionMinHeight: 104 });
});

test('short windows get a smaller picture and rows that still meet the touch minimum', () => {
  const se = choiceLayout({ width: 375, height: 667 });
  expect(se).toEqual({ optionArt: 80, pictureArt: 88, picturePadding: 16, optionMinHeight: 80 });
  expect(se.optionMinHeight).toBeGreaterThanOrEqual(TOUCH_MIN);
});

test('the compact threshold is exclusive', () => {
  expect(choiceLayout({ width: 375, height: CHOICE_COMPACT_BELOW - 1 }).pictureArt).toBe(88);
  expect(choiceLayout({ width: 375, height: CHOICE_COMPACT_BELOW }).pictureArt).toBe(128);
});

test('tall phones get Find pictures as big as the answer card allows; short phones and tablets are unchanged', () => {
  expect(choiceLayout({ width: 375, height: 812 }).optionArt).toBe(128);
  expect(choiceLayout({ width: 430, height: 932 }).optionArt).toBe(128);
  expect(choiceLayout({ width: 360, height: 800 }).optionArt).toBe(128);
  // A narrow tall phone: the picture shrinks to the card (46% of 320 − 32, minus border and padding).
  expect(choiceLayout({ width: 320, height: 800 }).optionArt).toBe(110);
  expect(choiceLayout({ width: 375, height: CHOICE_TALL_FROM - 1 }).optionArt).toBe(80);
  expect(choiceLayout({ width: 375, height: 667 }).optionArt).toBe(80);
  expect(choiceLayout({ width: 320, height: 568 }).optionArt).toBe(80);
  expect(choiceLayout({ width: 768, height: 1024 }).optionArt).toBe(112);
});

test('a tall-phone Find picture always fits inside its answer card', () => {
  for (const width of [320, 340, 360, 375, 390, 414, 430, 599]) {
    const art = choiceLayout({ width, height: 900 }).optionArt;
    const cardInner = Math.floor((width - 32) * 0.46) - 6 - 16;
    expect(art).toBeLessThanOrEqual(Math.max(80, cardInner));
  }
});

test('Read fits a 375×812 phone: picture and three rows leave room for Back even with a two-line Buddy prompt', () => {
  const { pictureArt, picturePadding, optionMinHeight } = choiceLayout({ width: 375, height: 812 });
  // Measured on the web at 375×812 (#102): the picture card started at 175 and Back is 64 px plus a 16 px gap; a
  // two-line Armenian + English prompt adds about 24 px. Keep the picture, rows and Back inside the window.
  const picture = pictureArt + 2 * picturePadding + 2 * 3;
  const bottom = 175 + 24 + picture + 16 + 3 * optionMinHeight + 2 * 16 + 16 + 64;
  expect(bottom).toBeLessThanOrEqual(812 - 16);
  expect(optionMinHeight).toBeGreaterThanOrEqual(TOUCH_MIN);
});

test('tablets keep the taller answer rows', () => {
  expect(choiceLayout({ width: 768, height: 1024 }).optionMinHeight).toBe(104);
  expect(choiceLayout({ width: 430, height: 932 }).optionMinHeight).toBe(88);
});
