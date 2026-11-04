import { expect, test } from '@jest/globals';

import { getWordArt } from '@/art';
import { ICONS } from '@/art/icons';
import '@/art/words';
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

test('every step has a drawn picture that exists (no emoji)', () => {
  for (const { picture } of INTRO_STEPS) {
    if (picture.kind === 'icon') expect(ICONS[picture.name]).toBeDefined();
    if (picture.kind === 'word') expect(getWordArt(picture.wordId)).toBeDefined();
  }
  expect(INTRO_STEPS.map((step) => step.picture.kind)).toContain('buddy');
});
