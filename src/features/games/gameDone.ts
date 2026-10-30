import { canPlayGame } from '@/lib/entitlements';

export function canReplayGame(isPremium: boolean, playedToday: number): boolean {
  return canPlayGame(isPremium, playedToday);
}
