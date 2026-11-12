import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { Bounce, BOUNCE_HEIGHT } from './Bounce';

type Step = { kind: 'delay'; ms: number } | { kind: 'timing'; config: { toValue: number; useNativeDriver: boolean } };
const mockAnimation: { steps: Step[]; starts: number; stops: number; reduceMotion: boolean; ranges: number[][] } = { steps: [], starts: 0, stops: 0, reduceMotion: false, ranges: [] };

// DOM stand-ins so the component can render under react-dom; the animation calls are recorded, not run.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  class Value { setValue() {} interpolate({ outputRange }: { outputRange: number[] }) { mockAnimation.ranges.push(outputRange); return 0; } }
  return {
    Easing: { out: () => () => 0, in: () => () => 0, quad: () => 0 },
    Animated: {
      View: ({ children }: { children?: ReactNode }) => React.createElement('div', { 'data-bounce': '' }, children),
      Value,
      delay: (ms: number) => ({ step: { kind: 'delay', ms } }),
      timing: (_value: unknown, config: { toValue: number; useNativeDriver: boolean }) => ({ step: { kind: 'timing', config } }),
      sequence: (parts: { step: Step }[]) => ({
        start: () => { mockAnimation.starts += 1; mockAnimation.steps = parts.map((part) => part.step); },
        stop: () => { mockAnimation.stops += 1; },
      }),
    },
  };
});
jest.mock('./useReduceMotion', () => ({ useReduceMotion: () => mockAnimation.reduceMotion }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function mount(delay?: number) {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<Bounce delay={delay}><span>word</span></Bounce>); });
}

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  Object.assign(mockAnimation, { steps: [], starts: 0, stops: 0, reduceMotion: false, ranges: [] });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

test('a learned word hops once, after its delay, on the native driver', async () => {
  await mount(610);
  expect(mockAnimation.starts).toBe(1);
  expect(mockAnimation.steps[0]).toEqual({ kind: 'delay', ms: 610 });
  const timings = mockAnimation.steps.filter((step) => step.kind === 'timing');
  expect(timings.length).toBeGreaterThan(0);
  expect(timings.every((step) => step.config.useNativeDriver)).toBe(true);
  // It ends at rest, and the hop stays gentle.
  expect(timings[timings.length - 1].config.toValue).toBe(0);
  expect(mockAnimation.ranges.flat().every((value) => Math.abs(value) <= BOUNCE_HEIGHT)).toBe(true);
  expect(document.body.textContent).toBe('word');
});

test('nothing moves under reduced motion, but the word still shows', async () => {
  mockAnimation.reduceMotion = true;
  await mount(0);
  expect(mockAnimation.starts).toBe(0);
  expect(document.body.textContent).toBe('word');
});

test('the hop stops when the reward unmounts', async () => {
  await mount(0);
  await act(async () => root?.unmount());
  root = null;
  expect(mockAnimation.stops).toBe(1);
});
