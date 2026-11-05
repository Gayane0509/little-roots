import { expect, test } from '@jest/globals';

import { isThemeComplete, themeCardLabel } from './themeCardLabel';

const family = { titleHy: 'Ընտանիք', titleEn: 'Family' };

test('a theme is complete only when unlocked and every word is learned (#123)', () => {
  expect(isThemeComplete(12, 12, true)).toBe(true);
  expect(isThemeComplete(11, 12, true)).toBe(false);
  expect(isThemeComplete(8, 8, false)).toBe(false);
  expect(isThemeComplete(0, 0, true)).toBe(false);
});

test('labels say next, complete or locked', () => {
  expect(themeCardLabel(family, 3, 12, true, true)).toBe('Next up: Ընտանիք, Family, 3 of 12 words learned. Open');
  expect(themeCardLabel(family, 12, 12, true, false)).toBe('Ընտանիք, Family, all 12 words learned. Open');
  expect(themeCardLabel(family, 0, 8, false, false)).toBe('Ընտանիք, Family, locked. Ask a grown-up to unlock');
});
