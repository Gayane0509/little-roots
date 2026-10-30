import { expect, test } from '@jest/globals';

import { INTRO_STEPS } from './introSteps';
import { THEMES } from '@/content/themes';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';

test('parent intro has four distinct steps', () => {
  expect(INTRO_STEPS).toHaveLength(4);
  expect(new Set(INTRO_STEPS.map((step) => step.id)).size).toBe(4);
});

test('plan step reflects the free limits', () => {
  const body = INTRO_STEPS.find((step) => step.id === 'plans')?.body;
  expect(body).toContain(`${FREE_LIMITS.recordings} family voice recordings`);
  expect(body).toContain(`${FREE_LIMITS.tracingLetters} letters to trace`);
  expect(body).toContain(`${FREE_LIMITS.gamesPerDay} games a day`);
  expect(body).toContain(`${THEMES.length}`);
  expect(body).toContain(`${MAX_PROFILES}`);
});
