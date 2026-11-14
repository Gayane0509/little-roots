import { expect, test } from '@jest/globals';
import { WORD_PICTURES } from '@/art/pictures';
import { THEMES } from './themes';
import { themeArtWordId } from './themeArt';

test('each theme portrait points at one of its words', () => {
  for (const theme of THEMES) {
    expect(theme.words.map((word) => word.id)).toContain(themeArtWordId(theme.id));
  }
});

test('portraits use the 3D pictures, except the drawn colours and numbers themes; Family shows the family (#175)', () => {
  const drawn = THEMES.filter((theme) => !WORD_PICTURES[themeArtWordId(theme.id)]).map((theme) => theme.id);
  expect(drawn).toEqual(['colors', 'numbers']);
  expect(themeArtWordId('family')).toBe('family.family');
});
