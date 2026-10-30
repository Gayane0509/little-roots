/** Pure rules of the parent gate (no React / router imports, so they are easy to unit test). */

/** Routes that may be opened through the parent gate (anything else falls back to '/parent'). */
export const GATE_ROUTES = ['/parent', '/parent/paywall', '/parent/voices', '/parent/privacy', '/parent/reminders', '/parent/report', '/parent/children', '/parent/settings'] as const;
export type GateRoute = (typeof GATE_ROUTES)[number];

export function parseGateRoute(next: unknown): GateRoute {
  return GATE_ROUTES.find((r) => r === next) ?? '/parent';
}

/** Adult-level question: two-digit x one-digit, hard for an 8-year-old to do quickly. */
export interface GateQuestion {
  a: number;
  b: number;
}

export function newGateQuestion(random: () => number = Math.random): GateQuestion {
  return { a: 12 + Math.floor(random() * 8), b: 3 + Math.floor(random() * 7) };
}

export function isGateAnswerCorrect(q: GateQuestion, input: string): boolean {
  const trimmed = input.trim();
  return /^\d+$/.test(trimmed) && Number(trimmed) === q.a * q.b;
}

export const MAX_WRONG_ATTEMPTS = 3;
export const COOLDOWN_MS = 30_000;

let wrongAttempts = 0;
let lockedUntil = 0;

/** Counts a wrong answer; the third one starts a 30 second cooldown. */
export function recordWrongAttempt(now: number = Date.now()): void {
  wrongAttempts += 1;
  if (wrongAttempts >= MAX_WRONG_ATTEMPTS) {
    wrongAttempts = 0;
    lockedUntil = now + COOLDOWN_MS;
  }
}

export function cooldownRemainingMs(now: number = Date.now()): number {
  return Math.max(0, lockedUntil - now);
}

export function resetGateAttempts(): void {
  wrongAttempts = 0;
  lockedUntil = 0;
}
