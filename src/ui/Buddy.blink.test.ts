import { expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };

test('Buddy blinks at most once per 4 s and skips the blink under reduce motion or on a covered screen', () => {
  const source = readFileSync('src/ui/Buddy.tsx', 'utf8');
  const every = Number(/BLINK_EVERY_MS = (\d+)/.exec(source)?.[1]);
  const length = Number(/BLINK_MS = (\d+)/.exec(source)?.[1]);
  expect(every).toBeGreaterThanOrEqual(4000);
  expect(length).toBeLessThanOrEqual(200);
  expect(source).toMatch(/if \(reduceMotion \|\| !focused \|\| !blinkXml\) return;/);
});
