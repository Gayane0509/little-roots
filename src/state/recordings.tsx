import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import { Directory, File, Paths } from 'expo-file-system';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import type { Word } from '@/content/types';
import { speakArmenian, stopSpeaking } from '@/lib/speech';

const KEY = 'littleroots.recordings.v1';
let recordingSequence = 0;
type RecordingsApi = {
  ready: boolean;
  uris: Record<string, string>;
  saveRecording(wordId: string, tempUri: string): Promise<void>;
  deleteRecording(wordId: string): Promise<void>;
};

const RecordingsContext = createContext<RecordingsApi | null>(null);
const unavailable: RecordingsApi = {
  ready: false, uris: {},
  saveRecording: async () => { throw new Error('RecordingsProvider is not mounted'); },
  deleteRecording: async () => { throw new Error('RecordingsProvider is not mounted'); },
};

type Player = ReturnType<typeof createAudioPlayer>;
let currentPlayer: Player | null = null;
let currentSubscription: { remove(): void } | null = null;

export function stopWordAudio(): void {
  currentSubscription?.remove();
  currentSubscription = null;
  currentPlayer?.remove();
  currentPlayer = null;
}

function fileName(value: string): string | null {
  // Old releases stored absolute file URIs. Keep only the final path component.
  const name = value.split(/[/?#]/).filter(Boolean).at(-1);
  return name && name !== '.' && name !== '..' ? name : null;
}

function fileForName(name: string): File {
  return new File(Paths.document, 'recordings', name);
}

function namesFromStored(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).flatMap(([wordId, stored]) => {
      if (typeof stored !== 'string') return [];
      const name = fileName(stored);
      return name ? [[wordId, name]] : [];
    }));
  } catch { return {}; }
}

function urisFromNames(names: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(names).flatMap(([wordId, name]) => {
    if (Platform.OS === 'web') return [[wordId, name]];
    const file = fileForName(name);
    return file.exists ? [[wordId, file.uri]] : [];
  }));
}

function namesFromUris(uris: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(uris).flatMap(([wordId, uri]) => {
    const name = fileName(uri);
    return name ? [[wordId, name]] : [];
  }));
}

export function RecordingsProvider({ children }: { children: ReactNode }) {
  const [uris, setUris] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const urisRef = useRef(uris);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY).then(async (raw) => {
      const loaded = urisFromNames(namesFromStored(raw));
      if (Platform.OS !== 'web' && raw !== JSON.stringify(namesFromUris(loaded))) {
        // The same write migrates old absolute URIs and prunes missing files.
        await AsyncStorage.setItem(KEY, JSON.stringify(namesFromUris(loaded))).catch(() => {});
      }
      if (active) { urisRef.current = loaded; setUris(loaded); }
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const persist = useCallback((update: (current: Record<string, string>) => Record<string, string>) => {
    let previous: Record<string, string> = {};
    writeQueue.current = writeQueue.current.catch(() => {}).then(async () => {
      previous = urisRef.current;
      const next = update(previous);
      await AsyncStorage.setItem(KEY, JSON.stringify(namesFromUris(next)));
      urisRef.current = next;
      setUris(next);
    });
    return writeQueue.current.then(() => previous);
  }, []);

  const saveRecording = useCallback(async (wordId: string, tempUri: string) => {
    if (!ready || Platform.OS === 'web') throw new Error('Recording storage is unavailable');
    const folder = new Directory(Paths.document, 'recordings');
    folder.create({ idempotent: true, intermediates: true });
    const temp = new File(tempUri);
    const file = new File(folder, `${encodeURIComponent(wordId)}-${Date.now()}-${++recordingSequence}${temp.extension || '.m4a'}`);
    await temp.copy(file);
    let previous: Record<string, string>;
    try { previous = await persist((current) => ({ ...current, [wordId]: file.uri })); }
    catch (error) { if (file.exists) file.delete(); throw error; }
    const old = previous[wordId];
    if (old && old !== file.uri) {
      try { const oldFile = new File(old); if (oldFile.exists) oldFile.delete(); } catch { /* Orphaned file can be cleaned later. */ }
    }
    try { if (temp.exists) temp.delete(); } catch { /* Saved copy is intact. */ }
  }, [persist, ready]);

  const deleteRecording = useCallback(async (wordId: string) => {
    if (!ready) throw new Error('Recordings are not ready');
    const previous = await persist((current) => {
      if (!current[wordId]) return current;
      const next = { ...current };
      delete next[wordId];
      return next;
    });
    const old = previous[wordId];
    if (old && Platform.OS !== 'web') {
      const file = new File(old);
      if (file.exists) file.delete();
    }
  }, [persist, ready]);

  const api = useMemo(() => ({ ready, uris, saveRecording, deleteRecording }), [ready, uris, saveRecording, deleteRecording]);
  return <RecordingsContext.Provider value={api}>{children}</RecordingsContext.Provider>;
}

export function useRecordings(): RecordingsApi {
  return useContext(RecordingsContext) ?? unavailable;
}

export function useSpeakWord(): (word: Word) => void {
  const { uris } = useRecordings();
  useEffect(() => () => stopWordAudio(), []);
  return useCallback((word: Word) => {
    stopWordAudio();
    const uri = uris[word.id];
    if (uri && Platform.OS !== 'web') {
      const file = new File(uri);
      if (file.exists) {
        stopSpeaking();
        try {
          const player = createAudioPlayer({ uri: file.uri });
          currentPlayer = player;
          currentSubscription = player.addListener('playbackStatusUpdate', (status) => {
            if (status.didJustFinish && currentPlayer === player) stopWordAudio();
          });
          player.play();
          return;
        } catch { stopWordAudio(); }
      }
    }
    speakArmenian(word.hy);
  }, [uris]);
}
