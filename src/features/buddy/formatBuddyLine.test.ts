import { describe, expect, it } from '@jest/globals';
import { ACTIVE_PACK } from '@/content/packs';
import { formatBuddyLine } from './formatBuddyLine';

describe('formatBuddyLine', () => {
  it('returns English only', () => {
    expect(formatBuddyLine(ACTIVE_PACK.phrases.greeting, 'en', { name: 'Ani' })).toBe('Hello, Ani!');
  });
  it('returns Armenian then English with interpolation', () => {
    expect(formatBuddyLine(ACTIVE_PACK.phrases.greeting, 'hy', { name: 'Ani' })).toBe('Բարև, Ani։\nHello, Ani!');
  });
});
