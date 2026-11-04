import { expect, test } from '@jest/globals';

import { TOUCH_MIN } from '@/ui/tokens';

import { CHOICE_COMPACT_BELOW, choiceLayout } from './choiceLayout';

test('regular phones and tablets keep the full-size picture and rows', () => {
  expect(choiceLayout({ width: 375, height: 812 })).toEqual({ optionArt: 80, pictureArt: 128, picturePadding: 24, optionMinHeight: 104 });
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
