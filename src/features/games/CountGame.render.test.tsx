import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { getWord } from '@/content/packs';
import type { Word } from '@/content/types';

import { CountGame } from './CountGame';

// DOM stand-ins so the game renders under react-dom: Pressable is a button carrying its accessibility label.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children }: { children?: ReactNode }) => React.createElement('div', null, children);
  const Text = ({ children }: { children?: ReactNode }) => React.createElement('span', null, children);
  const Pressable = ({ children, onPress, accessibilityLabel, disabled }: { children?: ReactNode; onPress?: () => void; accessibilityLabel?: string; disabled?: boolean }) =>
    React.createElement('button', { 'aria-label': accessibilityLabel, disabled, onClick: onPress }, children);
  return { StyleSheet: { create: (styles: unknown) => styles }, View, ScrollView: View, Text, Pressable, useWindowDimensions: () => ({ width: 375, height: 812, fontScale: 1 }) };
});
jest.mock('@/ui/Buddy', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return { Buddy: ({ message }: { message: string }) => React.createElement('p', { 'data-testid': 'buddy' }, message) };
});
jest.mock('@/ui/BigButton', () => ({ BigButton: () => null }));
jest.mock('@/ui/WordArt', () => ({ WordArt: () => null }));
jest.mock('@/ui/HintPulse', () => ({ HINT_AFTER_MISSES: 2, HintPulse: ({ children }: { children?: ReactNode }) => children }));
jest.mock('./GameDoneActions', () => ({ GameDoneActions: () => null }));
jest.mock('@/features/buddy/useBuddyLine', () => ({ useBuddyLine: () => (key: string) => key }));
jest.mock('@/lib/navigation', () => ({ goBackOrHome: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ haptic: jest.fn() }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('@/state/settings', () => ({ useSettings: () => ({ soundEffects: true, haptics: true }) }));
const mockPlay = jest.fn<(id: string) => boolean>(() => true);
const mockVoice = { play: mockPlay, stop: () => undefined };
jest.mock('@/state/familyVoice', () => ({ useFamilyVoice: () => mockVoice }));
const mockRecordAnswer = jest.fn();
jest.mock('@/state/progress', () => ({ useProgressActions: () => ({ recordAnswer: mockRecordAnswer, recordGamePlayed: () => undefined }) }));

const word = (id: string) => getWord(id) as Word;
jest.mock('./counting', () => {
  const actual = jest.requireActual('./counting') as typeof import('./counting');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getWord: get } = require('@/content/packs') as typeof import('@/content/packs');
  const options = ['numbers.one', 'numbers.two', 'numbers.three'].map((id) => get(id) as Word);
  return { ...actual, buildCountRounds: () => [{ answer: options[2], value: 3, objectId: 'food.apple', options }, { answer: options[0], value: 1, objectId: 'toys.ball', options }] };
});

let root: { render(children: ReactNode): void; unmount(): void } | null = null;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  mockPlay.mockClear();
  mockRecordAnswer.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; });

const buttons = (pattern: RegExp) => [...document.querySelectorAll('button')].filter((b) => pattern.test(b.getAttribute('aria-label') ?? ''));
const buddy = () => document.querySelector('[data-testid="buddy"]')?.textContent;

async function renderGame() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<CountGame seenWords={[word('numbers.one'), word('numbers.two'), word('numbers.three')]} />); });
}

test('fast taps in one tick count every picture, saying one, two, three in the family voice', async () => {
  await renderGame();
  expect(buddy()).toBe('game_count_prompt');
  expect(buttons(/^Count this apple$/)).toHaveLength(3);
  expect(buttons(/^(մեկ|երկու|երեք),/)).toHaveLength(0);
  await act(async () => { buttons(/^Count this apple$/).forEach((b) => b.click()); });
  expect(buttons(/counted/).map((b) => b.getAttribute('aria-label'))).toEqual(['apple, counted 1', 'apple, counted 2', 'apple, counted 3']);
  expect(mockPlay.mock.calls.map(([id]) => id)).toEqual(['numbers.one', 'numbers.two', 'numbers.three']);
  expect(buddy()).toBe('game_count_how_many');
  expect(buttons(/^(մեկ|երկու|երեք),/)).toHaveLength(3);
});

test('a wrong pick then the right one records a not-first-try answer once', async () => {
  await renderGame();
  await act(async () => { buttons(/^Count this apple$/).forEach((b) => b.click()); });
  await act(async () => { buttons(/^երկու, two/)[0].click(); });
  expect(buddy()).toBe('game_try_again');
  expect(mockRecordAnswer).not.toHaveBeenCalled();
  await act(async () => { const right = buttons(/^երեք, three/)[0]; right.click(); right.click(); });
  expect(mockRecordAnswer.mock.calls).toEqual([['numbers.three', false]]);
  expect(buddy()).toBe('game_correct');
});
