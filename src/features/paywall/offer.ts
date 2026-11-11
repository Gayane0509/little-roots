import { ACTIVE_PACK } from '@/content/packs';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';
import type { ProgressState } from '@/state/progress.types';
import { CONTENT_MAX_WIDTH, spacing } from '@/ui/tokens';

/** The themes Premium unlocks and how many words they hold, for the paywall's picture strip (#121). */
export const PREMIUM_THEMES = ACTIVE_PACK.themes.filter((theme) => !theme.free);
export const PREMIUM_WORDS = PREMIUM_THEMES.reduce((sum, theme) => sum + theme.words.length, 0);

export type OfferReason = 'themes' | 'games' | 'letters' | 'report' | 'children';
const headlines: Record<OfferReason, string> = {
  themes: `${PREMIUM_WORDS} more words to discover`,
  children: 'Room for every child in your family',
  games: 'Unlimited games', letters: 'Trace all 39 letters', report: 'See every word your child learns',
};
export function parseOfferReason(reason: unknown): OfferReason | undefined {
  return typeof reason === 'string' && Object.hasOwn(headlines, reason) ? reason as OfferReason : undefined;
}

export function offerHeadline(reason: unknown): string {
  const valid = parseOfferReason(reason);
  return valid ? headlines[valid] : 'Every theme, letter and game for your family';
}
export const comparison = [
  { feature: 'Children', free: String(FREE_LIMITS.profiles), premium: String(MAX_PROFILES) },
  { feature: 'Words', free: String(ACTIVE_PACK.themes.filter((theme) => theme.free).reduce((sum, theme) => sum + theme.words.length, 0)), premium: String(ACTIVE_PACK.themes.reduce((sum, theme) => sum + theme.words.length, 0)) },
  { feature: 'Games per day', free: String(FREE_LIMITS.gamesPerDay), premium: 'Unlimited' },
  { feature: 'Letters to trace', free: String(FREE_LIMITS.tracingLetters), premium: '39' },
  { feature: 'Parent progress', free: 'Weekly summary', premium: 'Every word + 8 weeks' },
];
export function freeWordsFinished(state: ProgressState): boolean {
  return ACTIVE_PACK.themes.filter((theme) => theme.free).every((theme) => theme.words.every((word) => (state.words[word.id]?.seen ?? 0) > 0));
}

const STRIP_TILE = 56;
const STRIP_GAP = spacing.sm;

/**
 * Tile size for the paywall picture strip (#139): one row when every theme fits, otherwise two even rows
 * (5 + 5, never 4 + 4 + 2 at 320 px), with tiles shrinking below 56 px only when two rows still don't fit.
 */
export function premiumStripLayout(windowWidth: number, count = PREMIUM_THEMES.length): { tile: number; art: number; rowWidth: number } {
  const content = Math.min(windowWidth - 2 * spacing.md, CONTENT_MAX_WIDTH);
  const span = (perRow: number, tile: number) => perRow * tile + (perRow - 1) * STRIP_GAP;
  const perRow = span(count, STRIP_TILE) <= content ? count : Math.ceil(count / 2);
  const tile = Math.min(STRIP_TILE, Math.floor((content - (perRow - 1) * STRIP_GAP) / perRow));
  return { tile, art: Math.round((tile * 40) / STRIP_TILE), rowWidth: span(perRow, tile) };
}
