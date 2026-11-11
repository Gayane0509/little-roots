import { expect, test } from '@jest/globals';

import { fitFontSize, wordEms } from './fitFontSize';

test('short words keep the base size; long ones shrink so the word stays whole (#104)', () => {
  expect(fitFontSize('Ընտանիք', 127, 18, 12)).toBe(18);
  expect(fitFontSize('Զգացմունքներ', 127, 18, 12)).toBe(14);
});

test('the longest word decides; spaces may wrap', () => {
  expect(fitFontSize('Մեր տունը', 60, 30, 10)).toBe(Math.floor(60 / wordEms('տունը')));
});

test('larger system text shrinks the base so the scaled word still fits; never below the minimum on screen', () => {
  expect(fitFontSize('Զգացմունքներ', 127, 18, 12, 1.2)).toBe(11);
  expect(fitFontSize('Զգացմունքներ', 40, 18, 12, 1.5)).toBe(8);
  expect(fitFontSize('Զգացմունքներ', 40, 18, 12)).toBe(12);
});

test('wide letters count wider, narrow ones narrower (#144: Խաղահրապարակ broke mid-word at a flat 0.75 em)', () => {
  // Web measurement: Խաղահրապարակ is 9.99 em wide in the bold system font; the estimate must not be below it.
  expect(wordEms('Խաղահրապարակ')).toBeGreaterThanOrEqual(9.99);
  expect(wordEms('Տրանսպորտ')).toBeGreaterThanOrEqual(6.66); // measured 0.74 em × 9
  expect(wordEms('Խաղահրապարակ')).toBeGreaterThan(wordEms('Զգացմունքներ'));
  expect(wordEms('լյ')).toBeLessThan(wordEms('մն'));
  expect(fitFontSize('Խաղահրապարակ', 126, 18, 11)).toBe(12);
});
