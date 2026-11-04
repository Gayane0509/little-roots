import { expect, test } from '@jest/globals';

// Maestro flows (.maestro/) find elements by visible text; catch label drift without a device build.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, readFileSync, statSync } = require('fs') as {
  readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
};
const join = (...parts: string[]) => parts.join('/');
const SELECTOR = /^\s*-?\s*(?:tapOn|assertVisible|visible|text):\s*(?:\{\s*text:\s*)?"([^"]+)"/;
const REGEX_CHARS = /\\d|\.\*|[|()]/;

function files(dir: string, match: (name: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path, match) : match(name) ? [path] : [];
  });
}

const flows = files('.maestro', (name) => name.endsWith('.yaml'));
const source = files('src', (name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name))
  .map((path) => readFileSync(path, 'utf8')).join('\n');

test('there are smoke flows for onboarding → lesson → reward and the parent gate', () => {
  const names = flows;
  expect(names).toEqual(expect.arrayContaining(['.maestro/onboarding_lesson_reward.yaml', '.maestro/parent_gate.yaml']));
});
test.each(flows.map((path) => [path]))('%s only uses labels that exist in the app', (path) => {
  const labels = readFileSync(path, 'utf8').split('\n')
    .map((line) => SELECTOR.exec(line)?.[1])
    .filter((label): label is string => label !== undefined && !REGEX_CHARS.test(label));
  expect(labels.length).toBeGreaterThan(0);
  expect(labels.filter((label) => !source.includes(label))).toEqual([]);
});
