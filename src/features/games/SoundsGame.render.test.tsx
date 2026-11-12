import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { ACTIVE_PACK } from '@/content/packs';

import { SoundsGame, soundOptionArt } from './SoundsGame';

// DOM stand-ins so the game renders under react-dom: Pressable is a button carrying its accessibility label.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children, accessibilityLabel }: { children?: ReactNode; accessibilityLabel?: string }) => React.createElement('div', { 'aria-label': accessibilityLabel }, children);
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
jest.mock('@/ui/letterFont', () => ({ LETTER_FONT: 'test' }));
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
jest.mock('@/state/progress', () => ({ useProgressActions: () => ({ recordGamePlayed: () => undefined }) }));
let mockTraced = new Set(['Ա', 'Բ', 'Գ']);
jest.mock('@/state/letters', () => ({ useTracedLetters: () => ({ traced: mockTraced }) }));
jest.mock('./letterSounds', () => {
  const actual = jest.requireActual('./letterSounds') as typeof import('./letterSounds');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ACTIVE_PACK: pack } = require('@/content/packs') as typeof import('@/content/packs');
  const [ayb, ben, gim] = pack.alphabet;
  return { ...actual, buildSoundRounds: (alphabet: never, traced: Set<string>) => (traced.size < 3 ? [] : [{ answer: ben, options: [ayb, ben, gim] }, { answer: ayb, options: [gim, ayb, ben] }]) };
});

let root: { render(children: ReactNode): void; unmount(): void } | null = null;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  mockPlay.mockClear();
  mockTraced = new Set(['Ա', 'Բ', 'Գ']);
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; });

const buttons = (pattern: RegExp) => [...document.querySelectorAll('button')].filter((b) => pattern.test(b.getAttribute('aria-label') ?? ''));
const buddy = () => document.querySelector('[data-testid="buddy"]')?.textContent;

async function renderGame() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<SoundsGame />); });
}

test('shows the letter and three pictures; a wrong pick asks to try again, the right one says the word in the family voice', async () => {
  await renderGame();
  expect(buddy()).toBe('game_sounds_prompt');
  expect(document.querySelector('[aria-label="Letter Ben"]')?.textContent).toBe('Բ բ');
  expect(buttons(/^(bear|duck|carrot)$/)).toHaveLength(3);
  await act(async () => { buttons(/^bear$/)[0].click(); });
  expect(buddy()).toBe('game_try_again');
  expect(buttons(/^bear, try again$/)[0].disabled).toBe(true);
  expect(mockPlay).not.toHaveBeenCalled();
  await act(async () => { const right = buttons(/^duck$/)[0]; right.click(); right.click(); });
  expect(buddy()).toBe('game_correct');
  expect(mockPlay.mock.calls).toEqual([['letters.duck']]);
  expect(buttons(/^duck, բադ, correct$/)[0].textContent).toBe('բադ');
});

test('opened before the traced letters load, it starts the game once they arrive', async () => {
  mockTraced = new Set();
  await renderGame();
  expect(buddy()).toBe('game_sounds_locked');
  mockTraced = new Set(['Ա', 'Բ', 'Գ']);
  await act(async () => { root?.render(<SoundsGame />); });
  expect(buddy()).toBe('game_sounds_prompt');
  expect(buttons(/^(bear|duck|carrot)$/)).toHaveLength(3);
});

test('with fewer than three traced letters it sends the child to trace', async () => {
  mockTraced = new Set(['Ա']);
  await renderGame();
  expect(buddy()).toBe('game_sounds_locked');
  expect(buttons(/./)).toHaveLength(0);
});

test('answer pictures fit three a row from 320 px to tablets', () => {
  expect(soundOptionArt(320)).toBe(Math.floor((288 - 16) / 3) - 22);
  expect(soundOptionArt(1024)).toBe(128);
  for (const width of [320, 375, 414, 768, 1024]) {
    const column = Math.min(width - 32, 720);
    expect(3 * (soundOptionArt(width) + 22) + 2 * 8).toBeLessThanOrEqual(column);
  }
  expect(ACTIVE_PACK.alphabet[1].example.en).toBe('duck');
});
