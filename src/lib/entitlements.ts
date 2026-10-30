/**
 * What the free tier includes. Every premium gate in the app reads from here so the offer stays consistent
 * with the paywall copy.
 */
export const FREE_LIMITS = {
  /** Family voice recordings a free family can keep. */
  recordings: 5,
  /** Letters (in alphabet order) a free child can trace: Ա Բ Գ Դ Ե Զ. */
  tracingLetters: 6,
  /** Game rounds (one finished game) per local day. */
  gamesPerDay: 3,
} as const;

export function canRecordMore(isPremium: boolean, recordingCount: number): boolean {
  return isPremium || recordingCount < FREE_LIMITS.recordings;
}

/** `letterIndex` is the 0-based position in the alphabet. */
export function canTraceLetter(isPremium: boolean, letterIndex: number): boolean {
  return isPremium || letterIndex < FREE_LIMITS.tracingLetters;
}

export function canPlayGame(isPremium: boolean, gamesPlayedToday: number): boolean {
  return isPremium || gamesPlayedToday < FREE_LIMITS.gamesPerDay;
}

export function gamesLeftToday(isPremium: boolean, gamesPlayedToday: number): number | null {
  return isPremium ? null : Math.max(0, FREE_LIMITS.gamesPerDay - gamesPlayedToday);
}

/** The full report (every word, mastery by theme, weekly history) is premium; the weekly summary is free. */
export function canSeeFullReport(isPremium: boolean): boolean {
  return isPremium;
}
