import { act, useEffect, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import * as FileSystem from 'expo-file-system';

import { voiceFile, voiceKey } from '@/lib/voiceFiles';
import { FamilyVoiceProvider, parseVoiceIndex, useFamilyVoice } from './familyVoice';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return { __esModule: true, store, default: {
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => { store.set(key, value); }),
  } };
});
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({ play: jest.fn(), remove: jest.fn(), addListener: jest.fn(() => ({ remove: jest.fn() })) })),
}));

const storage = jest.requireMock('@react-native-async-storage/async-storage') as { store: Map<string, string> };
// The root manual mock (`__mocks__/expo-file-system.ts`); the same instance the provider uses.
const fs = FileSystem as unknown as { files: Set<string>; folders: Set<string> };
const audio = jest.requireMock('expo-audio') as { createAudioPlayer: jest.Mock };
type Api = ReturnType<typeof useFamilyVoice>;
let api: Api;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;

function Probe() {
  const current = useFamilyVoice();
  useEffect(() => { api = current; }, [current]);
  return null;
}
async function mount(childId = 'child-1') {
  const element = document.createElement('div');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<FamilyVoiceProvider childId={childId}><Probe /></FamilyVoiceProvider>); });
  await act(async () => { await Promise.resolve(); });
}
const index = (childId = 'child-1') => JSON.parse(storage.store.get(voiceKey(childId)) ?? '{}') as Record<string, string>;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.clear(); fs.files.clear(); fs.folders.clear(); audio.createAudioPlayer.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; });

test('a saved recording is copied into the child folder, indexed per child and language, and playable', async () => {
  await mount();
  fs.files.add('file:///tmp/take.m4a');
  await act(async () => { await api.save('family.mom', 'file:///tmp/take.m4a'); });
  const name = index()['family.mom'];
  expect(name).toMatch(/^hy-family_mom-\d+\.m4a$/);
  expect(fs.files.has(voiceFile('child-1', name).uri)).toBe(true);
  expect(fs.files.has('file:///tmp/take.m4a')).toBe(false);
  expect(api.uris['family.mom']).toBe(voiceFile('child-1', name).uri);
  expect(api.play('family.mom')).toBe(true);
  expect(audio.createAudioPlayer).toHaveBeenCalledWith({ uri: voiceFile('child-1', name).uri });
});
test('words without a recording do not play (they stay text and pictures)', async () => {
  await mount();
  expect(api.play('family.dad')).toBe(false);
  expect(audio.createAudioPlayer).not.toHaveBeenCalled();
});
test('re-recording replaces the old file; deleting removes the file and the index entry', async () => {
  await mount();
  fs.files.add('file:///tmp/one.m4a');
  await act(async () => { await api.save('family.mom', 'file:///tmp/one.m4a'); });
  const first = index()['family.mom'];
  jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);
  fs.files.add('file:///tmp/two.m4a');
  await act(async () => { await api.save('family.mom', 'file:///tmp/two.m4a'); });
  const second = index()['family.mom'];
  expect(second).not.toBe(first);
  expect(fs.files.has(voiceFile('child-1', first).uri)).toBe(false);
  await act(async () => { await api.remove('family.mom'); });
  expect(index()).toEqual({});
  expect(fs.files.has(voiceFile('child-1', second).uri)).toBe(false);
  expect(api.uris['family.mom']).toBeUndefined();
});
test('recordings belong to one child: another child sees none', async () => {
  storage.store.set(voiceKey('child-1'), JSON.stringify({ 'family.mom': 'hy-family_mom-1.m4a' }));
  fs.files.add(voiceFile('child-1', 'hy-family_mom-1.m4a').uri);
  await mount('child-2');
  expect(api.uris).toEqual({});
});
test('loading drops entries whose file is gone', async () => {
  storage.store.set(voiceKey('child-1'), JSON.stringify({ 'family.mom': 'hy-family_mom-1.m4a', 'family.dad': 'hy-family_dad-1.m4a' }));
  fs.files.add(voiceFile('child-1', 'hy-family_mom-1.m4a').uri);
  await mount();
  expect(Object.keys(api.uris)).toEqual(['family.mom']);
});
test('a stored name is never followed as a path', () => {
  expect(parseVoiceIndex(JSON.stringify({ a: '../../secret', b: 'x/y.m4a', c: 'hy-ok-1.m4a', d: 3 }))).toEqual({ c: 'hy-ok-1.m4a' });
  expect(parseVoiceIndex(null)).toEqual({});
  expect(() => parseVoiceIndex('[]')).toThrow();
});
