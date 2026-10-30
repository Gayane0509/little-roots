import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { getReminder, parseReminder, setReminder, validReminderTime } from './reminders';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = { value: null as string | null, failSave: false };
  return { __esModule: true, store, default: {
    getItem: jest.fn(async () => store.value),
    setItem: jest.fn(async (_key: string, value: string) => {
      if (store.failSave) throw new Error('persist failed');
      store.value = value;
    }),
  } };
});
jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
  AndroidImportance: { DEFAULT: 3 },
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setNotificationChannelAsync: jest.fn(async () => {}),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  scheduleNotificationAsync: jest.fn(async () => 'scheduled-id'),
  setNotificationHandler: jest.fn(),
}));

const storage = jest.requireMock('@react-native-async-storage/async-storage') as {
  store: { value: string | null; failSave: boolean };
};
const notifications = jest.requireMock('expo-notifications') as {
  getPermissionsAsync: jest.Mock;
  requestPermissionsAsync: jest.Mock;
  cancelScheduledNotificationAsync: jest.Mock;
  scheduleNotificationAsync: jest.Mock;
};
const native = jest.requireMock('react-native') as { Platform: { OS: string } };

beforeEach(() => {
  storage.store.value = null;
  storage.store.failSave = false;
  native.Platform.OS = 'ios';
  notifications.getPermissionsAsync.mockReset().mockImplementation(async () => ({ granted: true }));
  notifications.requestPermissionsAsync.mockReset().mockImplementation(async () => ({ granted: true }));
  notifications.cancelScheduledNotificationAsync.mockClear();
  notifications.scheduleNotificationAsync.mockReset().mockImplementation(async () => 'scheduled-id');
});

describe('reminder settings', () => {
  it('validates time and defaults malformed settings', () => {
    expect(validReminderTime(23, 59)).toBe(true);
    expect(validReminderTime(24, 0)).toBe(false);
    expect(validReminderTime(12, 1.5)).toBe(false);
    expect(parseReminder('{oops')).toMatchObject({ enabled: false, hour: 19, minute: 0 });
    expect(parseReminder('{"enabled":true,"hour":25,"minute":0}').enabled).toBe(false);
  });

  it('schedules a daily reminder and cancels the previous one on change', async () => {
    expect(await setReminder(true, 8, 0)).toBe('ok');
    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
      content: { title: 'Time for Little Roots 🌱', body: 'Արջուկ is waiting with 3 new words!' },
      trigger: { type: 'daily', hour: 8, minute: 0 },
    }));
    expect(await getReminder()).toEqual({ enabled: true, hour: 8, minute: 0 });
    notifications.scheduleNotificationAsync.mockImplementationOnce(async () => 'second-id');
    expect(await setReminder(true, 19, 0)).toBe('ok');
    expect(notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('scheduled-id');
    expect(await getReminder()).toEqual({ enabled: true, hour: 19, minute: 0 });
  });

  it('returns denied without changing settings when permission is denied', async () => {
    notifications.getPermissionsAsync.mockImplementation(async () => ({ granted: false }));
    notifications.requestPermissionsAsync.mockImplementation(async () => ({ granted: false }));
    expect(await setReminder(true, 12, 0)).toBe('denied');
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(await getReminder()).toEqual({ enabled: false, hour: 19, minute: 0 });
  });

  it('does nothing on web', async () => {
    native.Platform.OS = 'web';
    expect(await setReminder(true, 8, 0)).toBe('unsupported');
    expect(await getReminder()).toMatchObject({ enabled: false });
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('keeps the previous schedule when scheduling throws', async () => {
    storage.store.value = JSON.stringify({ enabled: true, hour: 8, minute: 0, notificationId: 'old-id' });
    notifications.scheduleNotificationAsync.mockImplementation(async () => { throw new Error('schedule failed'); });
    await expect(setReminder(true, 19, 0)).rejects.toThrow('schedule failed');
    expect(notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalled();
    expect(await getReminder()).toEqual({ enabled: true, hour: 8, minute: 0 });
  });

  it('cancels the new schedule and keeps the previous one when persistence fails', async () => {
    storage.store.value = JSON.stringify({ enabled: true, hour: 8, minute: 0, notificationId: 'old-id' });
    storage.store.failSave = true;
    await expect(setReminder(true, 19, 0)).rejects.toThrow('persist failed');
    expect(notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(1);
    expect(notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('scheduled-id');
    expect(await getReminder()).toEqual({ enabled: true, hour: 8, minute: 0 });
  });
});
