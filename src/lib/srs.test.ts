import { describe, expect, it } from '@jest/globals';
import { dueWordIds, INTERVAL_DAYS, isLearned, scheduleReview } from './srs';

describe('spaced repetition', () => {
  const now = Date.UTC(2026, 0, 1);

  it('starts a new word in box zero and advances on correct reviews', () => {
    const first = scheduleReview(undefined, 'family.mom', true, now);
    expect(first).toEqual({ wordId: 'family.mom', box: 0, dueAt: now + 86_400_000, seen: 1, correct: 1, learnedAt: now });
    const second = scheduleReview(first, first.wordId, true, first.dueAt);
    expect(second.box).toBe(1);
    expect(second.dueAt).toBe(first.dueAt + INTERVAL_DAYS[1] * 86_400_000);
    expect(isLearned(second)).toBe(true);
    expect(isLearned(first)).toBe(false);
  });

  it('resets on a wrong answer and orders due words by due time', () => {
    const first = scheduleReview(undefined, 'a', false, now);
    const advanced = scheduleReview(first, 'a', true, first.dueAt);
    const reset = scheduleReview(advanced, 'a', false, advanced.dueAt);
    expect(reset).toMatchObject({ box: 0, seen: 3, correct: 1, learnedAt: now });
    expect(dueWordIds({ a: reset, b: { ...first, wordId: 'b', dueAt: now } }, reset.dueAt)).toEqual(['b', 'a']);
  });
});
