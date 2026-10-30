import { describe, expect, it, jest } from '@jest/globals';
import type { ProgressState } from './progress.types';
import { applyCompleteLesson, applyRecordAnswer, parseProgress } from './progress';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: () => Promise.resolve(null), setItem: () => Promise.resolve() },
}));

function empty(): ProgressState {
  return {
    childName: '', stars: 0, streakDays: 0, lastLessonDay: null,
    words: {}, lessons: [], stickers: [], isPremium: false,
  };
}

function noon(day: number): number {
  return new Date(2026, 0, day, 12).getTime();
}

const summary = { newWordIds: ['family.mom'], reviewedCount: 1, starsEarned: 4, sticker: '👩' };

describe('progress updates', () => {
  it('starts, preserves, advances, and resets a streak by local day', () => {
    const first = applyCompleteLesson(empty(), summary, noon(1));
    expect(first.streakDays).toBe(1);
    const same = applyCompleteLesson(first, summary, noon(1) + 60_000);
    expect(same.streakDays).toBe(1);
    const next = applyCompleteLesson(same, summary, noon(2));
    expect(next.streakDays).toBe(2);
    const gap = applyCompleteLesson(next, summary, noon(4));
    expect(gap.streakDays).toBe(1);
    const earlier = applyCompleteLesson(next, summary, noon(1));
    expect(earlier.streakDays).toBe(2);
  });

  it('adds missing new words, stars, records, and a sticker only once', () => {
    const first = applyCompleteLesson(empty(), summary, noon(1));
    expect(first.words['family.mom']).toMatchObject({ seen: 1, correct: 1, box: 0 });
    expect(first.stars).toBe(4);
    expect(first.lessons).toHaveLength(1);
    const second = applyCompleteLesson(first, summary, noon(2));
    expect(second.words['family.mom'].seen).toBe(1);
    expect(second.stickers).toEqual(['👩']);
    expect(second.stars).toBe(8);
  });

  it('retains both rapid answer updates on the same word', () => {
    const first = applyRecordAnswer(empty(), 'family.mom', true, noon(1));
    const second = applyRecordAnswer(first, 'family.mom', false, noon(1) + 1);
    expect(second.words['family.mom']).toMatchObject({ seen: 2, correct: 1, box: 0 });
  });

  it('keeps valid fields from a partly corrupt save', () => {
    const parsed = parseProgress(JSON.stringify({ childName: 'Ani', stars: 'bad', stickers: ['🐻', 42], words: null, isPremium: true }));
    expect(parsed.childName).toBe('Ani');
    expect(parsed.stars).toBe(0);
    expect(parsed.stickers).toEqual(['🐻']);
    expect(parsed.words).toEqual({});
    expect(parseProgress('{oops')).toEqual(empty());
  });
});
