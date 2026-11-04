import { CONTENT_MAX_WIDTH, SHORT_WINDOW_BELOW, spacing, WIDE_BREAKPOINT } from '@/ui/tokens';

export type OnboardingLayout = { avatarArt: number; avatarAspectRatio: number; gap: number };

/**
 * Onboarding sizes. Avatar tiles are 31 % of the content column; on wide windows the picture grows with the tile. Phones
 * keep 64, or 56 on short windows so a 5:4 tile on a 320 px phone still holds it with the selected border. On short
 * windows (iPhone SE 375×667) the gap tightens and the tiles get a little shorter, so "Let's go!" is on screen without
 * scrolling (#87).
 */
export function onboardingLayout(width: number, height: number): OnboardingLayout {
  const short = height < SHORT_WINDOW_BELOW;
  return {
    avatarArt: width >= WIDE_BREAKPOINT ? Math.min(140, Math.round(Math.min(width - spacing.md * 2, CONTENT_MAX_WIDTH) * 0.31 * 0.6)) : short ? 56 : 64,
    avatarAspectRatio: short ? 5 / 4 : 1,
    gap: short ? spacing.md : spacing.lg,
  };
}
