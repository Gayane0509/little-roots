import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

jest.mock('expo-splash-screen', () => ({ preventAutoHideAsync: jest.fn(async () => true), hide: jest.fn() }));
const native = jest.requireMock('expo-splash-screen') as { preventAutoHideAsync: jest.Mock; hide: jest.Mock };
type Splash = typeof import('./splash');

function load(): Splash {
  let splash: Splash | undefined;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  jest.isolateModules(() => { splash = require('./splash') as Splash; });
  return splash as Splash;
}

const perf = { mark: jest.fn(), measure: jest.fn() };
beforeEach(() => {
  jest.useFakeTimers();
  Object.assign(globalThis, { performance: perf });
  [native.preventAutoHideAsync, native.hide, perf.mark, perf.measure].forEach((fn) => fn.mockClear());
});
afterEach(() => { jest.useRealTimers(); });

test('holds the native splash once and hides it once on release', () => {
  const splash = load();
  splash.holdSplash();
  splash.holdSplash();
  expect(native.preventAutoHideAsync).toHaveBeenCalledTimes(1);
  expect(splash.isSplashReleased()).toBe(false);
  splash.releaseSplash();
  splash.releaseSplash();
  expect(native.hide).toHaveBeenCalledTimes(1);
  expect(splash.isSplashReleased()).toBe(true);
});
test('records the startup time as a performance measure', () => {
  const splash = load();
  splash.holdSplash();
  splash.releaseSplash();
  expect(perf.mark).toHaveBeenLastCalledWith(splash.STARTUP_MARK);
  expect(perf.measure).toHaveBeenCalledWith(splash.STARTUP_MEASURE, 'lr:splash-held', splash.STARTUP_MARK);
});
test('a runtime without the Performance API still hides the splash', () => {
  const splash = load();
  Object.assign(globalThis, { performance: undefined });
  splash.holdSplash();
  splash.releaseSplash();
  expect(native.hide).toHaveBeenCalledTimes(1);
});
test('a hung load never keeps the splash up past the safety timeout', () => {
  const splash = load();
  splash.holdSplash();
  jest.advanceTimersByTime(splash.SPLASH_MAX_MS - 1);
  expect(native.hide).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1);
  expect(native.hide).toHaveBeenCalledTimes(1);
});
test('an early release cancels the safety timeout', () => {
  const splash = load();
  splash.holdSplash();
  splash.releaseSplash();
  jest.advanceTimersByTime(splash.SPLASH_MAX_MS);
  expect(native.hide).toHaveBeenCalledTimes(1);
});
