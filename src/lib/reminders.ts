import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

const STORAGE_KEY = 'littleroots.reminder.v1';
const CHANNEL_ID = 'reminders';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export type SetReminderResult = 'ok' | 'denied' | 'unsupported';

interface StoredReminder extends ReminderSettings {
  notificationId: string | null;
}

const DEFAULT_REMINDER: StoredReminder = { enabled: false, hour: 19, minute: 0, notificationId: null };

export function validReminderTime(hour: number, minute: number): boolean {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23 &&
    Number.isInteger(minute) && minute >= 0 && minute <= 59;
}

export function parseReminder(raw: string | null): StoredReminder {
  if (!raw) return DEFAULT_REMINDER;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return DEFAULT_REMINDER;
    const fields = value as Record<string, unknown>;
    if (typeof fields.enabled !== 'boolean' ||
      typeof fields.hour !== 'number' || typeof fields.minute !== 'number' ||
      !validReminderTime(fields.hour, fields.minute)) return DEFAULT_REMINDER;
    return {
      enabled: fields.enabled,
      hour: fields.hour,
      minute: fields.minute,
      notificationId: typeof fields.notificationId === 'string' ? fields.notificationId : null,
    };
  } catch {
    return DEFAULT_REMINDER;
  }
}

async function readStoredReminder(): Promise<StoredReminder> {
  return parseReminder(await AsyncStorage.getItem(STORAGE_KEY));
}

export async function getReminder(): Promise<ReminderSettings> {
  if (Platform.OS === 'web') return { enabled: false, hour: DEFAULT_REMINDER.hour, minute: DEFAULT_REMINDER.minute };
  const { enabled, hour, minute } = await readStoredReminder();
  return { enabled, hour, minute };
}

export async function setReminder(enabled: boolean, hour: number, minute: number): Promise<SetReminderResult> {
  if (Platform.OS === 'web') return 'unsupported';
  if (!validReminderTime(hour, minute)) throw new RangeError('Invalid reminder time');

  const previous = await readStoredReminder();
  if (enabled) {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Reminders',
        importance: AndroidImportance.DEFAULT,
      });
    }
    const existing = await Notifications.getPermissionsAsync();
    const permission = existing.granted ? existing : await Notifications.requestPermissionsAsync();
    if (!permission.granted) return 'denied';
  }

  let notificationId: string | null = null;
  if (enabled) {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for Little Roots 🌱',
        body: "Արջուկ is waiting for today's Armenian practice!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
      },
    });
  }
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, hour, minute, notificationId } satisfies StoredReminder));
  } catch (error) {
    if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId);
    throw error;
  }
  if (previous.notificationId) await Notifications.cancelScheduledNotificationAsync(previous.notificationId);
  return 'ok';
}

/** Call once in the app root so the reminder can appear while the app is open. */
export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
