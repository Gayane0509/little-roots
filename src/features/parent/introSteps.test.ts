import { expect, test } from '@jest/globals';

import { INTRO_STEPS } from './introSteps';
import { ACTIVE_PACK } from '@/content/packs';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';

test('parent intro has five distinct steps', () => {
  expect(INTRO_STEPS).toHaveLength(5);
  expect(new Set(INTRO_STEPS.map((step) => step.id)).size).toBe(5);
});
test('the family voice step says recordings stay on the device', () => {
  expect(INTRO_STEPS.find((step) => step.id === 'family-voice')?.body).toContain('stay on this device');
});

test('plan step reflects the free limits', () => {
  const body = INTRO_STEPS.find((step) => step.id === 'plans')?.body;
  expect(body).toContain(`${FREE_LIMITS.tracingLetters} letters to trace`);
  expect(body).toContain(`${FREE_LIMITS.gamesPerDay} games a day`);
  expect(body).toContain(`${ACTIVE_PACK.themes.length}`);
  expect(body).toContain(`${MAX_PROFILES}`);
});
