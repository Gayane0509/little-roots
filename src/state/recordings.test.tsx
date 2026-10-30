import { act, useEffect, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { Word } from '@/content/types';
import { BUNDLED_AUDIO } from '@/content/audio';
import { RecordingsProvider, useRecordings, useSpeakWord, stopWordAudio } from './recordings';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = { value: null as string | null, failNext: false, failRead: false };
  return { __esModule: true, store, default: {
    getItem: jest.fn(async () => { if (store.failRead) throw new Error('read failed'); return store.value; }),
    setItem: jest.fn(async (_key: string, value: string) => {
      if (store.failNext) { store.failNext = false; throw new Error('storage failed'); }
      store.value = value;
    }),
  } };
});
jest.mock('expo-file-system', () => {
  const files = new Set<string>();
  class Directory {
    uri: string;
    constructor(...parts: (string | Directory)[]) { this.uri = parts.map((part) => typeof part === 'string' ? part : part.uri).join('/'); }
    create() {}
  }
  class File {
    uri: string;
    constructor(...parts: (string | Directory | File)[]) { this.uri = parts.map((part) => typeof part === 'string' ? part : part.uri).join('/'); }
    get exists() { return files.has(this.uri); }
    get extension() { return this.uri.match(/\.[^.]+$/)?.[0] ?? ''; }
    async copy(destination: File) { files.add(destination.uri); }
    delete() { files.delete(this.uri); }
  }
  return { files, Directory, File, Paths: { document: 'file:///docs' } };
});
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => ({ play: jest.fn(), remove: jest.fn(), addListener: jest.fn(() => ({ remove: jest.fn() })) })) }));
jest.mock('expo-speech', () => ({ stop: jest.fn(), speak: jest.fn() }));

type Api = ReturnType<typeof useRecordings>;
type Speak = ReturnType<typeof useSpeakWord>;
let api: Api;
let speak: Speak;
let root: { render(children: ReactNode): void; unmount(): void };
const word = { id: 'family.mom', hy: 'մայրիկ' } as Word;
const storage = jest.requireMock('@react-native-async-storage/async-storage') as {
  store: { value: string | null; failNext: boolean; failRead: boolean };
};
const fs = jest.requireMock('expo-file-system') as { files: Set<string> };
const speech = jest.requireMock('expo-speech') as { speak: jest.Mock };
const audio = jest.requireMock('expo-audio') as { createAudioPlayer: jest.Mock };

function Probe() {
  const currentApi = useRecordings();
  const currentSpeak = useSpeakWord();
  useEffect(() => { api = currentApi; speak = currentSpeak; }, [currentApi, currentSpeak]);
  return null;
}

async function mount() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): typeof root };
  root = createRoot(element);
  await act(async () => { root.render(<RecordingsProvider><Probe /></RecordingsProvider>); });
  expect(api.ready).toBe(true);
}

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.value = null;
  storage.store.failNext = false;
  storage.store.failRead = false;
  delete BUNDLED_AUDIO[word.id];
  fs.files.clear();
  speech.speak.mockClear();
  audio.createAudioPlayer.mockClear();
});
afterEach(async () => {
  stopWordAudio();
  if (root) await act(async () => { root.unmount(); });
  document.body.innerHTML = '';
});

describe('family recordings', () => {
  it('blocks writes after a failed index read and retries without overwriting it', async () => {
    storage.store.value = JSON.stringify({ [word.id]: 'existing.m4a' });
    storage.store.failRead = true;
    const element = document.createElement('div'); document.body.appendChild(element);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): typeof root };
    root = createRoot(element);
    await act(async () => { root.render(<RecordingsProvider><Probe /></RecordingsProvider>); });
    expect(api.loadError).toBe(true);
    await expect(api.deleteRecording(word.id)).rejects.toThrow();
    await expect(api.saveRecording(word.id, 'file:///tmp/new.m4a')).rejects.toThrow();
    expect(storage.store.value).toContain('existing.m4a');
    storage.store.failRead = false;
    await act(async () => { await api.retryLoad(); });
    expect(api.ready).toBe(true);
    expect(api.loadError).toBe(false);
  });

  it('preserves a malformed index until it can be repaired', async () => {
    storage.store.value = '{broken';
    const element = document.createElement('div'); document.body.appendChild(element);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): typeof root };
    root = createRoot(element);
    await act(async () => { root.render(<RecordingsProvider><Probe /></RecordingsProvider>); });
    expect(api.loadError).toBe(true);
    await expect(api.deleteRecording(word.id)).rejects.toThrow();
    expect(storage.store.value).toBe('{broken');
  });

  it('prefers family audio, then bundled audio, then device speech', async () => {
    BUNDLED_AUDIO[word.id] = 42;
    await mount();
    await act(async () => { speak(word); });
    expect(audio.createAudioPlayer).toHaveBeenCalledWith(42);
    fs.files.add('file:///tmp/family.m4a');
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/family.m4a'); });
    await act(async () => { speak(word); });
    expect(audio.createAudioPlayer).toHaveBeenLastCalledWith({ uri: api.uris[word.id] });
    await act(async () => { await api.deleteRecording(word.id); });
    delete BUNDLED_AUDIO[word.id];
    await act(async () => { speak(word); });
    expect(speech.speak).toHaveBeenCalled();
  });
  it('copies a recording, persists only its name, replaces and deletes the old file', async () => {
    fs.files.add('file:///tmp/first.m4a');
    await mount();
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/first.m4a'); });
    const first = api.uris[word.id];
    expect(first).toMatch(/^file:\/\/\/docs\/recordings\//);
    expect(JSON.parse(storage.store.value!)[word.id]).toBe(first.split('/').at(-1));
    expect(fs.files.has(first)).toBe(true);
    expect(fs.files.has('file:///tmp/first.m4a')).toBe(false);

    fs.files.add('file:///tmp/second.m4a');
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/second.m4a'); });
    const second = api.uris[word.id];
    expect(second).not.toBe(first);
    expect(fs.files.has(first)).toBe(false);
    expect(fs.files.has(second)).toBe(true);
    await act(async () => { await api.deleteRecording(word.id); });
    expect(api.uris[word.id]).toBeUndefined();
    expect(fs.files.has(second)).toBe(false);
  });

  it('keeps the previous recording when storage rejects a replacement', async () => {
    fs.files.add('file:///tmp/first.m4a');
    await mount();
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/first.m4a'); });
    const first = api.uris[word.id];
    fs.files.add('file:///tmp/second.m4a');
    storage.store.failNext = true;
    await expect(api.saveRecording(word.id, 'file:///tmp/second.m4a')).rejects.toThrow('storage failed');
    expect(api.uris[word.id]).toBe(first);
    expect(fs.files.has(first)).toBe(true);
    expect([...fs.files].filter((uri) => uri.includes('/recordings/'))).toEqual([first]);
  });

  it('keeps the file and entry when storage rejects deletion', async () => {
    fs.files.add('file:///tmp/first.m4a');
    await mount();
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/first.m4a'); });
    const saved = api.uris[word.id];
    storage.store.failNext = true;
    await expect(api.deleteRecording(word.id)).rejects.toThrow('storage failed');
    expect(api.uris[word.id]).toBe(saved);
    expect(fs.files.has(saved)).toBe(true);
  });

  it('uses device speech when a recording is absent or its file is missing', async () => {
    await mount();
    act(() => { speak(word); });
    expect(speech.speak).toHaveBeenCalledWith(word.hy, expect.any(Object));
    fs.files.add('file:///tmp/first.m4a');
    await act(async () => { await api.saveRecording(word.id, 'file:///tmp/first.m4a'); });
    act(() => { speak(word); });
    expect(audio.createAudioPlayer).toHaveBeenCalledTimes(1);
    fs.files.delete(api.uris[word.id]);
    act(() => { speak(word); });
    expect(speech.speak).toHaveBeenCalledTimes(2);
  });

  it('migrates old absolute URIs and prunes missing files on load', async () => {
    fs.files.add('file:///docs/recordings/kept.m4a');
    storage.store.value = JSON.stringify({ [word.id]: 'file:///old/install/kept.m4a', missing: 'file:///old/install/gone.m4a' });
    await mount();
    expect(api.uris).toEqual({ [word.id]: 'file:///docs/recordings/kept.m4a' });
    expect(JSON.parse(storage.store.value!)).toEqual({ [word.id]: 'kept.m4a' });
  });
});
