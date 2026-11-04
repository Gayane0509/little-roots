# Store privacy answers — draft for the owner

Draft, 2026-11-02; updated 2026-11-03 (voice features removed) and 2026-11-04 (family voice recordings added). Based on the code and `app.json` at this commit; the owner confirms each answer in App Store Connect
and Play Console (nothing is submitted by agents). Public policy text stays in `PRIVACY.md`.

## Facts the answers rest on
- No network calls in app code; no accounts, ads, analytics, crash reporting or third-party data SDKs.
- Stored on device only: children's first names, progress and settings (AsyncStorage), and family voice recordings
  (audio files a grown-up records of the app's words, in the app's documents folder). Nothing is uploaded.
- Permissions: notifications (parent-set reminders), vibration (haptics) and **microphone, for family voice only**:
  iOS `NSMicrophoneUsageDescription` from `expo-audio`'s `microphonePermission` purpose string, Android RECORD_AUDIO.
  It is requested only on the parent-gated Family voice screen when a grown-up taps Record. Audio is stored on the
  device, played back locally, never transmitted; no speech recognition, text-to-speech or voice services. External
  storage and overlay permissions are blocked; no background audio.
- The merged Android manifest still lists INTERNET (Expo defaults; app code makes no network calls)
  and RECEIVE_BOOT_COMPLETED (expo-notifications, to keep reminders after a restart).
- iOS privacy manifest (`ios.privacyManifests` in `app.json`): tracking false, no tracking domains, no collected data
  types; required-reason APIs = union of what the bundled SDKs declare (FileTimestamp, DiskSpace, UserDefaults,
  SystemBootTime). Guarded by `src/lib/storeConfig.test.ts`.

## Apple — App Privacy
- Data collection: **Data Not Collected** (Apple counts data as collected only when it leaves the device; family voice
  recordings never leave it).
- Tracking: **No**.
- Kids Category: no third-party analytics or advertising; no external links; the paywall (billing not live yet) is
  behind the parent gate.

## Google Play — Data safety
- Collects data: **No**. Shares data: **No**. (Play counts data processed only on the device as not collected; the
  family voice audio is never transmitted.)
- Data deletion: in-app (Parent area → Reset progress, delete a recording in Family voice, or delete a child in
  Children, which also deletes that child's recordings) or uninstall.
- Encryption in transit: not applicable (nothing is transmitted).

## Age rating (draft, 2026-11-04)
- Apple now asks more age-rating questions (including in-app controls and age assurance) and shows content labels on the
  product page. Facts for the answers: no violence, scary, mature or gambling content; no user-generated content shared
  between users (family voice recordings stay on the device and are heard only on it); no chat, messaging or web
  browsing; no external links for children. In-app controls: the parent gate guards settings, family voice, reminders,
  sharing and the paywall. Age assurance: none (no accounts, nothing age-restricted); the Declared Age Range API is not
  needed. Expected result: 4+ in the Kids Category (age band chosen by the owner).
- Google Play (IARC questionnaire): same facts; expected "Everyone" / PEGI 3. Play's 2026 Families changes (anonymous
  chat apps, Contacts permission) don't apply: no chat, no contacts access.
- Owner to confirm the exact questions on the forms when submitting; this draft was written from Apple's and Google's
  developer pages, not from the live forms.

## Owner to confirm
1. Families policy: target age groups and teacher-approved status. The app uses the microphone (parent-only family
   voice, on-device): confirm Play's Families/permissions declaration describes it as a parent feature and that audio
   is not collected; Apple review notes should say the microphone is used only behind the parent gate.
2. Notifications target the parent, not the child — confirm the wording in Play's Families declaration.
3. A public URL for `PRIVACY.md` (required by both stores).
