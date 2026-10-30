import { THEMES } from '@/content/themes';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';
import type { ProgressState } from '@/state/progress.types';

export type OfferReason = 'themes' | 'voice' | 'games' | 'letters' | 'report' | 'children';
const headlines: Record<OfferReason, string> = {
  themes: '80 more words to discover', voice: 'Hear family voices in every lesson',
  children: 'Room for every child in your family',
  games: 'Unlimited games', letters: 'Trace all 39 letters', report: 'See every word your child learns',
};
export function parseOfferReason(reason: unknown): OfferReason | undefined {
  return typeof reason === 'string' && Object.hasOwn(headlines, reason) ? reason as OfferReason : undefined;
}

export function offerHeadline(reason: unknown): string {
  const valid = parseOfferReason(reason);
  return valid ? headlines[valid] : "Hear grandma's voice in every lesson";
}
export const comparison = [
  { feature: 'Children', free: String(FREE_LIMITS.profiles), premium: String(MAX_PROFILES) },
  { feature: 'Words', free: String(THEMES.filter((theme) => theme.free).reduce((sum, theme) => sum + theme.words.length, 0)), premium: String(THEMES.reduce((sum, theme) => sum + theme.words.length, 0)) },
  { feature: 'Family voice recordings', free: String(FREE_LIMITS.recordings), premium: 'Unlimited' },
  { feature: 'Games per day', free: String(FREE_LIMITS.gamesPerDay), premium: 'Unlimited' },
  { feature: 'Letters to trace', free: String(FREE_LIMITS.tracingLetters), premium: '39' },
  { feature: 'Parent progress', free: 'Weekly summary', premium: 'Every word + 8 weeks' },
];
export function freeWordsFinished(state: ProgressState): boolean {
  return THEMES.filter((theme) => theme.free).every((theme) => theme.words.every((word) => (state.words[word.id]?.seen ?? 0) > 0));
}
