import { expect, test } from '@jest/globals';

import { getTheme } from '@/content/packs';

import { keepLastWord, lineWordIds } from './rhymeWords';

const family = getTheme('family');
const songs = family ? [family.song, ...(family.moreSongs ?? [])] : [];

test('each family rhyme line shows the pictures of the words it says (#112)', () => {
  const ids = (song: (typeof songs)[number]) => song.lines.map((line) => lineWordIds(line.hy, song, family?.words ?? []));
  expect(ids(songs[0])).toEqual([
    ['family.mom', 'family.dad'],
    ['family.grandma', 'family.grandpa'],
    ['family.brother', 'family.sister'],
    ['family.family'],
  ]);
  // մորաքույր (aunt) contains քույր (sister): only the aunt shows.
  expect(ids(songs[1])).toEqual([['family.baby'], ['family.uncle', 'family.aunt'], ['family.friend'], []]);
});

test('each weather rhyme line shows its season or weather pictures (#144)', () => {
  const weather = getTheme('weather');
  const ids = weather?.song.lines.map((line) => lineWordIds(line.hy, weather.song, weather.words));
  expect(ids).toEqual([
    ['weather.winter', 'weather.snow'],
    ['weather.spring'],
    ['weather.summer', 'weather.autumn'],
    ['weather.rainbow'],
  ]);
});

test('each kitchen rhyme line shows the thing it names (#144)', () => {
  const kitchen = getTheme('kitchen');
  const ids = kitchen?.song.lines.map((line) => lineWordIds(line.hy, kitchen.song, kitchen.words));
  expect(ids).toEqual([['kitchen.bowl'], ['kitchen.spoon'], ['kitchen.teapot'], ['kitchen.pot']]);
});

test('each playground rhyme line shows the thing it names (#144)', () => {
  const playground = getTheme('playground');
  const ids = playground?.song.lines.map((line) => lineWordIds(line.hy, playground.song, playground.words));
  expect(ids).toEqual([['playground.slide'], ['playground.kite'], ['playground.bubbles'], ['playground.icecream']]);
});

test('words outside the song list and very short words are ignored; at most two per line', () => {
  const words = [{ id: 'a.cat', hy: 'կատու' }, { id: 'a.one', hy: 'մի' }, { id: 'a.dog', hy: 'շուն' }, { id: 'a.cow', hy: 'կով' }];
  expect(lineWordIds('Կատուն և շունը և կովը', {}, words)).toEqual(['a.cat', 'a.dog']);
  expect(lineWordIds('Կատուն և շունը', { wordIds: ['a.dog'] }, words)).toEqual(['a.dog']);
  expect(lineWordIds('Միասին', {}, words)).toEqual([]);
});

test('a short last word stays with the word before it', () => {
  expect(keepLastWord('Մեր ընտանիքը շատ սիրուն է։')).toBe('Մեր ընտանիքը շատ սիրուն է։');
  expect(keepLastWord('Մայրիկս և հայրիկս ինձ սիրում են։')).toBe('Մայրիկս և հայրիկս ինձ սիրում են։');
  expect(keepLastWord('Միասին ուրախ ենք։')).toBe('Միասին ուրախ ենք։');
  expect(keepLastWord('Տուն')).toBe('Տուն');
  expect(keepLastWord('Նորածինը քնած')).toBe('Նորածինը քնած');
});
