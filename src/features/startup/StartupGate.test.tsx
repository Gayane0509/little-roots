import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { StartupGate } from './StartupGate';

// DOM stand-ins so the gate can render under react-dom.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return {
    StyleSheet: { create: (styles: unknown) => styles },
    View: ({ testID }: { testID?: string }) => React.createElement('div', { 'data-testid': testID }),
  };
});
const mockState = { settingsReady: false, progressReady: false, released: false, fontLoaded: true, fontError: null as Error | null };
jest.mock('expo-font', () => ({ useFonts: () => [mockState.fontLoaded, mockState.fontError] }));
jest.mock('@/ui/letterFont', () => ({ LETTER_FONTS: {} }));
jest.mock('@/state/settings', () => ({ useSettings: () => ({ ready: mockState.settingsReady }) }));
jest.mock('@/state/progress', () => ({ useProgress: () => ({ ready: mockState.progressReady }) }));
jest.mock('@/lib/splash', () => ({
  isSplashReleased: () => mockState.released,
  releaseSplash: jest.fn(() => { mockState.released = true; }),
}));
const splash = jest.requireMock('@/lib/splash') as { releaseSplash: jest.Mock };

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function render() {
  if (!root) {
    const element = document.createElement('div'); document.body.appendChild(element);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
    root = createRoot(element);
  }
  await act(async () => { root?.render(<StartupGate><p>screens</p></StartupGate>); });
}
const blank = () => document.querySelector('[data-testid="startup-blank"]');

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  Object.assign(mockState, { settingsReady: false, progressReady: false, released: false, fontLoaded: true, fontError: null });
  splash.releaseSplash.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

test('first launch: screens wait for settings and progress, then the splash hides', async () => {
  await render();
  expect(blank()).not.toBeNull();
  expect(document.body.textContent).not.toContain('screens');
  mockState.progressReady = true;
  await render();
  expect(blank()).not.toBeNull();
  expect(splash.releaseSplash).not.toHaveBeenCalled();
  mockState.settingsReady = true;
  await render();
  expect(blank()).toBeNull();
  expect(document.body.textContent).toContain('screens');
  expect(splash.releaseSplash).toHaveBeenCalledTimes(1);
});
test('after the splash is gone (profile switch), screens render while progress loads', async () => {
  Object.assign(mockState, { settingsReady: true, released: true });
  await render();
  expect(blank()).toBeNull();
  expect(document.body.textContent).toContain('screens');
});
test('first launch also waits for the letter font (#127); a font that fails to load does not block', async () => {
  Object.assign(mockState, { settingsReady: true, progressReady: true, fontLoaded: false });
  await render();
  expect(blank()).not.toBeNull();
  expect(splash.releaseSplash).not.toHaveBeenCalled();
  mockState.fontError = new Error('font failed');
  await render();
  expect(blank()).toBeNull();
  expect(splash.releaseSplash).toHaveBeenCalledTimes(1);
});
