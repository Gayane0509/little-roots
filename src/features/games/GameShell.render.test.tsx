import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { GameShell } from './GameShell';

// DOM stand-ins so the shell renders under react-dom; the scene is read from the Screen stand-in.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children }: { children?: ReactNode }) => React.createElement('div', null, children);
  return { StyleSheet: { create: (styles: unknown) => styles }, View, ScrollView: View, ActivityIndicator: () => null };
});
jest.mock('@/ui/Screen', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return { Screen: ({ children, scene }: { children?: ReactNode; scene?: string }) => React.createElement('div', { 'data-testid': 'screen', 'data-scene': scene ?? '' }, children) };
});
jest.mock('@/ui/IconTitle', () => ({ IconTitle: () => null }));
jest.mock('@/ui/Buddy', () => ({ Buddy: () => null }));
jest.mock('@/ui/BigButton', () => ({ BigButton: () => null }));
jest.mock('@/features/buddy/useBuddyLine', () => ({ useBuddyLine: () => () => '' }));
jest.mock('@/lib/navigation', () => ({ goBackOrHome: jest.fn() }));
jest.mock('@/lib/entitlements', () => ({ canPlayGame: () => true }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn() } }));
jest.mock('@/state/progress', () => ({
  useProgressState: () => ({ ready: true, state: { lessons: [{}], words: {}, isPremium: false } }),
  useProgressActions: () => ({ recordGamePlayed: () => undefined }),
  gamesPlayedToday: () => 0,
}));
jest.mock('./logic', () => ({ MIN_SEEN_WORDS: 1, pickSeenWords: () => [{ id: 'family.mom' }] }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
let report: ((finished: boolean) => void) | null = null;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; report = null; });

const scene = () => document.querySelector('[data-testid="screen"]')?.getAttribute('data-scene');

test('the celebration scene shows only while the game reports its finish screen', async () => {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => {
    root?.render(<GameShell title="Find" icon="find">{(_words, onFinishedChange) => { report = onFinishedChange; return null; }}</GameShell>);
  });
  expect(scene()).toBe('');
  await act(async () => { report?.(true); });
  expect(scene()).toBe('hills');
  await act(async () => { report?.(false); });
  expect(scene()).toBe('');
});
