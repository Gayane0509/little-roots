import { describe, expect, it } from '@jest/globals';
import { PHRASES } from '@/content/phrases';
import { formatBuddyLine } from './formatBuddyLine';

describe('formatBuddyLine', () => {
  it('returns English only', () => {
    expect(formatBuddyLine(PHRASES.greeting, 'en', { name: 'Ani' })).toBe('Hello, Ani!');
  });
  it('returns Armenian then English with interpolation', () => {
    expect(formatBuddyLine(PHRASES.greeting, 'hy', { name: 'Ani' })).toBe('Բարև, Ani։\nHello, Ani!');
  });
});
