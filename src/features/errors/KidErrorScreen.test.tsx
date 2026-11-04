import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { KidErrorBoundary, KidErrorScreen } from './KidErrorScreen';

// DOM stand-ins so the screen can render under react-dom.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const passthrough = (tag: string) => {
    const Component = ({ children }: { children?: ReactNode }) => React.createElement(tag, null, children);
    Component.displayName = tag;
    return Component;
  };
  return {
    StyleSheet: { create: (styles: unknown) => styles },
    View: passthrough('div'),
    Text: passthrough('span'),
    Pressable: ({ children, onPress, accessibilityLabel }: { children?: ReactNode; onPress: () => void; accessibilityLabel?: string }) =>
      React.createElement('button', { 'aria-label': accessibilityLabel, onClick: onPress }, children),
  };
});
jest.mock('react-native-safe-area-context', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  return { SafeAreaView: ({ children }: { children?: ReactNode }) => React.createElement('main', null, children) };
});
jest.mock('@/ui/Icon', () => ({ Icon: () => null }));
jest.mock('@/ui/SceneBackdrop', () => ({ SceneBackdrop: () => null }));
jest.mock('@/state/settings', () => ({ useSettings: () => ({ haptics: true }) }));
const mockCalls: string[] = [];
jest.mock('expo-router', () => ({ router: { replace: (path: string) => { mockCalls.push(`replace ${path}`); } } }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), ImpactFeedbackStyle: { Light: 'light' } }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function mount(onRetry = jest.fn(), onHome = jest.fn()) {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<KidErrorScreen onRetry={onRetry} onHome={onHome} />); });
  return { onRetry, onHome };
}
const button = (label: string) => document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

async function mountBoundary(error: Error) {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  const retry = jest.fn(async () => { mockCalls.push('retry'); });
  await act(async () => { root?.render(<KidErrorBoundary error={error} retry={retry} />); });
  return retry;
}

test('the boundary shows a friendly message and never the error details', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const error = new Error('boom secret stack');
  await mountBoundary(error);
  expect(document.body.textContent).toContain("Oops! Let's try that again.");
  expect(document.body.textContent).not.toContain(error.message);
  spy.mockRestore();
});
test('boundary: Try again retries; Go home navigates home, then resets the boundary', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  mockCalls.length = 0;
  await mountBoundary(new Error('x'));
  await act(async () => { button('Try again')?.click(); });
  expect(mockCalls).toEqual(['retry']);
  await act(async () => { button('Go home')?.click(); });
  expect(mockCalls).toEqual(['retry', 'replace /', 'retry']);
  spy.mockRestore();
});
test('Try again calls onRetry only', async () => {
  const { onRetry, onHome } = await mount();
  await act(async () => { button('Try again')?.click(); });
  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(onHome).not.toHaveBeenCalled();
});
test('Go home calls onHome only', async () => {
  const { onRetry, onHome } = await mount();
  await act(async () => { button('Go home')?.click(); });
  expect(onHome).toHaveBeenCalledTimes(1);
  expect(onRetry).not.toHaveBeenCalled();
});
