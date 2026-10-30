import type { Theme, ThemeId, Word } from './types';

type WordRow = [slug: string, hy: string, translit: string, en: string, emoji: string];

function words(themeId: ThemeId, rows: WordRow[]): Word[] {
  return rows.map(([slug, hy, translit, en, emoji]) => ({
    id: `${themeId}.${slug}`,
    themeId,
    hy,
    translit,
    en,
    emoji,
  }));
}

export const THEMES: Theme[] = [
  {
    id: 'family',
    titleHy: 'Ընտանիք',
    titleEn: 'Family',
    emoji: '👨‍👩‍👧',
    color: '#FFB5A7',
    free: true,
    words: words('family', [
      ['mom', 'մայրիկ', 'mayrik', 'mom', '👩'],
      ['dad', 'հայրիկ', 'hayrik', 'dad', '👨'],
      ['grandma', 'տատիկ', 'tatik', 'grandma', '👵'],
      ['grandpa', 'պապիկ', 'papik', 'grandpa', '👴'],
      ['brother', 'եղբայր', 'yeghbayr', 'brother', '👦'],
      ['sister', 'քույր', 'kuyr', 'sister', '👧'],
      ['child', 'երեխա', 'yerekha', 'child', '🧒'],
      ['family', 'ընտանիք', 'əntanik', 'family', '👨‍👩‍👧‍👦'],
    ]),
    song: {
      id: 'family.song',
      themeId: 'family',
      title: 'My family',
      lines: [
        { hy: 'Մայրիկս և հայրիկս ինձ սիրում են։', translit: 'Mayriks yev hayriks indz sirum en.', en: 'My mom and dad love me.' },
        { hy: 'Տատիկս և պապիկս ինձ սիրում են։', translit: 'Tatiks yev papiks indz sirum en.', en: 'My grandma and grandpa love me.' },
        { hy: 'Եղբայրս և քույրս ինձ սիրում են։', translit: 'Yeghbayrs yev kuyrs indz sirum en.', en: 'My brother and sister love me.' },
        { hy: 'Մեր ընտանիքը շատ սիրուն է։', translit: 'Mer əntanikə shat sirun e.', en: 'Our family is very lovely.' },
      ],
    },
  },
  {
    id: 'food',
    titleHy: 'Ուտելիք',
    titleEn: 'Food',
    emoji: '🍎',
    color: '#FFD6A5',
    free: true,
    words: words('food', [
      ['bread', 'հաց', 'hats', 'bread', '🍞'],
      ['milk', 'կաթ', 'kat', 'milk', '🥛'],
      ['apple', 'խնձոր', 'khndzor', 'apple', '🍎'],
      ['egg', 'ձու', 'dzu', 'egg', '🥚'],
      ['cheese', 'պանիր', 'panir', 'cheese', '🧀'],
      ['water', 'ջուր', 'jur', 'water', '💧'],
      ['banana', 'բանան', 'banan', 'banana', '🍌'],
      ['pear', 'տանձ', 'tandz', 'pear', '🍐'],
    ]),
    song: {
      id: 'food.song',
      themeId: 'food',
      title: 'Yummy food',
      lines: [
        { hy: 'Ես հաց եմ ուտում։', translit: 'Yes hats em utum.', en: 'I eat bread.' },
        { hy: 'Ես խնձոր եմ ուտում։', translit: 'Yes khndzor em utum.', en: 'I eat an apple.' },
        { hy: 'Ես կաթ եմ խմում։', translit: 'Yes kat em khmum.', en: 'I drink milk.' },
        { hy: 'Ես ջուր եմ խմում։', translit: 'Yes jur em khmum.', en: 'I drink water.' },
      ],
    },
  },
  {
    id: 'animals',
    titleHy: 'Կենդանիներ',
    titleEn: 'Animals',
    emoji: '🐶',
    color: '#CDEAC0',
    free: false,
    words: words('animals', [
      ['dog', 'շուն', 'shun', 'dog', '🐶'],
      ['cat', 'կատու', 'katu', 'cat', '🐱'],
      ['horse', 'ձի', 'dzi', 'horse', '🐴'],
      ['cow', 'կով', 'kov', 'cow', '🐮'],
      ['bird', 'թռչուն', 'trchun', 'bird', '🐦'],
      ['fish', 'ձուկ', 'dzuk', 'fish', '🐟'],
      ['rabbit', 'ճագար', 'chagar', 'rabbit', '🐰'],
      ['bear', 'արջ', 'arj', 'bear', '🐻'],
    ]),
    song: {
      id: 'animals.song',
      themeId: 'animals',
      title: 'Animals at play',
      lines: [
        { hy: 'Շունը հաչում է։', translit: 'Shunə hachum e.', en: 'The dog barks.' },
        { hy: 'Կատուն մլավում է։', translit: 'Katun mlavum e.', en: 'The cat meows.' },
        { hy: 'Ձին վազում է։', translit: 'Dzin vazum e.', en: 'The horse runs.' },
        { hy: 'Ձուկը լողում է։', translit: 'Dzukə loghum e.', en: 'The fish swims.' },
      ],
    },
  },
  {
    id: 'colors',
    titleHy: 'Գույներ',
    titleEn: 'Colors',
    emoji: '🎨',
    color: '#BDE0FE',
    free: false,
    words: words('colors', [
      ['red', 'կարմիր', 'karmir', 'red', '🔴'],
      ['blue', 'կապույտ', 'kapuyt', 'blue', '🔵'],
      ['yellow', 'դեղին', 'deghin', 'yellow', '🟡'],
      ['green', 'կանաչ', 'kanach', 'green', '🟢'],
      ['white', 'սպիտակ', 'spitak', 'white', '⚪'],
      ['black', 'սև', 'sev', 'black', '⚫'],
      ['pink', 'վարդագույն', 'vardaguyn', 'pink', '🌸'],
      ['orange', 'նարնջագույն', 'narnjaguyn', 'orange', '🟠'],
    ]),
    song: {
      id: 'colors.song',
      themeId: 'colors',
      title: 'Colors around us',
      lines: [
        { hy: 'Արևը դեղին է։', translit: 'Arevə deghin e.', en: 'The sun is yellow.' },
        { hy: 'Երկինքը կապույտ է։', translit: 'Yerkinkə kapuyt e.', en: 'The sky is blue.' },
        { hy: 'Խոտը կանաչ է։', translit: 'Khotə kanach e.', en: 'The grass is green.' },
        { hy: 'Ձյունը սպիտակ է։', translit: 'Dzyunə spitak e.', en: 'The snow is white.' },
      ],
    },
  },
  {
    id: 'numbers',
    titleHy: 'Թվեր',
    titleEn: 'Numbers',
    emoji: '🔢',
    color: '#E4C1F9',
    free: false,
    words: words('numbers', [
      ['one', 'մեկ', 'mek', 'one', '1️⃣'],
      ['two', 'երկու', 'yerku', 'two', '2️⃣'],
      ['three', 'երեք', 'yerek', 'three', '3️⃣'],
      ['four', 'չորս', 'chors', 'four', '4️⃣'],
      ['five', 'հինգ', 'hing', 'five', '5️⃣'],
      ['six', 'վեց', 'vets', 'six', '6️⃣'],
      ['seven', 'յոթ', 'yot', 'seven', '7️⃣'],
      ['eight', 'ութ', 'ut', 'eight', '8️⃣'],
    ]),
    song: {
      id: 'numbers.song',
      themeId: 'numbers',
      title: 'Let us count',
      lines: [
        { hy: 'Մեկ, երկու, երեք։', translit: 'Mek, yerku, yerek.', en: 'One, two, three.' },
        { hy: 'Չորս, հինգ, վեց։', translit: 'Chors, hing, vets.', en: 'Four, five, six.' },
        { hy: 'Յոթ, ութ։', translit: 'Yot, ut.', en: 'Seven, eight.' },
        { hy: 'Ես կարող եմ հաշվել։', translit: 'Yes karogh em hashvel.', en: 'I can count.' },
      ],
    },
  },
  {
    id: 'body',
    titleHy: 'Մարմին',
    titleEn: 'Body',
    emoji: '🧒',
    color: '#FDFFB6',
    free: false,
    words: words('body', [
      ['head', 'գլուխ', 'glukh', 'head', '🙂'],
      ['eye', 'աչք', 'achk', 'eye', '👁️'],
      ['nose', 'քիթ', 'kit', 'nose', '👃'],
      ['mouth', 'բերան', 'beran', 'mouth', '👄'],
      ['ear', 'ականջ', 'akanj', 'ear', '👂'],
      ['hand', 'ձեռք', 'dzerk', 'hand', '✋'],
      ['foot', 'ոտք', 'votk', 'foot', '🦶'],
      ['tooth', 'ատամ', 'atam', 'tooth', '🦷'],
    ]),
    song: {
      id: 'body.song',
      themeId: 'body',
      title: 'My body',
      lines: [
        { hy: 'Սա իմ գլուխն է։', translit: 'Sa im glukhn e.', en: 'This is my head.' },
        { hy: 'Սա իմ քիթն է։', translit: 'Sa im kitn e.', en: 'This is my nose.' },
        { hy: 'Սրանք իմ աչքերն են։', translit: 'Srank im achkern en.', en: 'These are my eyes.' },
        { hy: 'Սրանք իմ ձեռքերն են։', translit: 'Srank im dzerkern en.', en: 'These are my hands.' },
      ],
    },
  },
];

export function getTheme(id: ThemeId): Theme {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);
  return theme;
}

const WORDS_BY_ID = new Map<string, Word>(THEMES.flatMap((t) => t.words).map((w) => [w.id, w]));

export function getWord(id: string): Word | undefined {
  return WORDS_BY_ID.get(id);
}
