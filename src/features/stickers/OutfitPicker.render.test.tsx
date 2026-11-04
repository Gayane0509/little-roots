import { act, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { OutfitPicker } from './OutfitPicker';

// DOM stand-ins so the picker renders under react-dom: Pressable → <button>, View → <div> carrying its label.
jest.mock('react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  type MockProps = { children?: ReactNode; accessibilityLabel?: string; onPress?: () => void; 'aria-selected'?: boolean };
  const View = ({ children, accessibilityLabel }: MockProps) => React.createElement('div', { 'aria-label': accessibilityLabel }, children);
  const Pressable = ({ children, accessibilityLabel, onPress, ...rest }: MockProps) =>
    React.createElement('button', { 'aria-label': accessibilityLabel, 'data-selected': String(!!rest['aria-selected']), onClick: onPress }, children);
  return { StyleSheet: { create: (styles: unknown) => styles, absoluteFill: {} }, View, Pressable, Text: View, Platform: { OS: 'ios' }, useWindowDimensions: () => ({ width: 375, height: 812 }) };
});
jest.mock('react-native-svg', () => ({ SvgXml: () => null }));
jest.mock('@/ui/Icon', () => ({ Icon: () => null }));

let root: { render(children: ReactNode): void; unmount(): void } | null = null;
async function mount(children: ReactNode) {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(children); });
}
const buttons = () => [...document.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'));

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; });

test('locked items are not buttons and say how many stickers are still needed', async () => {
  await mount(<OutfitPicker stickerCount={4} worn={undefined} onPick={() => undefined} />);
  expect(buttons()).toEqual(['No dress-up', 'Party hat']);
  expect(document.querySelector('[aria-label="Glasses, locked: 2 more stickers"]')).not.toBeNull();
  expect(document.querySelector('[aria-label="Crown, locked: 6 more stickers"]')).not.toBeNull();
});

test('tapping an unlocked item picks it, and the worn item is selected', async () => {
  const onPick = jest.fn();
  await mount(<OutfitPicker stickerCount={10} worn="crown" onPick={onPick} />);
  const crown = document.querySelector<HTMLButtonElement>('button[aria-label="Crown"]');
  expect(crown?.getAttribute('data-selected')).toBe('true');
  expect(document.querySelector('button[aria-label="No dress-up"]')?.getAttribute('data-selected')).toBe('false');
  await act(async () => { document.querySelector<HTMLButtonElement>('button[aria-label="Glasses"]')?.click(); });
  await act(async () => { document.querySelector<HTMLButtonElement>('button[aria-label="No dress-up"]')?.click(); });
  expect(onPick.mock.calls).toEqual([['glasses'], [null]]);
});
