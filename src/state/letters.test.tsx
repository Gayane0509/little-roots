import { act, useEffect, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { LettersProvider, useTracedLetters } from './letters';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = { value: null as string | null, failRead: 0, failWrite: false, pendingRead: null as null | (() => void) };
  return { __esModule: true, store, default: {
    getItem: jest.fn(async () => {
      if (store.pendingRead) await new Promise<void>((resolve) => { store.pendingRead = resolve; });
      if (store.failRead-- > 0) throw new Error('read failed');
      return store.value;
    }),
    setItem: jest.fn(async (_key: string, value: string) => {
      if (store.failWrite) throw new Error('write failed');
      store.value = value;
    }),
  } };
});
const storage = jest.requireMock('@react-native-async-storage/async-storage') as {
  store: { value: string | null; failRead: number; failWrite: boolean; pendingRead: null | (() => void) };
  default: { setItem: jest.Mock };
};
let api: ReturnType<typeof useTracedLetters>;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;
function Probe() { const value = useTracedLetters(); useEffect(() => { api = value; }, [value]); return null; }
async function mount() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<LettersProvider><Probe /></LettersProvider>); });
}
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.value = null; storage.store.failRead = 0; storage.store.failWrite = false; storage.store.pendingRead = null;
  storage.default.setItem.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });
test('loads valid letters and ignores corrupt values', async () => {
  storage.store.value = JSON.stringify(['Ա', 'bogus']); await mount();
  expect([...api.traced]).toEqual(['Ա']);
});
test('corrupt JSON starts empty and can save a new letter', async () => {
  storage.store.value = '{bad'; await mount();
  await act(async () => api.markTraced('Բ'));
  expect(JSON.parse(storage.store.value!)).toEqual(['Բ']);
});
test('a mark before load merges with saved letters', async () => {
  storage.store.value = JSON.stringify(['Ա']); storage.store.pendingRead = () => {};
  await mount();
  await act(async () => api.markTraced('Բ'));
  await act(async () => { storage.store.pendingRead?.(); await Promise.resolve(); });
  expect([...api.traced]).toEqual(['Ա', 'Բ']);
  expect(JSON.parse(storage.store.value!)).toEqual(['Ա', 'Բ']);
});
test('a failed read retries; two failed reads do not overwrite storage', async () => {
  storage.store.failRead = 2; await mount();
  await act(async () => api.markTraced('Ա'));
  expect(storage.default.setItem).not.toHaveBeenCalled();
});
test('a write failure keeps the traced letter in memory', async () => {
  await mount(); storage.store.failWrite = true;
  await act(async () => api.markTraced('Ա'));
  expect(api.traced.has('Ա')).toBe(true);
  expect(api.saveError).toBe(true);
  storage.store.failWrite = false;
  await act(async () => api.markTraced('Բ'));
  expect(api.saveError).toBe(false);
  expect(JSON.parse(storage.store.value!)).toEqual(['Ա', 'Բ']);
});
test('reset clears the active child’s traced letters', async () => {
  storage.store.value = JSON.stringify(['Ա']); await mount();
  await act(async () => api.resetTraced());
  expect([...api.traced]).toEqual([]);
  expect(JSON.parse(storage.store.value!)).toEqual([]);
});
