import { expect, test } from '@jest/globals';
import { THEMES } from './themes';
import { themeArtWordId } from './themeArt';

test('each theme portrait points at one of its words', () => {
  for (const theme of THEMES) {
    expect(theme.words.map((word) => word.id)).toContain(themeArtWordId(theme.id));
  }
});
