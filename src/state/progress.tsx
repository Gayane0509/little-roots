import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { daysBetween, localDay } from '@/lib/date';
import { scheduleReview } from '@/lib/srs';
import type { WordProgress, WordProgressMap } from '@/lib/srs.types';
import type { LessonRecord, LessonSummary, ProgressActions, ProgressApi, ProgressSnapshot, ProgressState } from './progress.types';

const STORAGE_KEY = 'littleroots.progress.v1';
const WRITE_DELAY_MS = 300;
const HISTORY_DAYS = 120;

type ProgressUpdate = (previous: ProgressState) => ProgressState;

function defaultProgress(): ProgressState {
  return {
    childName: '', stars: 0, streakDays: 0, lastLessonDay: null,
    words: {}, lessons: [], stickers: [], isPremium: false, gamesToday: { day: '', count: 0 },
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

function recentLessons(lessons: LessonRecord[], now: number): LessonRecord[] {
  const today = localDay(now);
  return lessons.filter((lesson) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lesson.day)) return false;
    const age = daysBetween(lesson.day, today);
    return age < HISTORY_DAYS;
  });
}

export function parseProgress(raw: string | null, now: number = Date.now()): ProgressState {
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
      lessons: Array.isArray(value.lessons) ? recentLessons(value.lessons.filter(isLessonRecord), now) : defaults.lessons,
      stickers: Array.isArray(value.stickers) ? value.stickers.filter((sticker): sticker is string => typeof sticker === 'string') : defaults.stickers,
      gamesToday: isRecord(value.gamesToday) && typeof value.gamesToday.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.gamesToday.day) && typeof value.gamesToday.count === 'number' && Number.isSafeInteger(value.gamesToday.count) && value.gamesToday.count >= 0
        ? { day: value.gamesToday.day, count: value.gamesToday.count } : defaults.gamesToday,
      // The purchase flow is a stub. A saved dev toggle cannot unlock production content.
      isPremium: __DEV__ && typeof value.isPremium === 'boolean' ? value.isPremium : false,
    };
  } catch {
    return defaults;
  }
}

export function gamesPlayedToday(state: ProgressState, now: number = Date.now()): number {
  return state.gamesToday?.day === localDay(now) ? state.gamesToday.count : 0;
}

export function applyRecordGamePlayed(previous: ProgressState, now: number): ProgressState {
  return { ...previous, gamesToday: { day: localDay(now), count: gamesPlayedToday(previous, now) + 1 } };
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
    lessons: [...recentLessons(previous.lessons, now), {
      day, newWordIds: summary.newWordIds, reviewedCount: summary.reviewedCount,
    }],
    lastLessonDay: day,
    streakDays: distance <= 0 ? previous.streakDays : distance === 1 ? previous.streakDays + 1 : 1,
  };
}

const StateContext = createContext<ProgressSnapshot | null>(null);
const ActionsContext = createContext<ProgressActions | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const stateRef = useRef(state);
  const readyRef = useRef(false);
  const loadFailed = useRef(false);
  const loading = useRef(false);
  const saveFailed = useRef(false);
  const pendingAfterLoadFailure = useRef<ProgressUpdate[]>([]);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  const mounted = useRef(true);

  const flush = useCallback((force = false, retry = false) => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!readyRef.current || loadFailed.current || saveFailed.current || (!dirty.current && !force)) return;
    const serialized = JSON.stringify(stateRef.current);
    dirty.current = false;
    writeQueue.current = writeQueue.current.then(async () => {
      if (saveFailed.current) return false;
      await AsyncStorage.setItem(STORAGE_KEY, serialized);
      return true;
    }).then((wrote) => {
      if (retry && wrote && mounted.current) setStorageError(false);
    })
      .catch((error: unknown) => {
        dirty.current = true;
        saveFailed.current = true;
        if (mounted.current) setStorageError(true);
        if (__DEV__) console.warn('Could not save progress.', error);
      });
  }, []);

  const scheduleWrite = useCallback(() => {
    dirty.current = true;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => flush(), WRITE_DELAY_MS);
  }, [flush]);

  const load = useCallback(async (retry: boolean) => {
    if (loading.current) return;
    loading.current = true;
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!mounted.current) return;
      let loaded = parseProgress(stored);
      if (retry && loadFailed.current) {
        for (const update of pendingAfterLoadFailure.current) loaded = update(loaded);
        pendingAfterLoadFailure.current = [];
      }
      stateRef.current = loaded;
      setState(loaded);
      loadFailed.current = false;
      setStorageError(false);
      readyRef.current = true;
      setReady(true);
      // Persist bounded history and any changes made while the first load was unavailable.
      scheduleWrite();
    } catch (error) {
      if (!mounted.current) return;
      loadFailed.current = true;
      setStorageError(true);
      readyRef.current = true;
      setReady(true);
      if (__DEV__) console.warn('Could not load progress; saving is disabled until retry.', error);
    } finally {
      loading.current = false;
    }
  }, [scheduleWrite]);

  useEffect(() => {
    mounted.current = true;
    void Promise.resolve().then(() => load(false));
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'background' || status === 'inactive') flush();
    });
    return () => {
      flush();
      mounted.current = false;
      subscription.remove();
    };
  }, [flush, load]);

  const update = useCallback((change: ProgressUpdate) => {
    if (!readyRef.current) return;
    if (loadFailed.current) pendingAfterLoadFailure.current.push(change);
    const next = change(stateRef.current);
    stateRef.current = next;
    setState(next);
    scheduleWrite();
  }, [scheduleWrite]);

  const setChildName = useCallback<ProgressApi['setChildName']>((name) => {
    update((previous) => ({ ...previous, childName: name.trim() }));
  }, [update]);
  const recordAnswer = useCallback<ProgressApi['recordAnswer']>((wordId, correct) => {
    const now = Date.now();
    update((previous) => applyRecordAnswer(previous, wordId, correct, now));
  }, [update]);
  const completeLesson = useCallback<ProgressApi['completeLesson']>((summary) => {
    const now = Date.now();
    update((previous) => applyCompleteLesson(previous, summary, now));
  }, [update]);
  const recordGamePlayed = useCallback<ProgressApi['recordGamePlayed']>(() => {
    const now = Date.now();
    update((previous) => applyRecordGamePlayed(previous, now));
  }, [update]);
  const setPremium = useCallback<ProgressApi['setPremium']>((value) => {
    update((previous) => ({ ...previous, isPremium: __DEV__ ? value : false }));
  }, [update]);
  const reset = useCallback<ProgressApi['reset']>(() => update(() => defaultProgress()), [update]);
  const retryStorage = useCallback<ProgressApi['retryStorage']>(() => {
    if (loadFailed.current) {
      void load(true);
    } else if (saveFailed.current) {
      saveFailed.current = false;
      flush(true, true);
    }
  }, [flush, load]);

  const actions = useMemo<ProgressActions>(() => ({
    setChildName, recordAnswer, completeLesson, recordGamePlayed, setPremium, reset, retryStorage,
  }), [setChildName, recordAnswer, completeLesson, recordGamePlayed, setPremium, reset, retryStorage]);
  const snapshot = useMemo<ProgressSnapshot>(() => ({ state, ready, storageError }), [state, ready, storageError]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={snapshot}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

export function useProgressState(): ProgressSnapshot {
  const context = useContext(StateContext);
  if (!context) throw new Error('useProgressState must be used within ProgressProvider');
  return context;
}

export function useProgressActions(): ProgressActions {
  const context = useContext(ActionsContext);
  if (!context) throw new Error('useProgressActions must be used within ProgressProvider');
  return context;
}

export function useProgress(): ProgressApi {
  return { ...useProgressState(), ...useProgressActions() };
}
