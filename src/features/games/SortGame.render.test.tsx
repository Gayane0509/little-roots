import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { getWord } from '@/content/packs';
import type { Word } from '@/content/types';

import { basketAt, SortGame, sortLayout } from './SortGame';

// DOM stand-ins so the game renders under react-dom: Pressable is a button carrying its accessibility label; the drag
// itself is native-only, so the tests sort by tapping a basket (the screen-reader path).
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children, accessibilityLabel }: { children?: ReactNode; accessibilityLabel?: string }) => React.createElement('div', { 'aria-label': accessibilityLabel }, children);
  const Text = ({ children }: { children?: ReactNode }) => React.createElement('span', null, children);
  const Pressable = ({ children, onPress, accessibilityLabel, disabled }: { children?: ReactNode; onPress?: () => void; accessibilityLabel?: string; disabled?: boolean }) =>
    React.createElement('button', { 'aria-label': accessibilityLabel, disabled, onClick: onPress }, children);
  class ValueXY { x = 0; y = 0; setValue() {} stopAnimation() {} extractOffset() {} flattenOffset() {} getTranslateTransform() { return []; } }
  const Animated = { ValueXY, View, event: () => () => undefined, spring: () => ({ start: () => undefined }) };
  const PanResponder = { create: () => ({ panHandlers: {} }) };
  return { StyleSheet: { create: (styles: unknown) => styles }, View, ScrollView: View, Text, Pressable, Animated, PanResponder, useWindowDimensions: () => ({ width: 375, height: 812, fontScale: 1 }) };
});
jest.mock('@/ui/Buddy', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return { Buddy: ({ message }: { message: string }) => React.createElement('p', { 'data-testid': 'buddy' }, message) };
});
jest.mock('@/ui/BigButton', () => ({ BigButton: () => null }));
jest.mock('@/ui/WordArt', () => ({ WordArt: () => null }));
jest.mock('@/ui/Icon', () => ({ Icon: () => null }));
jest.mock('@/ui/HintPulse', () => ({ HINT_AFTER_MISSES: 2, HintPulse: ({ children }: { children?: ReactNode }) => children }));
jest.mock('./GameDoneActions', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return { GameDoneActions: ({ result }: { result: string }) => React.createElement('p', { 'data-testid': 'done' }, result) };
});
jest.mock('@/features/buddy/useBuddyLine', () => ({ useBuddyLine: () => (key: string, vars?: Record<string, number>) => (vars ? `${key} ${vars.score}/${vars.total}` : key) }));
jest.mock('@/lib/navigation', () => ({ goBackOrHome: jest.fn() }));
const mockSfx = jest.fn();
jest.mock('@/lib/sfx', () => ({ playSfx: (name: string) => mockSfx(name) }));
jest.mock('@/lib/haptics', () => ({ haptic: jest.fn() }));
jest.mock('@/state/settings', () => ({ useSettings: () => ({ soundEffects: true, haptics: true }) }));
const mockPlay = jest.fn<(id: string) => boolean>(() => true);
const mockVoice = { play: mockPlay, stop: () => undefined };
jest.mock('@/state/familyVoice', () => ({ useFamilyVoice: () => mockVoice }));
const mockRecordAnswer = jest.fn();
const mockActions = { recordAnswer: (id: string, correct: boolean) => mockRecordAnswer(id, correct), recordGamePlayed: () => undefined };
jest.mock('@/state/progress', () => ({ useProgressActions: () => mockActions }));
jest.mock('./sorting', () => {
  const actual = jest.requireActual('./sorting') as typeof import('./sorting');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getWord: get } = require('@/content/packs') as typeof import('@/content/packs');
  return { ...actual, buildSortRounds: () => [{ word: get('food.apple'), basket: 'food' }, { word: get('family.mom'), basket: 'other' }] };
});

const word = (id: string) => getWord(id) as Word;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;

beforeEach(() => {
  jest.useFakeTimers();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  mockPlay.mockClear();
  mockPlay.mockImplementation(() => true);
  mockSfx.mockClear();
  mockRecordAnswer.mockClear();
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; jest.useRealTimers(); });

const button = (label: string) => [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === label) as HTMLButtonElement;
const buddy = () => document.querySelector('[data-testid="buddy"]')?.textContent;

async function renderGame() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<SortGame seenWords={[word('food.apple'), word('family.mom')]} reviewIds={[]} />); });
}

test('the wrong basket asks to try again; the right one says the word, then the next picture comes', async () => {
  await renderGame();
  expect(buddy()).toBe('game_sort_prompt');
  expect(document.querySelector('[aria-label="apple. Is it food? Tap a basket."]')).not.toBeNull();
  await act(async () => { button('Not food').click(); });
  expect(buddy()).toBe('game_try_again');
  expect(mockPlay).not.toHaveBeenCalled();
  await act(async () => { button('Food').click(); button('Food').click(); });
  expect(buddy()).toBe('game_correct');
  expect(mockPlay.mock.calls).toEqual([['food.apple']]);
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(buddy()).toBe('game_sort_prompt');
  expect(document.querySelector('[aria-label="mom. Is it food? Tap a basket."]')).not.toBeNull();
  await act(async () => { button('Not food').click(); });
  await act(async () => { jest.advanceTimersByTime(1000); });
  // Only first-try answers score: the apple needed a second go.
  expect(document.querySelector('[data-testid="done"]')?.textContent).toBe('game_score 1/2');
  // Answers reschedule spaced review like the other games: the apple was not right first time.
  expect(mockRecordAnswer.mock.calls).toEqual([['food.apple', false], ['family.mom', true]]);
});

test('without a family recording the right basket plays the chime', async () => {
  mockPlay.mockImplementation(() => false);
  await renderGame();
  await act(async () => { button('Food').click(); });
  expect(mockSfx).toHaveBeenCalledWith('correct');
});

test('a drop lands in the basket under the finger, or nowhere', () => {
  const rects = { food: { x: 16, y: 500, width: 160, height: 120 }, other: { x: 184, y: 500, width: 160, height: 120 } };
  expect(basketAt(rects, 100, 560)).toBe('food');
  expect(basketAt(rects, 300, 619)).toBe('other');
  expect(basketAt(rects, 180, 560)).toBeUndefined();
  expect(basketAt(rects, 100, 300)).toBeUndefined();
  expect(basketAt({}, 100, 560)).toBeUndefined();
});

test('the picture shrinks on short windows and grows on tablets', () => {
  expect(sortLayout({ width: 375, height: 667 }).compact).toBe(true);
  expect(sortLayout({ width: 375, height: 667 }).art).toBe(120);
  expect(sortLayout({ width: 375, height: 812 }).art).toBe(168);
  expect(sortLayout({ width: 320, height: 812 }).art).toBe(144);
  expect(sortLayout({ width: 1024, height: 768 }).art).toBe(220);
  // #169: tablet basket labels grow with the 96 px basket drawing; phones keep body text.
  expect(sortLayout({ width: 1024, height: 768 }).label).toBe(30);
  expect(sortLayout({ width: 375, height: 812 }).label).toBe(18);
  expect(sortLayout({ width: 1024, height: 600 }).label).toBe(18);
});
