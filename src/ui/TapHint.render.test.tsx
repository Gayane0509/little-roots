import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { TapHint } from './TapHint';

const mockMotion = { reduce: false, loops: 0, stops: 0 };

// DOM stand-ins so the component can render under react-dom; the loop is counted, not run.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const View = ({ children, testID }: { children?: ReactNode; testID?: string }) => React.createElement('div', { 'data-testid': testID }, children);
  class Value { setValue() {} interpolate() { return 0; } }
  return {
    StyleSheet: { create: (styles: unknown) => styles },
    View,
    Easing: { inOut: () => () => 0, sin: () => 0 },
    Animated: {
      View,
      Value,
      timing: () => ({}),
      sequence: () => ({}),
      loop: () => ({ start: () => { mockMotion.loops += 1; }, stop: () => { mockMotion.stops += 1; } }),
    },
  };
});
jest.mock('./useReduceMotion', () => ({ useReduceMotion: () => mockMotion.reduce }));
jest.mock('./Icon', () => ({ Icon: () => null }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function mount(visible: boolean) {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<TapHint visible={visible} />); });
}
const shown = () => document.querySelector('[data-testid="tap-hint"]') !== null;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  Object.assign(mockMotion, { reduce: false, loops: 0, stops: 0 });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; });

test('the hand bobs while shown and stops when it goes away', async () => {
  await mount(true);
  expect(shown()).toBe(true);
  expect(mockMotion.loops).toBe(1);
  await act(async () => root?.render(<TapHint visible={false} />));
  expect(shown()).toBe(false);
  expect(mockMotion.stops).toBe(1);
});
test('reduced motion shows a still hand', async () => {
  mockMotion.reduce = true;
  await mount(true);
  expect(shown()).toBe(true);
  expect(mockMotion.loops).toBe(0);
});
test('nothing renders when hidden', async () => {
  await mount(false);
  expect(shown()).toBe(false);
  expect(mockMotion.loops).toBe(0);
});
