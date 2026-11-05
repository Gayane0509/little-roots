import { expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };

test('the free-plan report is not a dead end: it shows the count and a grey way back after the upgrade (#118)', () => {
  const source = readFileSync('src/app/parent/report.tsx', 'utf8');
  const locked = source.slice(source.indexOf('!canSeeFullReport'), source.indexOf('<SectionList'));
  expect(locked).toContain('report.seenTotal');
  expect(locked).toContain('label="Explore Premium"');
  expect(locked).toMatch(/label="Back to parents" color=\{colors\.textMuted\}/);
  expect(locked.indexOf('label="Explore Premium"')).toBeLessThan(locked.indexOf('label="Back to parents"'));
});
