import { describe, expect, it } from '@jest/globals';
import { exploredLine } from './exploredLine';

describe('exploredLine', () => {
  it('names the child on the free-plan preview', () => {
    expect(exploredLine('Mari', 24)).toBe('Mari has explored 24 words');
    expect(exploredLine('Mari', 1)).toBe('Mari has explored 1 word');
  });

  it('names the child on the full report', () => {
    expect(exploredLine('Mari', 24, 104)).toBe('Mari: 24 of 104 words explored');
  });

  it('keeps the plain count when there is no child name', () => {
    expect(exploredLine(undefined, 24)).toBe('24 words explored so far');
    expect(exploredLine(undefined, 24, 104)).toBe('24 of 104 words explored');
  });
});
