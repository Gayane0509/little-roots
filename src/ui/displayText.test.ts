import { expect, test } from '@jest/globals';

import { DISPLAY_MAX_FONT_SCALE, font } from './tokens';

// Display text (≥ font.title) sits in fixed-size cards and buttons: at the largest system text sizes it would
// overflow, so it grows at most DISPLAY_MAX_FONT_SCALE×. Body text keeps scaling fully.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, readFileSync, statSync } = require('fs') as {
  readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
};
const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = `${dir}/${name}`;
  return statSync(path).isDirectory() ? files(path) : /\.tsx$/.test(name) && !/\.test\./.test(name) ? [path] : [];
});

const SIZES: Record<string, number> = { ...font };

/** Style names in a file whose fontSize is display-sized (a number ≥ font.title or font.word/font.title). */
export function displayStyles(source: string): string[] {
  const names: string[] = [];
  for (const match of source.matchAll(/(\w+): *\{[^{}]*?fontSize: *(font\.(\w+)|\d+)/g)) {
    const size = match[3] ? SIZES[match[3]] : Number(match[2]);
    if (size >= font.title) names.push(match[1]);
  }
  return names;
}

/** Opening `<Text …>`, `<TextInput …>` and `<Animated.Text …>` tags (props only, up to the first `>` outside `{…}`). */
function textTags(source: string): { line: number; tag: string }[] {
  const tags: { line: number; tag: string }[] = [];
  for (const match of source.matchAll(/<(Animated\.)?Text(Input)?(?!\w)/g)) {
    const start = match.index;
    let depth = 0;
    let end = start;
    for (; end < source.length; end++) {
      const char = source[end];
      if (char === '{') depth++;
      else if (char === '}') depth--;
      else if (char === '>' && depth === 0) break;
    }
    tags.push({ line: source.slice(0, start).split('\n').length, tag: source.slice(start, end + 1) });
  }
  return tags;
}

test('display-sized text caps its growth with large system text', () => {
  const missing = files('src').flatMap((path) => {
    const source = readFileSync(path, 'utf8');
    const names = displayStyles(source);
    return textTags(source)
      .filter(({ tag }) => names.some((name) => new RegExp(`styles\\.${name}\\b`).test(tag)))
      .filter(({ tag }) => !/\bmaxFontSizeMultiplier=\{DISPLAY_MAX_FONT_SCALE\}/.test(tag))
      .map(({ line }) => `${path}:${line}`);
  });
  expect(missing).toEqual([]);
});

test('inline font sizes either cap their growth or opt out of scaling (pixel-sized art)', () => {
  const missing = files('src').flatMap((path) => textTags(readFileSync(path, 'utf8'))
    .filter(({ tag }) => /\bfontSize:/.test(tag))
    .filter(({ tag }) => !/\bmaxFontSizeMultiplier=\{DISPLAY_MAX_FONT_SCALE\}|\ballowFontScaling=\{false\}/.test(tag))
    .map(({ line }) => `${path}:${line}`));
  expect(missing).toEqual([]);
});

test('the tag scanner finds Text, TextInput and Animated.Text but not other names', () => {
  expect(textTags('<Text a>x</Text><TextInput b /><Animated.Text c>y</Animated.Text><TextBox d />').map(({ tag }) => tag))
    .toEqual(['<Text a>', '<TextInput b />', '<Animated.Text c>']);
});

test('shared kid components cap their labels', () => {
  for (const path of ['src/ui/BigButton.tsx', 'src/ui/IconTitle.tsx']) {
    const tags = textTags(readFileSync(path, 'utf8'));
    expect(tags.length).toBeGreaterThan(0);
    for (const { tag } of tags) expect(tag).toContain('maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}');
  }
});

test('the style scanner finds display sizes only', () => {
  expect(displayStyles("a: { fontSize: font.word }, b: { color: 'x', fontSize: 34 }, c: { fontSize: font.body }, d: { fontSize: 14 }"))
    .toEqual(['a', 'b']);
  expect(DISPLAY_MAX_FONT_SCALE).toBeGreaterThan(1);
});
