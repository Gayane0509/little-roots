import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { Alert } from 'react-native';
import { confirmAction, notify } from './dialog';

type Button = { text: string; style?: string; onPress?: () => void };
let alertSpy: jest.SpiedFunction<typeof Alert.alert>;
const g = globalThis as { alert?: (text: string) => void; confirm?: (text: string) => boolean };

beforeEach(() => { alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {}); });
afterEach(() => { alertSpy.mockRestore(); delete g.alert; delete g.confirm; });

test('native notify uses Alert.alert', () => {
  notify('Could not save', 'Please try again.', false);
  expect(alertSpy).toHaveBeenCalledWith('Could not save', 'Please try again.');
});

test('web notify uses the browser alert', () => {
  const alert = jest.fn<(text: string) => void>();
  g.alert = alert;
  notify('Restored', 'Premium is active.', true);
  notify('Done', undefined, true);
  expect(alert.mock.calls).toEqual([['Restored\n\nPremium is active.'], ['Done']]);
  expect(alertSpy).not.toHaveBeenCalled();
});

test('native confirm: Cancel first, confirm button runs onConfirm', () => {
  const onConfirm = jest.fn();
  confirmAction({ title: 'Delete Ani?', message: 'Gone.', confirmText: 'Delete', destructive: true, onConfirm }, false);
  const buttons = alertSpy.mock.calls[0][2] as Button[];
  expect(buttons.map((b) => [b.text, b.style])).toEqual([['Cancel', 'cancel'], ['Delete', 'destructive']]);
  expect(onConfirm).not.toHaveBeenCalled();
  buttons[1].onPress?.();
  expect(onConfirm).toHaveBeenCalledTimes(1);
});

test('web confirm runs onConfirm only when the grown-up agrees', () => {
  const onConfirm = jest.fn();
  g.confirm = jest.fn(() => false);
  confirmAction({ title: 'Reset progress?', message: 'All words.', confirmText: 'Reset', onConfirm }, true);
  expect(onConfirm).not.toHaveBeenCalled();
  g.confirm = jest.fn(() => true);
  confirmAction({ title: 'Reset progress?', message: 'All words.', confirmText: 'Reset', onConfirm }, true);
  expect(g.confirm).toHaveBeenCalledWith('Reset progress?\n\nAll words.');
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(alertSpy).not.toHaveBeenCalled();
});
