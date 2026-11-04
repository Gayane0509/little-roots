import { beforeEach, expect, jest, test } from '@jest/globals';
import { haptic } from './haptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => {}),
  notificationAsync: jest.fn(async () => {}),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning' },
}));
const haptics = jest.requireMock('expo-haptics') as {
  impactAsync: jest.Mock<(style: string) => Promise<void>>;
  notificationAsync: jest.Mock<(type: string) => Promise<void>>;
};

beforeEach(() => { haptics.impactAsync.mockClear(); haptics.notificationAsync.mockClear(); });

test('maps each cue to one expo-haptics call', () => {
  haptic('tap');
  haptic('success');
  haptic('warning');
  expect(haptics.impactAsync.mock.calls).toEqual([['light']]);
  expect(haptics.notificationAsync.mock.calls).toEqual([['success'], ['warning']]);
});
test('Vibration off: no call at all', () => {
  haptic('tap', false);
  haptic('success', false);
  expect(haptics.impactAsync).not.toHaveBeenCalled();
  expect(haptics.notificationAsync).not.toHaveBeenCalled();
});
test('a rejected or throwing call never escapes', async () => {
  haptics.notificationAsync.mockRejectedValueOnce(new Error('no vibrator'));
  haptics.impactAsync.mockImplementationOnce(() => { throw new Error('unavailable'); });
  expect(() => haptic('success')).not.toThrow();
  expect(() => haptic('tap')).not.toThrow();
  await Promise.resolve();
});
test('only lib/haptics imports expo-haptics', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync, readFileSync, statSync } = require('fs') as {
    readdirSync(dir: string): string[]; readFileSync(path: string, encoding: 'utf8'): string; statSync(path: string): { isDirectory(): boolean };
  };
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
  const offenders = files('src').filter((path) => !path.endsWith('/lib/haptics.ts') && readFileSync(path, 'utf8').includes('expo-haptics'));
  expect(offenders).toEqual([]);
});
