import { expect, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';
import { EM_PER_LETTER } from '@/ui/fitFontSize';

import { homeCardTitleSize, homeCardTitleWidth, themeHeaderTitleSize, themeHeaderTitleWidth } from './themeTitle';

test('text boxes match the web measurements at 375 px', () => {
  // Measured: Home "Next" card title box 127 px; theme header title 193 px with a 54 px "3/12" count (72 reserved).
  expect(homeCardTitleWidth(375)).toBe(126);
  expect(themeHeaderTitleWidth(375)).toBe(175);
});

test('Feelings shrinks on Home and on its page; short names keep their size', () => {
  expect(homeCardTitleSize('Զգացմունքներ', { width: 375 })).toBe(14);
  expect(homeCardTitleSize('Ընտանիք', { width: 375 })).toBe(18);
  expect(themeHeaderTitleSize('Զգացմունքներ', { width: 375 })).toBe(19);
  expect(themeHeaderTitleSize('Ընտանիք', { width: 375 })).toBe(30);
});

test('every Armenian theme name stays one whole word from 320 px phones to tablets', () => {
  for (const width of [320, 360, 375, 430, 768, 1024]) {
    for (const theme of ACTIVE_PACK.themes) {
      const letters = [...theme.titleHy].length;
      expect(homeCardTitleSize(theme.titleHy, { width }) * letters * EM_PER_LETTER).toBeLessThanOrEqual(homeCardTitleWidth(width));
      expect(themeHeaderTitleSize(theme.titleHy, { width }) * letters * EM_PER_LETTER).toBeLessThanOrEqual(themeHeaderTitleWidth(width));
    }
  }
});

test('larger system text shrinks the base so the scaled name still fits', () => {
  const size = homeCardTitleSize('Կենդանիներ', { width: 375, fontScale: 1.3 });
  expect(size * 1.3 * 10 * EM_PER_LETTER).toBeLessThanOrEqual(homeCardTitleWidth(375));
});
