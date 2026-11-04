import { expect, jest, test } from '@jest/globals';
import { readScreenFocused } from './useScreenFocused';

// The real expo-router pulls in native-stack, which the Jest preset cannot load.
jest.mock('expo-router', () => ({ useIsFocused: () => true }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };

test('reports the navigator focus state', () => {
  expect(readScreenFocused(() => true)).toBe(true);
  expect(readScreenFocused(() => false)).toBe(false);
});

test('counts as focused outside a navigator', () => {
  expect(readScreenFocused(() => { throw new Error("Couldn't find a focus context."); })).toBe(true);
});

test('Buddy pauses its endless bounce on covered screens', () => {
  const source = readFileSync('src/ui/Buddy.tsx', 'utf8');
  expect(source).toContain('useScreenFocused()');
  expect(source).toMatch(/if \(reduceMotion \|\| !focused\)/);
});
