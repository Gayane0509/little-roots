import { describe, expect, it } from '@jest/globals';
import { isPlayingNow } from './childRow';

describe('isPlayingNow', () => {
  it('tags only the active child when there are two or more', () => {
    expect(isPlayingNow('a', 'a', 2)).toBe(true);
    expect(isPlayingNow('b', 'a', 2)).toBe(false);
  });

  it('shows no tag for a single child or without an active child', () => {
    expect(isPlayingNow('a', 'a', 1)).toBe(false);
    expect(isPlayingNow('a', null, 2)).toBe(false);
  });
});
