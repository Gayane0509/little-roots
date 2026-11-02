import { expect, test } from '@jest/globals';

// Store-review guard for app.json (see AI_DECISIONS 2026-11-02 "Store config").
type Plugin = string | [string, Record<string, unknown>];
type AppJson = { expo: {
  ios: { privacyManifests?: { NSPrivacyTracking?: boolean; NSPrivacyCollectedDataTypes?: unknown[]; NSPrivacyAccessedAPITypes?: { NSPrivacyAccessedAPIType: string }[] } };
  android: { permissions?: string[]; blockedPermissions?: string[] };
  plugins: Plugin[];
} };
const { expo } = require('../../app.json') as AppJson;

test('the app never plays audio in the background (no iOS background mode, no Android foreground service)', () => {
  const audio = expo.plugins.find((plugin): plugin is [string, Record<string, unknown>] => Array.isArray(plugin) && plugin[0] === 'expo-audio');
  expect(audio?.[1].enableBackgroundPlayback).toBe(false);
  expect(audio?.[1].enableBackgroundRecording).not.toBe(true);
});
test('unused storage and overlay permissions are blocked; no extra permissions are requested', () => {
  expect(expo.android.blockedPermissions).toEqual(expect.arrayContaining([
    'android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE', 'android.permission.SYSTEM_ALERT_WINDOW',
  ]));
  expect(expo.android.permissions ?? []).toEqual([]);
});
test('the iOS privacy manifest declares no tracking, no collected data, and the required-reason APIs', () => {
  const manifest = expo.ios.privacyManifests;
  expect(manifest?.NSPrivacyTracking).toBe(false);
  expect(manifest?.NSPrivacyCollectedDataTypes).toEqual([]);
  expect(manifest?.NSPrivacyAccessedAPITypes?.map((entry) => entry.NSPrivacyAccessedAPIType).sort()).toEqual([
    'NSPrivacyAccessedAPICategoryDiskSpace', 'NSPrivacyAccessedAPICategoryFileTimestamp',
    'NSPrivacyAccessedAPICategorySystemBootTime', 'NSPrivacyAccessedAPICategoryUserDefaults',
  ]);
});
