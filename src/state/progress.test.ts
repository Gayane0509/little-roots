import { act, createElement, useEffect, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { ProgressState } from './progress.types';
import { ProgressProvider, applyCompleteLesson, applyRecordAnswer, parseProgress, useProgress } from './progress';

jest.mock('react-native', () => {
  const listeners = new Set();
  return { AppState: {
    addEventListener: jest.fn((_event, listener) => {
      listeners.add(listener);
      return { remove: () => listeners.delete(listener) };
    }),
  }, listeners };
});
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = { value: null as string | null, failLoad: false, failSave: false };
  return { __esModule: true, store, default: {
    getItem: jest.fn(async () => {
      if (store.failLoad) throw new Error('load failed');
      return store.value;
    }),
    setItem: jest.fn(async (_key, value) => {
      if (store.failSave) throw new Error('save failed');
      store.value = value as string;
    }),
  } };
});

type Api = ReturnType<typeof useProgress>;
let api: Api;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;
const storage = jest.requireMock('@react-native-async-storage/async-storage') as {
  store: { value: string | null; failLoad: boolean; failSave: boolean };
  default: { getItem: jest.Mock; setItem: jest.Mock };
};
const native = jest.requireMock('react-native') as { listeners: Set<(state: string) => void> };

function Probe() {
  const current = useProgress();
  useEffect(() => { api = current; }, [current]);
  return null;
}

async function mount() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(createElement(ProgressProvider, null, createElement(Probe))); });
  expect(api.ready).toBe(true);
}

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.value = null;
  storage.store.failLoad = false;
  storage.store.failSave = false;
  storage.default.getItem.mockClear();
  storage.default.setItem.mockClear();
});
afterEach(async () => {
  if (root) await act(async () => { root?.unmount(); });
  root = null;
  jest.useRealTimers();
  document.body.innerHTML = '';
});

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

  it('drops lessons older than 120 local days while preserving future-dated lessons', () => {
    const now = noon(200);
    const today = new Date(now);
    const dayAgo = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - days);
      return localDate(d);
    };
    const lessons = [-1, 0, 119, 120, 121].map((age) => ({ day: dayAgo(age), newWordIds: [], reviewedCount: 0 }));
    const parsed = parseProgress(JSON.stringify({ lessons }), now);
    expect(parsed.lessons.map((record) => record.day)).toEqual([dayAgo(-1), dayAgo(0), dayAgo(119)]);
    const completed = applyCompleteLesson({ ...empty(), lessons }, summary, now);
    expect(completed.lessons.map((record) => record.day)).toEqual([dayAgo(-1), dayAgo(0), dayAgo(119), dayAgo(0)]);
  });
});

function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

describe('progress persistence', () => {
  it('batches rapid updates and flushes when the app goes inactive', async () => {
    jest.useFakeTimers();
    await mount();
    await act(async () => { jest.advanceTimersByTime(300); }); // Initial bounded snapshot.
    storage.default.setItem.mockClear();
    await act(async () => {
      api.setChildName('Ani');
      api.recordAnswer('family.mom', true);
      api.recordAnswer('family.mom', false);
      jest.advanceTimersByTime(299);
    });
    expect(storage.default.setItem).not.toHaveBeenCalled();
    await act(async () => { jest.advanceTimersByTime(1); });
    expect(storage.default.setItem).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.store.value ?? '{}')).toMatchObject({ childName: 'Ani', words: { 'family.mom': { seen: 2 } } });
    await act(async () => { api.setChildName('Aram'); });
    await act(async () => { native.listeners.forEach((listener) => listener('inactive')); });
    expect(JSON.parse(storage.store.value ?? '{}')).toMatchObject({ childName: 'Aram' });
  });

  it('surfaces a failed save and clears the error after a successful retry', async () => {
    jest.useFakeTimers();
    await mount();
    await act(async () => { jest.advanceTimersByTime(300); });
    storage.store.failSave = true;
    await act(async () => { api.setChildName('Ani'); jest.advanceTimersByTime(300); });
    expect(api.storageError).toBe(true);
    storage.store.failSave = false;
    await act(async () => { api.retryStorage(); });
    expect(api.storageError).toBe(false);
    expect(JSON.parse(storage.store.value ?? '{}').childName).toBe('Ani');
  });

  it('retries a failed load and replays local changes before saving', async () => {
    jest.useFakeTimers();
    storage.store.value = JSON.stringify({ ...empty(), stars: 7 });
    storage.store.failLoad = true;
    await mount();
    expect(api.storageError).toBe(true);
    await act(async () => { api.setChildName('Ani'); jest.advanceTimersByTime(300); });
    expect(storage.default.setItem).not.toHaveBeenCalled();
    storage.store.failLoad = false;
    await act(async () => { api.retryStorage(); });
    expect(api.storageError).toBe(false);
    expect(api.state).toMatchObject({ stars: 7, childName: 'Ani' });
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(JSON.parse(storage.store.value ?? '{}')).toMatchObject({ stars: 7, childName: 'Ani' });
  });

  it('starts only one load when retry is pressed twice before it settles', async () => {
    storage.store.failLoad = true;
    await mount();
    expect(api.storageError).toBe(true);
    storage.store.failLoad = false;
    await act(async () => { api.retryStorage(); api.retryStorage(); });
    expect(storage.default.getItem).toHaveBeenCalledTimes(2); // Initial load plus one retry.
    expect(api.storageError).toBe(false);
  });
});
