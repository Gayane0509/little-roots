import { expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };

// AI_DECISIONS "Grown-up prompts stay secondary": on kid screens every upgrade button is grey (#91, #97).
const FILES = ['src/app/index.tsx', 'src/app/lesson.tsx', 'src/app/games/index.tsx', 'src/features/games/GameShell.tsx', 'src/features/games/GameDoneActions.tsx', 'src/app/profiles.tsx'];

test.each(FILES)('%s: grown-up upgrade buttons use the secondary grey', (file) => {
  const buttons = readFileSync(file, 'utf8').match(/<BigButton\s+label=(?:"Grown-ups|\{ASK_GROWN_UP_LABEL\})[\s\S]*?\/>/g) ?? [];
  expect(buttons.length).toBeGreaterThan(0);
  for (const button of buttons) expect(button).toContain('color={colors.textMuted}');
});

test.each([
  ['src/app/lesson.tsx', 'label="Back home"', 'label={ASK_GROWN_UP_LABEL}'],
  ['src/features/games/GameShell.tsx', 'label="Back"', 'label="Grown-ups: unlimited games"'],
  ['src/features/games/GameDoneActions.tsx', 'label="Back"', 'label="Grown-ups: unlimited games"'],
  ['src/app/profiles.tsx', 'label="Back to home"', 'label="Grown-ups: add a child"'],
  ['src/app/games/index.tsx', '<FreeActivities />', 'label="Grown-ups: unlimited games"'],
  ['src/features/games/GameShell.tsx', '<FreeActivities />', 'label="Grown-ups: unlimited games"'],
  ['src/features/games/GameDoneActions.tsx', '<FreeActivities />', 'label="Grown-ups: unlimited games"'],
])("%s: the child's button comes before the grown-up prompt", (file, child, grownUp) => {
  const source = readFileSync(file, 'utf8');
  expect(source.indexOf(child)).toBeGreaterThan(-1);
  expect(source.indexOf(child)).toBeLessThan(source.indexOf(grownUp));
});

test('Games list: with no games left the disabled cards are dimmed, not full colour (#98)', () => {
  const source = readFileSync('src/app/games/index.tsx', 'utf8');
  expect(source).toContain('left === 0 && styles.cardResting');
  expect(source).toMatch(/cardResting: \{ opacity: 0\.5 \}/);
  expect(source).toContain('accessibilityState={{ disabled: left === 0 }}');
});
