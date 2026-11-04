import { expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readdirSync, readFileSync } = require('fs') as {
  readdirSync(path: string, options: { recursive: true }): string[];
  readFileSync(path: string, encoding: 'utf8'): string;
};

// AI_DECISIONS "No emoji pictures": buttons and the parent report use drawn icons, not emoji (#35, #99).
const EMOJI = /\p{Extended_Pictographic}/u;
const screens = readdirSync('src', { recursive: true })
  .filter((file) => file.endsWith('.tsx') && !file.includes('.test.'))
  .map((file) => `src/${file}`);

// Every button label is plain words; a picture goes through BigButton's drawn `icon` (#100). Covers label="…" and
// quoted strings inside label={…} (template literals, ternaries).
test('no label on any screen or component contains an emoji', () => {
  const offenders = screens.flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/\blabel=(?:"([^"]*)"|\{([^}\n]*)\})/g)]
      .filter((m) => EMOJI.test(m[1] ?? m[2] ?? ''))
      .map((m) => `${file}: ${m[0]}`),
  );
  expect(offenders).toEqual([]);
});

test('no emoji drawn as a <Text> picture (privacy title, game tick) (#100 review)', () => {
  const offenders = screens.flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/<Text\b[^>]*>([^<{]*)<\/Text>/g)].filter((m) => EMOJI.test(m[1])).map((m) => `${file}: ${m[1]}`),
  );
  expect(offenders).toEqual([]);
});

test('the parent report stats show no emoji (streak uses the drawn flame)', () => {
  const stats = readFileSync('src/app/parent/index.tsx', 'utf8').match(/<Stat [^\n]*/g) ?? [];
  expect(stats.length).toBeGreaterThan(0);
  for (const stat of stats) expect(stat).not.toMatch(EMOJI);
  expect(stats.join('\n')).toContain('icon="flame"');
});
