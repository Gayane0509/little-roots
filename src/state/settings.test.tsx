import { act, useEffect, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { SettingsProvider, useSettings } from './settings';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = { value: null as string | null, failWrite: false };
  return { __esModule: true, store, default: {
    getItem: jest.fn(async () => store.value),
    setItem: jest.fn(async (_key: string, value: string) => { if (store.failWrite) throw new Error('write failed'); store.value = value; }),
  } };
});
const storage = jest.requireMock('@react-native-async-storage/async-storage') as {
  store: { value: string | null; failWrite: boolean };
  default: { setItem: jest.Mock };
};
let api: ReturnType<typeof useSettings>;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;
function Probe() { const value = useSettings(); useEffect(() => { api = value; }, [value]); return null; }
async function mount() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<SettingsProvider><Probe /></SettingsProvider>); });
}
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.value = null; storage.store.failWrite = false; storage.default.setItem.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

test('defaults are safe when provider is missing', async () => {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<Probe />); });
  expect(api).toMatchObject({ ready: true, soundEffects: true, buddyLanguage: 'en' });
  expect(() => api.setSoundEffects(false)).not.toThrow();
});
test('loads saved family settings', async () => {
  storage.store.value = JSON.stringify({ soundEffects: false, buddyLanguage: 'hy' });
  await mount();
  expect(api).toMatchObject({ ready: true, soundEffects: false, buddyLanguage: 'hy' });
});
test('saves changes together', async () => {
  await mount();
  await act(async () => { api.setSoundEffects(false); api.setBuddyLanguage('hy'); await Promise.resolve(); await Promise.resolve(); });
  expect(JSON.parse(storage.store.value!)).toEqual({ soundEffects: false, buddyLanguage: 'hy' });
});
test('corrupt values use safe defaults', async () => {
  storage.store.value = '{bad'; await mount();
  expect(api).toMatchObject({ ready: true, soundEffects: true, buddyLanguage: 'en' });
});
test('reports failed save and retries latest settings on the next change', async () => {
  await mount(); storage.store.failWrite = true;
  await act(async () => { api.setSoundEffects(false); await Promise.resolve(); await Promise.resolve(); });
  expect(api.saveError).toBe(true);
  storage.store.failWrite = false;
  await act(async () => { api.setBuddyLanguage('hy'); await Promise.resolve(); await Promise.resolve(); });
  expect(api.saveError).toBe(false);
  expect(JSON.parse(storage.store.value!)).toEqual({ soundEffects: false, buddyLanguage: 'hy' });
});
