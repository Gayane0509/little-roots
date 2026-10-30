import { describe, expect, it } from '@jest/globals';
import {
  COOLDOWN_MS,
  cooldownRemainingMs,
  isGateAnswerCorrect,
  newGateQuestion,
  parseGateRoute,
  recordWrongAttempt,
  resetGateAttempts,
} from './gateRules';

describe('parent gate', () => {
  it('asks two-digit x one-digit questions', () => {
    for (let i = 0; i < 200; i++) {
      const q = newGateQuestion();
      expect(q.a).toBeGreaterThanOrEqual(12);
      expect(q.a).toBeLessThanOrEqual(19);
      expect(q.b).toBeGreaterThanOrEqual(3);
      expect(q.b).toBeLessThanOrEqual(9);
    }
  });

  it('checks the answer strictly', () => {
    expect(isGateAnswerCorrect({ a: 14, b: 6 }, '84')).toBe(true);
    expect(isGateAnswerCorrect({ a: 14, b: 6 }, ' 84 ')).toBe(true);
    expect(isGateAnswerCorrect({ a: 14, b: 6 }, '8.4e1')).toBe(false);
    expect(isGateAnswerCorrect({ a: 14, b: 6 }, '')).toBe(false);
  });

  it('locks for 30 seconds after 3 wrong attempts', () => {
    resetGateAttempts();
    recordWrongAttempt(1000);
    recordWrongAttempt(1000);
    expect(cooldownRemainingMs(1000)).toBe(0);
    recordWrongAttempt(1000);
    expect(cooldownRemainingMs(1000)).toBe(COOLDOWN_MS);
    expect(cooldownRemainingMs(1000 + COOLDOWN_MS)).toBe(0);
    resetGateAttempts();
  });

  it('whitelists next routes', () => {
    expect(parseGateRoute('/parent/privacy')).toBe('/parent/privacy');
    expect(parseGateRoute('/parent/reminders')).toBe('/parent/reminders');
    expect(parseGateRoute('/parent/report')).toBe('/parent/report');
    expect(parseGateRoute('/parent/children')).toBe('/parent/children');
    expect(parseGateRoute('/lesson')).toBe('/parent');
    expect(parseGateRoute(undefined)).toBe('/parent');
  });
});
