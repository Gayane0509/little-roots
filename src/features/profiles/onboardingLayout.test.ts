import { expect, test } from '@jest/globals';
import { SHORT_WINDOW_BELOW, spacing } from '@/ui/tokens';
import { onboardingLayout } from './onboardingLayout';

test('phones keep 64 px avatar pictures; wide windows grow them with the tile, capped at 140', () => {
  expect(onboardingLayout(375, 812).avatarArt).toBe(80);
  // A 320 px phone's tile is ~89 px: the picture keeps a margin inside it.
  expect(onboardingLayout(320, 812).avatarArt).toBe(71);
  expect(onboardingLayout(600, 900).avatarArt).toBe(106);
  expect(onboardingLayout(1366, 1024).avatarArt).toBe(134);
});

test('short windows get the tight gap and shorter avatar tiles; taller ones keep square tiles', () => {
  expect(onboardingLayout(375, 667)).toMatchObject({ gap: spacing.md, avatarAspectRatio: 5 / 4, avatarArt: 56 });
  expect(onboardingLayout(375, SHORT_WINDOW_BELOW - 1).gap).toBe(spacing.md);
  expect(onboardingLayout(375, SHORT_WINDOW_BELOW)).toMatchObject({ gap: spacing.lg, avatarAspectRatio: 1 });
  expect(onboardingLayout(375, 812)).toMatchObject({ gap: spacing.lg, avatarAspectRatio: 1 });
});
