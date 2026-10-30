import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { lettersKey, useOptionalProfiles } from './profiles';
import { ALPHABET } from '@/content/alphabet';

const KEY = 'littleroots.letters.v1';
const validLetters = new Set(ALPHABET.map((letter) => letter.upper));
interface LettersValue { traced: Set<string>; markTraced: (letter: string) => void }
const noop = () => {};
const fallback: LettersValue = { traced: new Set(), markTraced: noop };
const Context = createContext<LettersValue>(fallback);

export function LettersProvider({ children }: { children: ReactNode }) {
  const profiles = useOptionalProfiles();
  const key = profiles?.activeId ? lettersKey(profiles.activeId) : KEY;
  const [traced, setTraced] = useState<Set<string>>(() => new Set());
  const current = useRef<Set<string>>(new Set());
  const pending = useRef<Set<string>>(new Set());
  const readable = useRef(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const loadPromise = useRef<Promise<void>>(Promise.resolve());
  const retryLoad = useRef<() => Promise<void>>(async () => {});
  const mayWrite = profiles?.mayWrite;
  const profileId = profiles?.activeId;
  const save = useCallback((next: Set<string>) => {
    if (profileId && !mayWrite?.(profileId)) return;
    queue.current = queue.current.catch(() => {}).then(() => AsyncStorage.setItem(key, JSON.stringify([...next])));
    void queue.current.catch(() => {});
  }, [key, profileId, mayWrite]);
  const registerFlush = profiles?.registerFlush;
  useEffect(() => registerFlush?.('letters', async () => {
    await loadPromise.current;
    if (profileId && !mayWrite?.(profileId)) { await queue.current.catch(() => {}); return; }
    if (!readable.current && pending.current.size) await retryLoad.current();
    if (!readable.current && pending.current.size) throw new Error('Letters are not loaded');
    await queue.current;
  }), [registerFlush, profileId, mayWrite]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const raw = await AsyncStorage.getItem(key);
          if (!active) return;
          let parsed: unknown;
          try { parsed = raw ? JSON.parse(raw) : []; } catch { parsed = []; }
          const saved = Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === 'string' && validLetters.has(key)) : [];
          const next = new Set([...saved, ...pending.current]);
          current.current = next;
          setTraced(next);
          readable.current = true;
          if (pending.current.size) { pending.current.clear(); save(next); }
          return;
        } catch { /* Retry one failed read; never overwrite unknown stored data. */ }
      }
    };
    retryLoad.current = load;
    loadPromise.current = load();
    return () => { active = false; };
  }, [save, key]);
  const markTraced = useCallback((letter: string) => {
    if (!validLetters.has(letter) || current.current.has(letter)) return;
    const next = new Set(current.current).add(letter);
    current.current = next;
    setTraced(next);
    if (readable.current) save(next);
    else pending.current.add(letter);
  }, [save]);
  const value = useMemo(() => ({ traced, markTraced }), [traced, markTraced]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTracedLetters(): LettersValue { return useContext(Context); }
