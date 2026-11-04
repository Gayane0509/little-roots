import { expect, test } from '@jest/globals';

import { shouldShowTapHint } from './tapHint';

const firstLesson = { lessons: [] };
const later = { lessons: [{ day: '2026-11-04', newWordIds: ['family.mom'], reviewedCount: 0 }] };

test('the tap hand shows on the first card of a child\'s first lesson until the first tap', () => {
  expect(shouldShowTapHint(firstLesson, 0, false)).toBe(true);
  expect(shouldShowTapHint(firstLesson, 0, true)).toBe(false);
  expect(shouldShowTapHint(firstLesson, 1, false)).toBe(false);
});
test('a child who has finished a lesson never sees it again', () => {
  expect(shouldShowTapHint(later, 0, false)).toBe(false);
});
