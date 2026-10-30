# Little Roots — progress & roadmap

Source of truth for ongoing work. Deadline: **2026-11-01 02:00 Armenia time (+04:00)**.
Any session resuming work: read this file, skip completed items, take the top unfinished ones, update this file and
commit + push after each tested milestone. Validate with `npx tsc --noEmit && npx eslint . && npx jest --watchman=false`
on Node 22 (`source ~/.nvm/nvm.sh && nvm use`).

## Product

Kids (3–8) learn their family's language (Eastern Armenian first) in 5–10 minutes a day; parents pay for more content.
Free: Family + Food themes. Paid: everything else. Offline, no ads, no accounts, no tracking (COPPA / Kids category).

## Completed

- **v0.1 MVP** (2026-10-30): daily lesson (hello → 3 new words → find-the-picture → song → speak → reward), Leitner
  spaced repetition across themes, 6 themes × 8 words + rhymes, buddy Արջուկ, onboarding, parent gate, weekly parent
  report, dev-only paywall stub, local persistence. 19 tests.
- Node 22 pinned (`.nvmrc`), `expo-audio` + `expo-file-system` installed, mic permission text configured.

## Roadmap (priority order)

### Wave 1 — learning quality & trust (done 2026-10-30)
- [x] W1-A Lesson engine: reducer/state machine, success feedback (animation + haptics) before advancing, lesson credit
      saved once the game is done (closing early no longer loses stars/streak), review-only lesson when many words are
      due, shared `currentStreak` for home + report, game a11y labels that don't reveal answers.
- [x] W1-B Family voice: parents record words in their own voice (parent area), lesson plays recording → device voice
      fallback; detect missing Armenian voice and guide parents to record.
- [x] W1-C Content & navigation: 6 new paid themes (clothes, home, toys, nature, transport, feelings), Armenian
      alphabet (39 letters) + Letters screen, theme detail screen (word list, tap to hear), sticker book, adult-level
      parent gate re-checked on focus, in-app privacy policy.
- [x] Architect: CI (GitHub Actions: tsc, eslint, jest), README.

### Wave 2 — polish & store readiness
- [x] App icon + splash screen (original sprout-with-roots art, Android adaptive + monochrome), expo-splash-screen configured.
- [x] Paywall honesty + purchases interface (src/lib/purchases.ts: dev provider, production 'unavailable'; plug
      RevenueCat/StoreKit in once store products exist — owner action).
- [x] Daily reminder (local notification, parent opt-in, time presets; hidden on web; Android notification icon).
- [x] Performance: split progress state/actions contexts, 120-day history, debounced batched writes with flush.
- [x] Storage error surfaced to parents with retry (banner in parent area).
- [ ] Verify on iOS simulator (Expo Go / dev build) incl. large text sizes.

### Wave 2.5 — illustrations (owner request: replace emoji with real pictures)
- [x] Hand-drawn SVG illustrations for all 96 words (src/art, style in src/art/STYLE.md, QA via
      `node scripts/render-art.mjs <theme>`), WordArt component with emoji fallback, used in lesson, games, theme pages,
      stickers, parent lists.

### Wave 4 — subscription value (owner request; queued after Wave 3)
Free: Family + Food, full daily lesson, 5 family-voice recordings, trace first 6 letters, 3 games/day, weekly
summary, stickers, reminders. Premium: all 12 themes, unlimited recordings, trace all 39 letters, unlimited games,
full parent report (every word, mastery by theme, weekly history). Paywall moments (always behind the parent gate):
locked theme, free words finished, 4th game of the day, 6th recording, full report. Pricing: yearly $34.99
("$2.92/month"), monthly $4.99, 7-day free trial (store config). Rules live in src/lib/entitlements.ts.
- [x] Gate games/day (incl. Play again), recordings (re-record allowed), tracing via entitlements; full parent report
      (/parent/report: every word, mastery stars, theme bars, 8 rolling weeks); paywall redesign with reason-tailored
      headline kept through the gate, Free vs Premium table; "free words finished" moment on home + lesson.

### Wave 6 — delight & immersion (done)
- [x] Original synthesized sound effects (correct, try, reward, flip, tap, star) with parent on/off.
- [x] Buddy speaks Armenian + English (parent setting): 24 child-facing phrases, native-style imperatives.

### Wave 7 — audit #2 fixes (done)
- [x] Buddy speaks its instructions (auto + 🔊 replay; Armenian voice when available) for pre-readers.
- [x] Bundled native-audio pipeline: put recordings in assets/audio/<wordId>.m4a, run
      `node scripts/build-audio-manifest.mjs`; priority family voice → bundled → device TTS.
- [x] Downgrade rules (extra children locked, games use only unlocked words), games unlock after 1st lesson and
      count when started, memory cards speak on flip, recordings index read-failure safe, reset scope accurate,
      audio stopped on exit, virtualized parent lists, tracing batched per frame, theme page "Start a lesson".

### Wave 3 — differentiation
- [x] Games area: memory match, listen & find, read it (feed spaced repetition).
- [x] Letter tracing (5–8): trace canvas, forgiving score, traced stars, persisted. Reviewed and fixed (gesture capture, scribble guard, storage).
- [x] Illustrated bear buddy (4 moods, idle bounce, reduce-motion aware); theme cards use word art.
- [x] Child profiles (up to 4; 1 free): per-child progress/letters/stickers, family-level premium + recordings,
      safe migration from single-child saves, serialized mutations, guaranteed deletes, parent management screen.
- [ ] Second language pack (architecture for Russian / Georgian / Persian).

## Decisions

- Expo Router + plain React state/context; no state library. RN `Animated` for animations (no Reanimated dependency
  unless needed). Content is static TS data with tests.
- Recordings are stored only on the device (document directory); mic used only in the parent area.
- Child-facing instructions in English for now; Armenian content is the learning target.

## Known issues / owner actions

- Device TTS often lacks Armenian → family recordings (W1-B) and, before launch, native-speaker studio recordings.
- Real in-app purchases need App Store Connect / Play Console products (owner).
- Song lines are original; have a native speaker proofread before launch.
- Privacy policy must also be hosted on a public URL for store listings (owner).
- Native iOS build fails with Xcode 26.3 (Swift 6.2 data-race error inside expo-modules-jsi); Expo SDK 58 needs a
  newer Xcode → owner: update Xcode, then `LANG=en_US.UTF-8 npx expo run:ios`. Expo Go download also hung.
  Until then UI is verified in the web preview (`npx expo start --web`). Tried forcing Swift 5 for the pod via a
  Podfile hook — the podspec still compiles with -swift-version 6, so this needs the Xcode update (no workaround kept).
- Disk was full (freed ~18 GB of caches with owner approval); keep an eye on free space for native builds.

## Log

(Times from git commits, Armenia time.)

- 2026-10-30 (+04): Wave 7 merged (audit #2: 16 fixes); 123 tests.

- 2026-10-30 16:55 (+04): Wave 6 merged (sounds, settings, Armenian Buddy phrases); 115 tests; Armenian mode verified.

- 2026-10-30 16:48 (+04): Wave 5 (profiles + purchases interface) merged after data-safety review (12 findings
  fixed); 104 tests; live migration verified in preview. Native Swift-5 workaround tried and removed.

- 2026-10-30 16:31 (+04): Waves 3+4 merged after 2 reviews (14 findings fixed). 85 tests. Pushed.

- 2026-10-30 16:15 (+04): Wave 3 (buddy art + tracing) built by Codex, reviewed (9 findings); Codex now running
  review fixes + Wave 4 subscription features in one pass (thread 01a18cb1). Not yet committed.

- 2026-10-30 16:02 (+04): 96 original SVG illustrations (reviewed sheet by sheet; colours redone twice → crayons;
  horse + nose redrawn), wired into lesson, games, theme pages, stickers, letters, parent lists. 63 tests.

- 2026-10-30 15:54 (+04): Wave 2 merged after cross-review (12 findings fixed): games, reminders, reliability; 59 tests.
  CI green on GitHub for Wave 1. Owner asked for real pictures instead of emoji → Wave 2.5.

- 2026-10-30 15:43 (+04): Wave 1 merged after cross-review (Codex↔Claude, 20 findings fixed); 38 tests; verified in web
  preview: onboarding, letters, lesson success feedback, credit saved when leaving after game, theme page, gate (19×7),
  family voice screen. Native build blocked by Xcode version.

- 2026-10-30 15:10 (+04): CI, README, icon set + splash done; W1 workers running.

- 2026-10-30 14:45 (+04): roadmap created from Codex audit; Wave 1 started.
