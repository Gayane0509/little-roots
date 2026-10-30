import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { daysBetween, localDay } from '@/lib/date';
import { scheduleReview } from '@/lib/srs';
import type { WordProgress, WordProgressMap } from '@/lib/srs.types';
import type { LessonRecord, LessonSummary, ProgressApi, ProgressState } from './progress.types';

const STORAGE_KEY = 'littleroots.progress.v1';

function defaultProgress(): ProgressState {
  return {
    childName: '', stars: 0, streakDays: 0, lastLessonDay: null,
    words: {}, lessons: [], stickers: [], isPremium: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isWordProgress(value: unknown): value is WordProgress {
  return isRecord(value) && typeof value.wordId === 'string' &&
    typeof value.box === 'number' && Number.isFinite(value.box) &&
    typeof value.dueAt === 'number' && Number.isFinite(value.dueAt) &&
    typeof value.seen === 'number' && Number.isFinite(value.seen) &&
    typeof value.correct === 'number' && Number.isFinite(value.correct) &&
    typeof value.learnedAt === 'number' && Number.isFinite(value.learnedAt);
}

function isLessonRecord(value: unknown): value is LessonRecord {
  return isRecord(value) && typeof value.day === 'string' &&
    Array.isArray(value.newWordIds) && value.newWordIds.every((id) => typeof id === 'string') &&
    typeof value.reviewedCount === 'number' && Number.isFinite(value.reviewedCount);
}

export function parseProgress(raw: string | null): ProgressState {
  const defaults = defaultProgress();
  if (!raw) return defaults;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return defaults;
    const words: WordProgressMap = {};
    if (isRecord(value.words)) {
      for (const [id, progress] of Object.entries(value.words)) {
        if (isWordProgress(progress) && progress.wordId === id) words[id] = progress;
      }
    }
    return {
      ...defaults,
      childName: typeof value.childName === 'string' ? value.childName : defaults.childName,
      stars: typeof value.stars === 'number' && Number.isFinite(value.stars) ? value.stars : defaults.stars,
      streakDays: typeof value.streakDays === 'number' && Number.isFinite(value.streakDays) ? value.streakDays : defaults.streakDays,
      lastLessonDay: value.lastLessonDay === null || typeof value.lastLessonDay === 'string' ? value.lastLessonDay : defaults.lastLessonDay,
      words,
      lessons: Array.isArray(value.lessons) ? value.lessons.filter(isLessonRecord) : defaults.lessons,
      stickers: Array.isArray(value.stickers) ? value.stickers.filter((sticker): sticker is string => typeof sticker === 'string') : defaults.stickers,
      // The purchase flow is a stub. A saved dev toggle cannot unlock production content.
      isPremium: __DEV__ && typeof value.isPremium === 'boolean' ? value.isPremium : false,
    };
  } catch {
    return defaults;
  }
}

export function applyRecordAnswer(previous: ProgressState, wordId: string, correct: boolean, now: number): ProgressState {
  return {
    ...previous,
    words: {
      ...previous.words,
      [wordId]: scheduleReview(previous.words[wordId], wordId, correct, now),
    },
  };
}

export function applyCompleteLesson(previous: ProgressState, summary: LessonSummary, now: number): ProgressState {
  const day = localDay(now);
  const distance = previous.lastLessonDay ? daysBetween(previous.lastLessonDay, day) : Infinity;
  const words = { ...previous.words };
  for (const wordId of summary.newWordIds) {
    if (!words[wordId]) words[wordId] = scheduleReview(undefined, wordId, true, now);
  }
  return {
    ...previous,
    words,
    stars: previous.stars + summary.starsEarned,
    stickers: summary.sticker && !previous.stickers.includes(summary.sticker)
      ? [...previous.stickers, summary.sticker] : previous.stickers,
    lessons: [...previous.lessons, {
      day, newWordIds: summary.newWordIds, reviewedCount: summary.reviewedCount,
    }],
    lastLessonDay: day,
    streakDays: distance <= 0 ? previous.streakDays : distance === 1 ? previous.streakDays + 1 : 1,
  };
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);
  const persistenceEnabled = useRef(true);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => { if (active) setState(parseProgress(stored)); })
      .catch((error: unknown) => {
        if (!active) return;
        persistenceEnabled.current = false;
        if (__DEV__) console.warn('Could not load progress; saving is disabled for this session.', error);
      })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || !persistenceEnabled.current) return;
    const serialized = JSON.stringify(state);
    writeQueue.current = writeQueue.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized))
      .catch((error: unknown) => {
        if (__DEV__) console.warn('Could not save progress.', error);
      });
  }, [state, ready]);

  // Calls before hydration are ignored, so the loaded snapshot cannot erase them.
  const setChildName = useCallback<ProgressApi['setChildName']>((name) => {
    if (!ready) return;
    setState((previous) => ({ ...previous, childName: name.trim() }));
  }, [ready]);
  const recordAnswer = useCallback<ProgressApi['recordAnswer']>((wordId, correct) => {
    if (!ready) return;
    setState((previous) => applyRecordAnswer(previous, wordId, correct, Date.now()));
  }, [ready]);
  const completeLesson = useCallback<ProgressApi['completeLesson']>((summary) => {
    if (!ready) return;
    setState((previous) => applyCompleteLesson(previous, summary, Date.now()));
  }, [ready]);
  const setPremium = useCallback<ProgressApi['setPremium']>((value) => {
    if (!ready) return;
    setState((previous) => ({ ...previous, isPremium: __DEV__ ? value : false }));
  }, [ready]);
  const reset = useCallback<ProgressApi['reset']>(() => {
    if (!ready) return;
    setState(defaultProgress());
  }, [ready]);

  const api = useMemo<ProgressApi>(() => ({
    state, ready, setChildName, recordAnswer, completeLesson, setPremium, reset,
  }), [state, ready, setChildName, recordAnswer, completeLesson, setPremium, reset]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
