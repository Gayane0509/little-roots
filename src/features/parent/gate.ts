import { Redirect, router, useFocusEffect } from 'expo-router';
import { createElement, useCallback, useEffect, useRef, type ReactElement } from 'react';
import { AppState } from 'react-native';

import type { GateRoute } from './gateRules';

const VALID_MS = 5 * 60 * 1000;

export { GATE_ROUTES, parseGateRoute, type GateRoute } from './gateRules';
export {
  COOLDOWN_MS,
  MAX_WRONG_ATTEMPTS,
  cooldownRemainingMs,
  isGateAnswerCorrect,
  newGateQuestion,
  recordWrongAttempt,
  resetGateAttempts,
  type GateQuestion,
} from './gateRules';

let passedAt: number | null = null;

/** In-memory only (never persisted): remembers that the adult check was just passed. */
export function markGatePassed(): void {
  passedAt = Date.now();
}

export function isGatePassed(): boolean {
  return passedAt !== null && Date.now() - passedAt < VALID_MS;
}

/**
 * Guard for parent screens. Returns a <Redirect> to the gate when the check has not been passed (or expired);
 * while the screen is open it re-checks on focus and when the app returns to the foreground.
 * Call it at the top of the screen and return the result when it is not null.
 */
export function useParentGuard(route: GateRoute): ReactElement | null {
  // Only an expiry after a successful pass needs an imperative redirect; a missing pass renders <Redirect>.
  const wasPassed = useRef(false);
  const passed = isGatePassed();
  useEffect(() => {
    if (passed) wasPassed.current = true;
  }, [passed]);

  const recheck = useCallback(() => {
    if (wasPassed.current && !isGatePassed()) {
      router.replace({ pathname: '/parent-gate', params: { next: route } });
    }
  }, [route]);

  // While focused, also expire the screen at the moment the pass runs out.
  useFocusEffect(
    useCallback(() => {
      recheck();
      const left = passedAt === null ? 0 : passedAt + VALID_MS - Date.now();
      if (left <= 0) return undefined;
      const timer = setTimeout(recheck, left + 50);
      return () => clearTimeout(timer);
    }, [recheck]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') recheck();
    });
    return () => sub.remove();
  }, [recheck]);

  if (passed) return null;
  return createElement(Redirect, { href: { pathname: '/parent-gate', params: { next: route } } });
}
