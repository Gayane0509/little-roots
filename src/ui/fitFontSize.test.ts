import { expect, test } from '@jest/globals';

import { EM_PER_LETTER, fitFontSize } from './fitFontSize';

test('short words keep the base size; long ones shrink so the word stays whole (#104)', () => {
  expect(fitFontSize('Ընտանիք', 127, 18, 12)).toBe(18);
  expect(fitFontSize('Զգացմունքներ', 127, 18, 12)).toBe(14);
});

test('the longest word decides; spaces may wrap', () => {
  expect(fitFontSize('Մեր տունը', 60, 30, 10)).toBe(Math.floor(60 / (5 * EM_PER_LETTER)));
});

test('larger system text shrinks the base so the scaled word still fits; never below the minimum on screen', () => {
  expect(fitFontSize('Զգացմունքներ', 127, 18, 12, 1.2)).toBe(11);
  expect(fitFontSize('Զգացմունքներ', 40, 18, 12, 1.5)).toBe(8);
  expect(fitFontSize('Զգացմունքներ', 40, 18, 12)).toBe(12);
});
