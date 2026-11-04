import { expect, test } from '@jest/globals';

// Drawings must not keep invisible shapes: they are still parsed and drawn on every render (#93).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, readFileSync } = require('fs') as {
  readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string;
};

test('no art file has a shape with opacity 0', () => {
  const paths = ['src/art', 'src/art/words'].flatMap((dir) =>
    readdirSync(dir).filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts')).map((name) => `${dir}/${name}`));
  const hidden = paths.filter((path) => /\sopacity="0(\.0*)?"/.test(readFileSync(path, 'utf8')));
  expect(paths.length).toBeGreaterThan(10);
  expect(hidden).toEqual([]);
});
