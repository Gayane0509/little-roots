import { expect, test } from '@jest/globals';

// Screen readers announce a Pressable by its role and label; children's text alone is not reliable on Android.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, readFileSync, statSync } = require('fs') as {
  readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
};
const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = `${dir}/${name}`;
  return statSync(path).isDirectory() ? files(path) : /\.tsx$/.test(name) && !/\.test\./.test(name) ? [path] : [];
});

/** The opening `<Pressable …>` tag, skipping `>` inside `{…}` expressions such as arrow functions. */
function openingTags(source: string): { line: number; tag: string }[] {
  const tags: { line: number; tag: string }[] = [];
  for (let start = source.indexOf('<Pressable'); start !== -1; start = source.indexOf('<Pressable', start + 1)) {
    if (/\w/.test(source[start + '<Pressable'.length])) continue;
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

test('every Pressable declares an accessibility role and label', () => {
  const missing = files('src').flatMap((path) => openingTags(readFileSync(path, 'utf8'))
    .filter(({ tag }) => !/\baccessibilityRole=/.test(tag) || !/\baccessibilityLabel=/.test(tag))
    .map(({ line }) => `${path}:${line}`));
  expect(missing).toEqual([]);
});
test('the tag scanner reads past arrow functions', () => {
  expect(openingTags('<Pressable onPress={() => go()} accessibilityRole="button">x</Pressable>')[0].tag).toContain('accessibilityRole');
});
