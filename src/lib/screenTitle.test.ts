import { expect, test } from '@jest/globals';

import { screenTitle } from './screenTitle';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, statSync } = require('fs') as {
  readdirSync(dir: string): string[]; statSync(path: string): { isDirectory(): boolean };
};
const routeFiles = (dir: string, prefix = ''): string[] => readdirSync(dir).flatMap((name) => {
  const path = `${dir}/${name}`;
  if (statSync(path).isDirectory()) return routeFiles(path, `${prefix}${name}/`);
  return /\.tsx$/.test(name) && !/\.test\./.test(name) && !name.startsWith('_') ? [`${prefix}${name}`] : [];
});

test('each screen gets its own tab title', () => {
  expect(screenTitle('/')).toBe('Home · Little Roots');
  expect(screenTitle('/letters')).toBe('Letters · Little Roots');
  expect(screenTitle('/parent/settings/')).toBe('Settings · Little Roots');
  expect(screenTitle('/theme/family')).toBe('Theme · Little Roots');
  expect(screenTitle('/nowhere')).toBe('Little Roots');
});

test('every route file has a title (new screens must add one)', () => {
  const files = routeFiles('src/app');
  expect(files.length).toBeGreaterThan(10);
  for (const file of files) {
    const route = '/' + file.replace(/\.tsx$/, '').replace(/(^|\/)index$/, '').replace(/\[[^\]]+\]/, 'x');
    expect([route, screenTitle(route)]).not.toEqual([route, 'Little Roots']);
  }
});
