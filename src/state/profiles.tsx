import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, View } from 'react-native';
import { ACTIVE_PACK, PACKS } from '@/content/packs';
import { canAddProfile, MAX_PROFILES } from '@/lib/entitlements';
import { releaseSplash } from '@/lib/splash';
import { deleteChildVoiceFiles, voiceKey } from '@/lib/voiceFiles';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export const PROFILES_KEY = 'littleroots.profiles.v1';
export const LEGACY_PROGRESS_KEY = 'littleroots.progress.v1';
export const LEGACY_LETTERS_KEY = 'littleroots.letters.v1';
/** Per child and per language pack (AI_DECISIONS 2026-11-03 "Per-language progress"). */
export const progressKey = (id: string, packId: string = ACTIVE_PACK.id) => `${LEGACY_PROGRESS_KEY}.${id}.${packId}`;
export const lettersKey = (id: string, packId: string = ACTIVE_PACK.id) => `${LEGACY_LETTERS_KEY}.${id}.${packId}`;
/** Per-child keys from before language packs; everything saved under them is Armenian. */
export const unscopedProgressKey = (id: string) => `${LEGACY_PROGRESS_KEY}.${id}`;
export const unscopedLettersKey = (id: string) => `${LEGACY_LETTERS_KEY}.${id}`;
const FIRST_PACK_ID = 'hy';
export const AVATAR_WORD_IDS = ['family.child', 'family.sister', 'family.brother', 'animals.cat', 'animals.rabbit', 'animals.bear'] as const;
export type AvatarWordId = (typeof AVATAR_WORD_IDS)[number];
export interface ChildProfile { id: string; name: string; avatarWordId: AvatarWordId }
interface ProfileData { profiles: ChildProfile[]; activeId: string | null; isPremium: boolean; pendingDeletes: string[] }
const empty: ProfileData = { profiles: [], activeId: null, isPremium: false, pendingDeletes: [] };
const validAvatar = (value: unknown): value is AvatarWordId => AVATAR_WORD_IDS.some((id) => id === value);
const makeId = () => `child-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

/** A present but corrupt profile record must never be treated as a new family. */
export function parseProfiles(raw: string | null): ProfileData {
  if (raw === null) return empty;
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || !Array.isArray(value.profiles)) throw new Error('Invalid profile record');
  const seen = new Set<string>();
  const profiles: ChildProfile[] = [];
  for (const candidate of value.profiles) {
    if (!isRecord(candidate) || typeof candidate.id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(candidate.id) || seen.has(candidate.id)) throw new Error('Invalid child profile');
    seen.add(candidate.id);
    if (profiles.length >= MAX_PROFILES) { if (__DEV__) console.warn('Profile record exceeds the child limit.'); continue; }
    profiles.push({ id: candidate.id, name: typeof candidate.name === 'string' ? candidate.name.trim() || 'Friend' : 'Friend', avatarWordId: validAvatar(candidate.avatarWordId) ? candidate.avatarWordId : 'family.child' });
  }
  const pendingDeletes = Array.isArray(value.pendingDeletes) ? value.pendingDeletes.filter((id): id is string => typeof id === 'string' && /^[a-zA-Z0-9-]+$/.test(id) && !seen.has(id)) : [];
  const isPremium = __DEV__ && value.isPremium === true;
  return { profiles, activeId: profiles.some((p, index) => p.id === value.activeId && (isPremium || index === 0)) ? value.activeId as string : profiles[0]?.id ?? null,
    isPremium, pendingDeletes };
}

async function removeLegacyKeys(): Promise<void> {
  await Promise.allSettled([AsyncStorage.removeItem(LEGACY_PROGRESS_KEY), AsyncStorage.removeItem(LEGACY_LETTERS_KEY)]);
}
/** Every key a child's data can live under, in all shipped languages. */
function childKeys(id: string): string[] {
  return [unscopedProgressKey(id), unscopedLettersKey(id), ...PACKS.flatMap((pack) => [progressKey(id, pack.id), lettersKey(id, pack.id), voiceKey(id, pack.id)])];
}
async function removeChildData(id: string): Promise<void> {
  for (const key of childKeys(id)) await AsyncStorage.removeItem(key);
  deleteChildVoiceFiles(id); // Family voice recordings (AI_DECISIONS 2026-11-04).
}
/**
 * Moves a pre-pack per-child record to its Armenian key. Copy first, remove after, so a crash in between only
 * leaves an identical copy. If the per-language key already holds something else, the old record is never
 * deleted (it is kept until the child is removed). Storage errors propagate so the app shows the retry screen
 * instead of starting this child from empty progress.
 */
async function moveToPackKey(from: string, to: string): Promise<void> {
  const old = await AsyncStorage.getItem(from);
  if (old === null) return;
  const current = await AsyncStorage.getItem(to);
  if (current === null) await AsyncStorage.setItem(to, old);
  else if (current !== old) { if (__DEV__) console.warn(`Kept ${from}: ${to} already holds different data.`); return; }
  // The data is safe under `to` now: a failed cleanup must not keep the family on the retry screen.
  // The next load sees an identical copy and tries the removal again.
  try { await AsyncStorage.removeItem(from); } catch (error) { if (__DEV__) console.warn(`Could not remove ${from}; retrying next load.`, error); }
}
async function migrateToPackKeys(data: ProfileData): Promise<void> {
  for (const { id } of data.profiles) {
    await moveToPackKey(unscopedProgressKey(id), progressKey(id, FIRST_PACK_ID));
    await moveToPackKey(unscopedLettersKey(id), lettersKey(id, FIRST_PACK_ID));
  }
}
async function purgePendingDeletes(data: ProfileData): Promise<ProfileData> {
  if (!data.pendingDeletes.length) return data;
  for (const id of data.pendingDeletes) await removeChildData(id);
  const clean = { ...data, pendingDeletes: [] };
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(clean));
  return clean;
}

/** Commit the profile record last; a retry uses child-1 and cannot orphan a second migration copy. */
export async function loadProfiles(): Promise<ProfileData> {
  const existing = await AsyncStorage.getItem(PROFILES_KEY);
  if (existing !== null) {
    const data = await purgePendingDeletes(parseProfiles(existing));
    await migrateToPackKeys(data);
    await removeLegacyKeys();
    return data;
  }
  const [oldProgress, oldLetters] = await Promise.all([
    AsyncStorage.getItem(LEGACY_PROGRESS_KEY), AsyncStorage.getItem(LEGACY_LETTERS_KEY),
  ]);
  if (oldProgress === null && oldLetters === null) return empty;
  let legacy: Record<string, unknown> | null = null;
  try { const parsed: unknown = oldProgress === null ? null : JSON.parse(oldProgress); if (isRecord(parsed)) legacy = parsed; } catch { /* Preserve malformed raw progress for the existing parser. */ }
  const id = 'child-1';
  // A legacy save may have no name; the child still needs a usable first profile.
  const name = typeof legacy?.childName === 'string' ? legacy.childName.trim() || 'Friend' : 'Friend';
  const next: ProfileData = { profiles: [{ id, name, avatarWordId: 'family.child' }], activeId: id,
    isPremium: __DEV__ && legacy?.isPremium === true, pendingDeletes: [] };
  if (oldProgress !== null) {
    const profileProgress = legacy ? JSON.stringify({ ...legacy, childName: undefined, isPremium: undefined }) : oldProgress;
    await AsyncStorage.setItem(progressKey(id, FIRST_PACK_ID), profileProgress);
  }
  if (oldLetters !== null) await AsyncStorage.setItem(lettersKey(id, FIRST_PACK_ID), oldLetters);
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(next));
  await removeLegacyKeys();
  return next;
}

interface ProfilesApi extends ProfileData {
  active: ChildProfile | null;
  ready: boolean;
  error: boolean;
  add(name: string, avatarWordId: AvatarWordId, options?: { activate?: boolean }): Promise<boolean>;
  rename(id: string, name: string, avatarWordId?: AvatarWordId): Promise<void>;
  remove(id: string): Promise<void>;
  switchTo(id: string): Promise<void>;
  setPremium(value: boolean): Promise<void>;
  mayWrite(id: string): boolean;
  registerFlush(kind: 'progress' | 'letters', flush: () => Promise<void>): () => void;
}
const Context = createContext<ProfilesApi | null>(null);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProfileData>(empty);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mounted = useRef(true);
  const dataRef = useRef(data);
  const mutationQueue = useRef<Promise<void>>(Promise.resolve());
  const flushers = useRef(new Map<string, () => Promise<void>>());
  const deletingIds = useRef(new Set<string>());
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const reload = useCallback(async () => {
    await mutationQueue.current;
    try { const loaded = await loadProfiles(); dataRef.current = loaded; if (mounted.current) { setData(loaded); setLoadError(false); setError(false); setReady(true); } }
    catch { if (mounted.current) { setLoadError(true); setError(true); setReady(true); } }
  }, []);
  useEffect(() => { void Promise.resolve().then(reload); }, [reload]);
  useEffect(() => { if (loadError) releaseSplash(); }, [loadError]);
  const enqueue = useCallback(<T,>(step: () => Promise<T>): Promise<T> => {
    const result = mutationQueue.current.then(step);
    mutationQueue.current = result.then(() => {}, () => {});
    return result;
  }, []);
  const persist = useCallback(async (next: ProfileData) => {
    try { await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(next)); dataRef.current = next; if (mounted.current) { setData(next); setError(false); } }
    catch (cause) { if (mounted.current) setError(true); throw cause; }
  }, []);
  const flushAll = useCallback(async () => { await Promise.all([...flushers.current.values()].map((flush) => flush())); }, []);
  const registerFlush = useCallback((kind: 'progress' | 'letters', flush: () => Promise<void>) => {
    flushers.current.set(kind, flush);
    return () => { if (flushers.current.get(kind) === flush) flushers.current.delete(kind); };
  }, []);
  const mayWrite = useCallback((id: string) => dataRef.current.profiles.some((p) => p.id === id) && !dataRef.current.pendingDeletes.includes(id) && !deletingIds.current.has(id), []);
  const switchTo = useCallback((id: string) => enqueue(async () => {
    await flushAll();
    const current = dataRef.current;
    if (id === current.activeId || !current.profiles.some((p, index) => p.id === id && (current.isPremium || index === 0))) return;
    await persist({ ...current, activeId: id });
  }), [enqueue, flushAll, persist]);
  const add = useCallback((name: string, avatarWordId: AvatarWordId, options?: { activate?: boolean }) => enqueue(async () => {
    await flushAll();
    const current = dataRef.current;
    if (!canAddProfile(current.isPremium, current.profiles.length)) return false;
    const profile = { id: makeId(), name: name.trim() || 'Friend', avatarWordId };
    const activate = options?.activate ?? true;
    await persist({ ...current, profiles: [...current.profiles, profile], activeId: activate || !current.activeId ? profile.id : current.activeId });
    return true;
  }), [enqueue, flushAll, persist]);
  const rename = useCallback((id: string, name: string, avatarWordId?: AvatarWordId) => enqueue(async () => {
    await flushAll();
    const current = dataRef.current;
    if (!current.profiles.some((p) => p.id === id)) return;
    await persist({ ...current, profiles: current.profiles.map((p) => p.id === id ? { ...p, name: name.trim() || 'Friend', avatarWordId: avatarWordId ?? p.avatarWordId } : p) });
  }), [enqueue, flushAll, persist]);
  const remove = useCallback((id: string) => enqueue(async () => {
    const before = dataRef.current;
    if (before.profiles.length <= 1 || !before.profiles.some((p) => p.id === id)) return;
    deletingIds.current.add(id);
    let committed = false;
    try {
      await flushAll(); // Existing queued writes settle, but this child's new writes are suppressed.
      const current = dataRef.current;
      if (current.profiles.length <= 1 || !current.profiles.some((p) => p.id === id)) return;
      const profiles = current.profiles.filter((p) => p.id !== id);
      const withPending = { ...current, profiles, activeId: current.activeId === id ? profiles[0].id : current.activeId,
        pendingDeletes: [...current.pendingDeletes, id] };
      await persist(withPending);
      committed = true;
      await removeChildData(id);
      await persist({ ...withPending, pendingDeletes: withPending.pendingDeletes.filter((pending) => pending !== id) });
    } finally {
      if (!committed || !dataRef.current.pendingDeletes.includes(id)) deletingIds.current.delete(id);
    }
  }), [enqueue, flushAll, persist]);
  const setPremium = useCallback((value: boolean) => enqueue(async () => {
    await flushAll();
    const current = dataRef.current;
    const isPremium = __DEV__ && value;
    await persist({ ...current, isPremium, activeId: isPremium ? current.activeId : current.profiles[0]?.id ?? null });
  }), [enqueue, flushAll, persist]);
  const api = useMemo<ProfilesApi>(() => ({ ...data, active: data.profiles.find((p) => p.id === data.activeId) ?? null,
    ready, error, add, rename, remove, switchTo, setPremium, mayWrite, registerFlush }), [data, ready, error, add, rename, remove, switchTo, setPremium, mayWrite, registerFlush]);
  return <Context.Provider value={api}>{loadError ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text>Could not load family data.</Text><Pressable accessibilityRole="button" accessibilityLabel="Try again" onPress={() => void reload()}><Text>Try again</Text></Pressable></View> : ready ? children : null}</Context.Provider>;
}
export function useProfiles(): ProfilesApi {
  const context = useContext(Context);
  if (!context) throw new Error('useProfiles must be used within ProfilesProvider');
  return context;
}
export function useOptionalProfiles(): ProfilesApi | null { return useContext(Context); }
