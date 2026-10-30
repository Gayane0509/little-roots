import { describe, expect, it } from '@jest/globals';

import type { Word } from '@/content/types';
import { weeklyShareText } from './shareText';

const mk = (i: number): Word => ({ hy: `հ${i}`, translit: `t${i}`, en: `e${i}` }) as Word;
const base = { childName: 'Ani', daysActive: 4, newWords: [mk(1), mk(2)], totalWords: 24, streakDays: 3 };

describe('weeklyShareText', () => {
  it('uses plural forms and child name', () => {
    const t = weeklyShareText(base);
    expect(t).toContain("Ani's week");
    expect(t).toContain('4 of 7 days');
    expect(t).toContain('2 new words: հ1 (t1, e1), հ2 (t2, e2)');
    expect(t).toContain('24 words so far');
    expect(t).toContain('3-day streak');
  });
  it('uses singular forms', () => {
    const t = weeklyShareText({ ...base, daysActive: 1, newWords: [mk(1)], totalWords: 1 });
    expect(t).toContain('1 of 7 days\n');
    expect(t).toContain('1 new word:');
    expect(t).toContain('1 word so far');
  });
  it('truncates to 5 words', () => {
    const t = weeklyShareText({ ...base, newWords: [1, 2, 3, 4, 5, 6, 7].map(mk) });
    expect(t).toContain('7 new words');
    expect(t).toContain('հ5');
    expect(t).not.toContain('հ6');
    expect(t).toContain('and 2 more');
  });
  it('handles zero new words', () => {
    const t = weeklyShareText({ ...base, newWords: [] });
    expect(t).toContain('Practising words already learned');
    expect(t).not.toContain('new word');
  });
});
