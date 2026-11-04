import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { File } from 'expo-file-system';

import { ACTIVE_PACK } from '@/content/packs';
import { childVoiceFolder, isVoiceFileName, newVoiceFileName, voiceFile, voiceKey } from '@/lib/voiceFiles';

/**
 * Family voice (AI_DECISIONS 2026-11-04): a grown-up's recordings of the app's words, per child and language,
 * kept only on this device. The index maps word id → file name in the child's voice folder. On the web preview
 * recordings are blob URLs that last until the page reloads (the web build is not shipped).
 */
export { voiceKey };

type FamilyVoiceApi = {
  ready: boolean;
  loadError: boolean;
  /** Word id → playable URI, only for words with a recording. */
  uris: Record<string, string>;
  save(wordId: string, recordedUri: string): Promise<void>;
  remove(wordId: string): Promise<void>;
  /** Plays the word's recording; false when there is none (the word stays text and picture only). */
  play(wordId: string): boolean;
  stop(): void;
};

const unavailable: FamilyVoiceApi = {
  ready: false, loadError: false, uris: {}, play: () => false, stop: () => {},
  save: async () => { throw new Error('FamilyVoiceProvider is not mounted'); },
  remove: async () => { throw new Error('FamilyVoiceProvider is not mounted'); },
};
const Context = createContext<FamilyVoiceApi | null>(null);

type Player = ReturnType<typeof createAudioPlayer>;
let current: { player: Player; subscription: { remove(): void } } | null = null;

export function stopFamilyVoice(): void {
  if (!current) return;
  const { player, subscription } = current;
  current = null;
  subscription.remove();
  try { player.remove(); } catch { /* Already released. */ }
}

/** Parses a stored index; anything that isn't a generated file name is dropped, never followed as a path. */
export function parseVoiceIndex(raw: string | null): Record<string, string> {
  if (raw === null) return {};
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid voice index');
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && isVoiceFileName(entry[1])));
}

const native = () => Platform.OS !== 'web';

export function FamilyVoiceProvider({ childId, children }: { childId: string | null; children: ReactNode }) {
  const [names, setNames] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const namesRef = useRef(names);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!childId || !native()) { void Promise.resolve().then(() => { if (mounted.current) setReady(true); }); return () => { mounted.current = false; stopFamilyVoice(); }; }
    void AsyncStorage.getItem(voiceKey(childId)).then((raw) => {
      // Drop entries whose file is gone (for example after an OS storage cleanup).
      const loaded = Object.fromEntries(Object.entries(parseVoiceIndex(raw)).filter(([, name]) => voiceFile(childId, name).exists));
      if (!mounted.current) return;
      namesRef.current = loaded; setNames(loaded); setReady(true);
    }).catch(() => { if (mounted.current) setLoadError(true); });
    return () => { mounted.current = false; stopFamilyVoice(); };
  }, [childId]);

  /** Serialised index updates; resolves with the index before the change. */
  const update = useCallback((change: (names: Record<string, string>) => Record<string, string>) => {
    const step = queue.current.catch(() => {}).then(async () => {
      const before = namesRef.current;
      const next = change(before);
      if (childId && native()) await AsyncStorage.setItem(voiceKey(childId), JSON.stringify(next));
      namesRef.current = next;
      if (mounted.current) setNames(next);
      return before;
    });
    queue.current = step;
    return step;
  }, [childId]);

  const save = useCallback(async (wordId: string, recordedUri: string) => {
    if (!childId || !ready || loadError) throw new Error('Family voice is not ready');
    if (!native()) { await update((before) => ({ ...before, [wordId]: recordedUri })); return; }
    const recorded = new File(recordedUri);
    const name = newVoiceFileName(ACTIVE_PACK.id, wordId, recorded.extension);
    childVoiceFolder(childId).create({ idempotent: true, intermediates: true });
    const target = voiceFile(childId, name);
    await recorded.copy(target);
    let before: Record<string, string>;
    try { before = await update((names) => ({ ...names, [wordId]: name })); }
    catch (error) { try { target.delete(); } catch { /* Orphan is removed with the child. */ } throw error; }
    const old = before[wordId];
    if (old && old !== name) { try { voiceFile(childId, old).delete(); } catch { /* Orphan is removed with the child. */ } }
    try { if (recorded.exists) recorded.delete(); } catch { /* The saved copy is intact. */ }
  }, [childId, ready, loadError, update]);

  const remove = useCallback(async (wordId: string) => {
    if (!childId || !ready || loadError) throw new Error('Family voice is not ready');
    stopFamilyVoice();
    const before = await update((names) => {
      if (!(wordId in names)) return names;
      const next = { ...names };
      delete next[wordId];
      return next;
    });
    const old = before[wordId];
    if (old && native()) { try { voiceFile(childId, old).delete(); } catch { /* Orphan is removed with the child. */ } }
  }, [childId, ready, loadError, update]);

  const uris = useMemo(() => Object.fromEntries(Object.entries(names).map(([wordId, name]) => [wordId, native() && childId ? voiceFile(childId, name).uri : name])), [names, childId]);

  const play = useCallback((wordId: string) => {
    const uri = uris[wordId];
    if (!uri) return false;
    stopFamilyVoice();
    try {
      const player = createAudioPlayer({ uri });
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish && current?.player === player) stopFamilyVoice();
      });
      current = { player, subscription };
      player.play();
      return true;
    } catch { stopFamilyVoice(); return false; }
  }, [uris]);

  const api = useMemo<FamilyVoiceApi>(() => ({ ready, loadError, uris, save, remove, play, stop: stopFamilyVoice }), [ready, loadError, uris, save, remove, play]);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useFamilyVoice(): FamilyVoiceApi {
  return useContext(Context) ?? unavailable;
}
