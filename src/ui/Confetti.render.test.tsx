import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { Confetti } from './Confetti';

type Done = (result: { finished: boolean }) => void;
const mockAnimation: { onDone: Done | null; stops: number } = { onDone: null, stops: 0 };

// DOM stand-ins so the component can render under react-dom; the timing animation is driven by hand.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-piece': '' }, children);
  class Value { setValue() {} interpolate() { return 0; } }
  return {
    StyleSheet: { create: (styles: unknown) => styles },
    View: ({ children }: { children?: ReactNode }) => React.createElement('section', null, children),
    Easing: { out: () => () => 0, quad: () => 0 },
    Animated: {
      View,
      Value,
      timing: () => ({
        start: (onDone: Done) => { mockAnimation.onDone = onDone; },
        stop: () => { mockAnimation.stops += 1; mockAnimation.onDone?.({ finished: false }); },
      }),
    },
  };
});
jest.mock('./useReduceMotion', () => ({ useReduceMotion: () => false }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function mount() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<Confetti />); });
}
const pieceCount = () => document.querySelectorAll('[data-piece]').length;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  mockAnimation.onDone = null; mockAnimation.stops = 0;
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

test('confetti pieces unmount once the burst finishes', async () => {
  await mount();
  expect(pieceCount()).toBeGreaterThan(0);
  await act(async () => { mockAnimation.onDone?.({ finished: true }); });
  expect(pieceCount()).toBe(0);
});

test('unmounting mid-burst stops the animation without a late state update', async () => {
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
  await mount();
  await act(async () => root?.unmount());
  root = null;
  expect(mockAnimation.stops).toBe(1);
  expect(errors).not.toHaveBeenCalled();
  errors.mockRestore();
});
