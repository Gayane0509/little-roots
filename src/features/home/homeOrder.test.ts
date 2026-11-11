import { expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };

test("Home puts the child's lesson above the grown-up card, so it stays above the fold on a 375×667 phone (#86)", () => {
  const source = readFileSync('src/app/index.tsx', 'utf8');
  const lesson = source.indexOf('label="Start today\'s lesson"');
  const grownUp = source.indexOf('label={ASK_GROWN_UP_LABEL}');
  expect(lesson).toBeGreaterThan(-1);
  expect(grownUp).toBeGreaterThan(-1);
  expect(lesson).toBeLessThan(grownUp);
});

test('Home shows one Buddy: the free-words-finished line replaces the greeting instead of a second Buddy (#91)', () => {
  const source = readFileSync('src/app/index.tsx', 'utf8');
  expect(source.match(/<Buddy\b/g)).toHaveLength(1);
  expect(source).toMatch(/message=\{freeDone \? line\('free_words_finished'\) : line\('greeting'/);
});
