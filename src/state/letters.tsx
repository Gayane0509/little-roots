import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ALPHABET } from '@/content/alphabet';

const KEY = 'littleroots.letters.v1';
const validLetters = new Set(ALPHABET.map((letter) => letter.upper));
interface LettersValue { traced: Set<string>; markTraced: (letter: string) => void }
const noop = () => {};
const fallback: LettersValue = { traced: new Set(), markTraced: noop };
const Context = createContext<LettersValue>(fallback);

export function LettersProvider({ children }: { children: ReactNode }) {
  const [traced, setTraced] = useState<Set<string>>(() => new Set());
  const current = useRef<Set<string>>(new Set());
  const pending = useRef<Set<string>>(new Set());
  const readable = useRef(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const save = useCallback((next: Set<string>) => {
    queue.current = queue.current.then(() => AsyncStorage.setItem(KEY, JSON.stringify([...next]))).catch(() => {});
  }, []);
  useEffect(() => {
    let active = true;
    const load = async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const raw = await AsyncStorage.getItem(KEY);
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
    void load();
    return () => { active = false; };
  }, [save]);
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
