import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const KEY = 'littleroots.settings.v1';
type BuddyLanguage = 'en' | 'hy';
type Settings = { soundEffects: boolean; buddyLanguage: BuddyLanguage };
type SettingsApi = Settings & {
  ready: boolean;
  saveError: boolean;
  setSoundEffects(value: boolean): void;
  setBuddyLanguage(value: BuddyLanguage): void;
};
const defaults: Settings = { soundEffects: true, buddyLanguage: 'en' };
const fallback: SettingsApi = { ...defaults, ready: true, saveError: false, setSoundEffects: () => {}, setBuddyLanguage: () => {} };
const Context = createContext<SettingsApi | null>(null);

function parse(raw: string | null): Settings {
  if (!raw) return defaults;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
    const saved = value as Record<string, unknown>;
    return {
      soundEffects: typeof saved.soundEffects === 'boolean' ? saved.soundEffects : true,
      buddyLanguage: saved.buddyLanguage === 'hy' ? 'hy' : 'en',
    };
  } catch { return defaults; }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const dirty = useRef(false);
  const revision = useRef(0);
  const changedBeforeLoad = useRef(false);
  const current = useRef<Settings>(defaults);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY).then(raw => {
      if (!active || changedBeforeLoad.current) return;
      const loaded = parse(raw);
      current.current = loaded;
      setSettings(loaded);
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    if (!ready) changedBeforeLoad.current = true;
    const next = { ...current.current, ...patch };
    current.current = next;
    setSettings(next);
    dirty.current = true;
    revision.current += 1;
    writeQueue.current = writeQueue.current.catch(() => {}).then(async () => {
      if (!dirty.current) return;
      const writing = revision.current;
      await AsyncStorage.setItem(KEY, JSON.stringify(current.current));
      if (revision.current === writing) { dirty.current = false; setSaveError(false); }
    }).catch(() => { dirty.current = true; setSaveError(true); });
    void writeQueue.current.catch(() => {});
  }, [ready]);
  const setSoundEffects = useCallback((value: boolean) => update({ soundEffects: value }), [update]);
  const setBuddyLanguage = useCallback((value: BuddyLanguage) => update({ buddyLanguage: value }), [update]);
  const api = useMemo(() => ({ ...settings, ready, saveError, setSoundEffects, setBuddyLanguage }), [settings, ready, saveError, setSoundEffects, setBuddyLanguage]);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useSettings(): SettingsApi { return useContext(Context) ?? fallback; }
