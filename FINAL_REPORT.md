# Little Roots — final report

Little Roots is a phone app (iOS and Android, built with Expo) that teaches young children the language their family
speaks at home. Armenian is the first language. It is offline, has no ads and no tracking, and keeps every
grown-up feature behind a parent gate. Live status and history are in `PROGRESS.md`.

## What the app does

**For the child**
- **Daily lesson (5–10 minutes):** Buddy says hello, teaches 3 new words with pictures and audio, plays a quick game,
  shares a short rhyme, asks the child to say the words aloud, and gives a sticker at the end.
- **Spaced review:** each word moves through 5 levels and comes back after 1, 3, 7, 14 and 30 days.
- **Content:** 12 themes with 96 words, each with its own hand-drawn picture in one style.
- **Alphabet:** all 39 letters, with finger tracing and a score for each trace.
- **Games:** Memory match, Listen & find, Read it.
- **Sticker book and streaks.**
- **Buddy the bear (Արջուկ):** four moods. Buddy speaks every instruction, with a replay button, so children who
  can't read yet can still follow. Lines can be in Armenian + English.
- **Feedback:** sounds, haptics and gentle animations, with less motion when the phone's reduce-motion setting is on.

**For the parent**, behind an adult-level gate:
- Weekly summary and a "practice at home" list.
- A shareable text summary of the week ("Share this week").
- A full progress report (Premium).
- Family voice: record words in your own voice, kept only on the device.
- A daily reminder notification.
- Up to 4 child profiles.
- Sound and Buddy-language settings.
- A short skippable intro on the first visit.
- Reset progress.

**Free and Premium**
- **Free:** Family and Food themes, the daily lesson, 5 recordings, 6 letters to trace, 3 games a day, and the weekly
  summary.
- **Premium:** all 12 themes, the full alphabet, unlimited games and recordings, the full report, and siblings.
- The paywall headline matches what the child tapped.
- Production builds never unlock Premium without a real purchase and show "Coming soon" until the store products
  exist.

## Architecture

- **Stack:** Expo SDK 58, React Native 0.88, React 19, strict TypeScript, and Expo Router (file routes in `src/app`).
- **State:** plain React context, with no state library:
  - settings, then profiles, then recordings
  - then, for each child, progress and traced letters, stored under separate storage keys
  - writes are debounced and run one at a time; save errors show a banner with a retry
  - corrupt data falls back safely and is never overwritten
- **Learning logic:** pure functions with tests:
  - `src/lib/srs.ts` (spaced review), `lesson.ts`, `report.ts`, `streak.ts`, `entitlements.ts`
  - `src/features/*/logic|rules` (game, gate and tracing rules)
- **Content:**
  - static typed data (`src/content`) behind a `LanguagePack` interface (`src/content/packs`)
  - `validatePack` checks every shipped pack
  - pictures are SVG strings checked against a safe subset (`src/art`)
- **Audio, in priority order:** the family's own recording, then bundled native-speaker files (`assets/audio`, plus the
  `scripts/build-audio-manifest.mjs` script), then the device's text-to-speech.
- **Purchases:** a single interface in `src/lib/purchases.ts`. In development it uses a test provider; in production it
  reports purchases as unavailable until real billing is plugged in.
- **Privacy:** no accounts, analytics or ads, and no network calls. The microphone is used only in the parent area,
  and recordings stay on the device. See `PRIVACY.md`.

## Quality

- **Automated tests:** 33 suites, 135 tests. TypeScript and ESLint are clean. CI runs type-check, lint and tests on
  every push.
- **Reviews:** every wave had a cross-review (Codex ↔ Claude reviewers) plus two full audits. Fixes included:
  - an unreachable win screen
  - a way around the daily game limit
  - a scribble counting as a good trace
  - corrupt-data handling
  - recordings going silent after an iOS path change
  - navigation-stack issues
  - screen-reader labels that revealed the answer
- **Accessibility:**
  - All text colours meet WCAG 4.5:1, and button labels are checked against their backgrounds in tests.
  - Headings are marked for screen readers, and decorative art is hidden from them.
  - Text wraps at large font sizes, touch targets are at least 48 pt, and screen-reader users have a tracing
    alternative.
- **Manual checks:** every screen was exercised in the web preview, and the last pass had no errors.

## Limitations (honest)

- **Not yet run on a real device or simulator.** Expo SDK 58 needs a newer Xcode than the installed 26.3: the native
  build stops on a Swift 6 error inside an Expo module. Everything was verified in the web preview instead.
- **Speech:** most phones have no Armenian voice. Until recordings are added, words fall back to the device voice.
- **Purchases are not connected** to App Store or Play billing.
- **Second language:** only the Armenian pack exists. Screens still read the Armenian modules directly, and there is
  no language picker or per-language progress yet.
- **The share is plain text,** not an image.
- **Armenian rhymes and Buddy phrases** were written without native-speaker proofreading.

## Owner actions (I could not do these)

1. **Update Xcode,** then run `LANG=en_US.UTF-8 npx expo run:ios` and test on a device, including VoiceOver and
   TalkBack.
2. **Record the 96 words with a native speaker.** Put the files in `assets/audio/<wordId>.m4a` and run
   `node scripts/build-audio-manifest.mjs`.
3. **Create subscription products** (App Store Connect and Play Console, or RevenueCat) and plug them into
   `src/lib/purchases.ts`.
4. **App Store setup:** choose "Made for Kids" with the right age band, fill in the Play Families form, and host
   `PRIVACY.md` at a public URL.
5. **Native-speaker proofreading** of the rhymes, phrases and transliterations.
6. **Trademark check** of the name "Little Roots" in your markets.
7. **Repository visibility:** the repo is public; make it private if you prefer.

## Recommended next steps

1. Test on a device after the Xcode update, then do a TestFlight or internal-track beta with 5–10 Armenian families.
2. Studio recordings, plus recorded Buddy lines (this matters most for quality).
3. Real billing with a 7-day trial; measure the trial-to-paid rate.
4. A second language pack (Russian, Georgian or Persian, for diaspora families): wire screens to `ACTIVE_PACK`, store
   progress per language, and add a picker.
5. More content: short stories, songs with music, and a "word of the day" widget.
6. Optional family sync between parents' phones. This needs a backend and a privacy review, because it is a
   children's app.
