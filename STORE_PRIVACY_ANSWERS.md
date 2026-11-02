# Store privacy answers — draft for the owner

Draft, 2026-11-02. Based on the code and `app.json` at this commit; the owner confirms each answer in App Store Connect
and Play Console (nothing is submitted by agents). Public policy text stays in `PRIVACY.md`.

## Facts the answers rest on
- No network calls in app code; no accounts, ads, analytics, crash reporting or third-party data SDKs.
- Stored on device only: child's first name, progress, optional family voice recordings (app documents folder).
- Permissions: microphone (parent area only, when a parent presses record), notifications (parent-set reminders),
  vibration (haptics). Android blocks external storage and overlay permissions; no background audio on either platform.
- The merged Android manifest still lists INTERNET (Expo/expo-file-system defaults; app code makes no network calls)
  and RECEIVE_BOOT_COMPLETED (expo-notifications, to keep reminders after a restart).
- iOS privacy manifest (`ios.privacyManifests` in `app.json`): tracking false, no tracking domains, no collected data
  types; required-reason APIs = union of what the bundled SDKs declare (FileTimestamp, DiskSpace, UserDefaults,
  SystemBootTime). Guarded by `src/lib/storeConfig.test.ts`.

## Apple — App Privacy
- Data collection: **Data Not Collected** (Apple counts data as collected only when it leaves the device).
- Tracking: **No**.
- Kids Category: no third-party analytics or advertising; no external links; the paywall (billing not live yet) is
  behind the parent gate.

## Google Play — Data safety
- Collects data: **No**. Shares data: **No**.
- Data deletion: in-app (Parent area → Reset progress, delete recordings) or uninstall.
- Encryption in transit: not applicable (nothing is transmitted).

## Owner to confirm
1. Families policy: target age groups and teacher-approved status; microphone use in a kids' app needs the in-app
   disclosure (parent area copy) and may be asked about in review.
2. Notifications target the parent, not the child — confirm the wording in Play's Families declaration.
3. A public URL for `PRIVACY.md` (required by both stores).
