# AI decisions — Little Roots

Durable decisions with reasons. Newest first. Earlier ones are summarized from `PROGRESS.md`.

- 2026-11-11 · **New themes (#144) follow one recipe.** Each theme is premium (only Family and Food stay free), has 8
  words with stable ids `<theme>.<slug>`, a Fluent 3D picture per word (256 px from microsoft/fluentui-emoji, people in
  Light tone), a drawn SVG fallback in `src/art/words/<theme>.ts`, a 4-line rhyme and a card word in `themeArt`. Copy
  that counts content (paywall "N more words") is derived from `ACTIVE_PACK`, never hard-coded. School is the first.
  **Needs native proofreading:** դպրոց · ուսուցիչ · պայուսակ · մատիտ · տետր · մկրատ · քանոն · մոմամատիտ (crayon; or
  գունավոր մատիտ) · Ես գնում եմ դպրոց։ · Պայուսակս մեջքիս է։ · Մատիտով գրում եմ տետրում։ · Ուսուցիչը ժպտում է։
  (and their transliterations).
- 2026-11-11 · **Word pictures: Microsoft Fluent Emoji 3D (#142, owner's choice; updates "No emoji pictures").** The
  owner asked for better pictures and picked Fluent 3D from a side-by-side with the drawn SVGs. 102 word pictures are
  256 px PNGs bundled in `assets/words/<theme>/<slug>.png` (MIT, `assets/words/LICENSE`; 3.5 MB), listed in
  `src/art/pictures.ts`, and `WordArt` shows them first. They are images inside the app, not emoji text, so they look
  the same on every device (the reason for #89 still holds). People and body parts use the Light skin tone (light
  skin, dark hair; owner 2026-11-11). Drawn SVGs stay for the colours and numbers themes (a paint blob / numeral with dots teaches better), for
  "family" and three letter examples Fluent lacks (walnut, ship's wheel, wheat), and as the fallback for every
  word; Buddy, icons, scenes and avatars stay drawn. The Family theme card shows mom (`themeArt`). Guard:
  `src/art/pictures.test.ts`. Limits: 256 px is soft above ~170 pt on 3× screens.
- 2026-11-04 · **Short-window rule (#84–#88).** `SHORT_WINDOW_BELOW` (700 px window height, `src/ui/tokens.ts`) is the
  one threshold for screens that should fit without scrolling (lesson, onboarding); sizes live in pure, tested helpers
  (`lessonArtSizes`, `onboardingLayout`, `traceCanvasSize`). A screen's main action must be on screen at 375×667;
  secondary actions (Skip) may scroll. Lists (Letters, Stickers, theme page) scroll by design.
- 2026-11-04 · **Grown-up prompts stay secondary (#86, #91).** On kid screens the child's action is the only orange
  button and comes first; "Ask a grown-up…" upgrade buttons use the secondary grey and sit below it (Families /
  Made for Kids guidance against pushing purchases at children).
- 2026-11-04 · **No emoji pictures (#89, #90).** Every picture a child or parent sees is drawn art in the house style;
  alphabet examples outside the themes live in `src/art/words/letters.ts` (art id `letters.<english_slug>`), and a test
  fails if a letter example has no drawing. Emoji stay only as the `WordArt` fallback and in Buddy's speech text.
  Since #99/#100 button labels are plain words (a picture goes through BigButton `icon`), guarded by
  `src/ui/noEmojiLabels.test.ts`; shared text messages (weekly share) may keep emoji.
- 2026-11-04 · **Second rhymes (#62).** A theme may have `moreSongs`; each rhyme lists the `wordIds` it uses and the
  lesson shows the rhyme that uses most of its words (ties keep `song`, so themes with one rhyme are unchanged). The
  validator checks song ids are unique, belong to the theme and list only that theme's words. New rhymes: Family
  "Together" (baby, uncle, aunt, friend), Food "Colourful food" (apricot, grapes, carrot, tomato). **Needs native
  proofreading:** Նորածինը քնած է։ · Քեռին ու մորաքույրը գալիս են։ · Ընկերս ինձ հետ խաղում է։ · Միասին ուրախ ենք։ ·
  Ծիրանը քաղցր է։ · Խաղողը կլոր է։ · Գազարը նարնջագույն է։ · Լոլիկը կարմիր է։ (and their transliterations).
- 2026-11-04 · Scene backdrops (`src/art/scenes.ts`) only on calm screens (Home, lesson reward), never behind words or
  game choices. Pale tints with no outlines so they read as background; any fill must keep `colors.text` ≥ 4.5:1
  (test). Static: no parallax or drifting clouds (battery, reduce motion, attention on content).
- 2026-11-04 · Home "Next" marker = the first unlocked theme with a word the child hasn't met (`nextNewTheme`, the same
  rule the daily lesson uses for new words). Not the review theme: reviews span themes, a marker there would jump
  around. Static (no bounce) so it guides without competing with the Start button; no marker when all words were met.
- 2026-11-03 · Web tab titles come from one web-only `<Head>` in the root layout (`src/lib/screenTitle.ts`, keyed by
  path), not per-screen `<Head>`: one place, and `expo-router/head` is never rendered on native (it can drive iOS
  Handoff/activity metadata the app doesn't need). New route files must add a title (guard test).

- 2026-11-03 · Large system text: display text (fontSize ≥ `font.title`: titles, big Armenian words, letter tiles,
  emoji art, the gate answer field) and kid button labels (`BigButton`, `IconTitle`) grow at most
  `DISPLAY_MAX_FONT_SCALE` (1.5×) with the system text size (`maxFontSizeMultiplier`); body text scales fully. Emoji
  that stand in for pixel-sized drawings (`WordArt` fallback) don't scale (`allowFontScaling={false}`), like the SVG art.
  Reason: at the largest accessibility sizes (~3×) a 44 pt word becomes ~135 pt and overflows fixed cards and buttons,
  while display text is already large. Guard: `src/ui/displayText.test.ts`.

- 2026-11-03 · Design principles (research: NN/g "Children's UX: physical development", Google "Building for kids",
  app-quality studies). Child-facing targets as large as the layout allows (aim ≈ 2 cm; never below `TOUCH_MIN`);
  every tap gets visible feedback; mistakes get a visual hint (highlight/pulse), never text-only; icons and pictures
  over words for pre-readers; visible progress (stars, stickers, theme progress); simple taps only (no precise drags
  required, no multi-finger); grown-ups have an active co-play role (reading words aloud themselves). No persuasive
  dark patterns (no streak-loss guilt, no timers pushing purchases).
- 2026-11-03 · Haptics go through `src/lib/haptics.ts` only (guard test) and follow the parent's Vibration setting
  (default on). Feedback is optional: errors are swallowed. Before settings load the default (on) applies, like sound;
  the startup splash holds until settings load, so children can't tap earlier.
- 2026-11-04 · **More words (#53).** Free themes (Family, Food) grow from 8 to 12 words, so a family without
  Premium gets more to learn; paid themes stay at 8 for now. Existing ids unchanged; new ids `family.baby/friend/uncle/aunt`,
  `food.apricot/grapes/carrot/tomato`, each with a drawing in STYLE.md. Children who finished a theme simply get its new
  words in the next lesson. **Needs native proofreading:** նորածին (noratsin, baby — or a warmer word such as
  փոքրիկ?), ընկեր (ənker, friend), քեռի (keri, uncle — mother's brother; father's brother is հորեղբայր), մորաքույր
  (morakuyr, aunt — mother's sister; father's sister is հորաքույր), ծիրան, խաղող, գազար, լոլիկ.
- 2026-11-04 · **Family voice (owner's decision; replaces "No voice").** The only voice feature allowed: behind the
  parent gate a grown-up records the app's words one by one (all words of the active language pack), and the app
  plays that recording wherever the word appears (lesson cards and game rounds, the theme page, Find the picture).
  Words without a recording stay text and pictures only. Recordings live only on the device
  (`Paths.document/voice/<child>/`, index `littleroots.voice.v1.<child>.<pack>`), per child and language like
  progress, are never uploaded, and are deleted with the recording or the child. The microphone permission is
  requested only from the parent recording screen, never in front of the child (iOS purpose string; Android
  RECORD_AUDIO no longer blocked). Still banned: speech recognition, voice input, text-to-speech, AI voices or
  cloning, voice messages, online voice services, a spoken Buddy. Rejected by the owner: AI voice cloning; staying
  voice-free. Guards: `audioSession.test.ts` now allows recording APIs only in the family-voice files and still bans
  `expo-speech`/speech recognition anywhere; `storeConfig.test.ts` checks the purpose string. No free-tier limit
  (the old 5-recording limit is not brought back). Web preview: recordings last until the page reloads (web is not
  shipped).
- 2026-11-03 · ~~**No voice**~~ (superseded 2026-11-04 by "Family voice"; its other bans still hold). Original text: The app is entirely visual and text-based: no recording,
  voice messages, voice input/speech recognition, text-to-speech, word audio or spoken Buddy, no voice buttons/icons,
  no microphone permission — and no future feature may add any. Removed: family voice (`parent/voices`, recordings
  state, 5-recording free limit, paywall row), `expo-speech`, `expo-file-system` (direct dep), bundled word audio and
  the recording kit (#17), the say-it-aloud lesson step, Buddy's replay button, hear-the-letter/word buttons.
  Listen & find became Find the picture (read the word, tap the picture); the rhyme is a read-along (tap a line to
  highlight). Kept: short optional sound effects (not voice), now respecting the iOS silent switch
  (`playsInSilentMode: false`). `expo-audio` stays for effects with `microphonePermission: false`,
  `recordAudioAndroid: false`; Android also blocks RECORD_AUDIO. No data migration: the app never shipped, so no
  device holds recordings. Guards: `audioSession.test.ts` (no speech/recording APIs or speaker/mic icons in `src`),
  `storeConfig.test.ts`. Trade-off accepted by the owner: children learn pronunciation from a grown-up reading
  with them, helped by the transliteration; the parent intro now says so.
- 2026-11-03 · ~~Recording kit~~ (superseded the same day by "No voice"; removed): `scripts/words.mjs` imports `src/content/themes.ts` directly (Node 22 strips types, no
  new dev dependency). `recording-sheet.mjs` writes `assets/audio/RECORDING_SHEET.md`; the manifest script exits 1
  on a file whose name isn't a word id. `recordingSheet.test.ts` keeps the sheet in sync with the words.
- 2026-11-03 · CI also runs `npx expo export --platform web` (catches Metro-only breakage). Every `Pressable` must
  declare `accessibilityRole` + `accessibilityLabel` (`src/ui/pressableA11y.test.ts`).
- 2026-11-03 · Share card image: use `react-native-view-shot` (SDK 58 curated 6.1.1, MIT, maintained incl. an Expo
  maintainer, ~216 KB unpacked, no permissions, writes to cache) + `expo-sharing` (RN `Share` can't send files on
  Android). Native-only; web keeps the text share. Not installed yet: it adds native modules we can't verify until
  the native build works (task #16 after #10). The image holds the same data as today's text (name, week's words) and
  is only shared when a parent taps Share — store privacy answers unchanged.
- 2026-11-03 · Per-language progress: progress/letters keys are `littleroots.{progress,letters}.v1.<child>.<pack>`
  (`progressKey(id, packId = ACTIVE_PACK.id)`). On every load each child's pre-pack key `….v1.<child>` moves to
  `.hy` (all data before packs is Armenian): copy first, remove after; if the `.hy` key already holds different data
  the old record is kept, never deleted; storage errors block the load (retry screen) rather than start a child from
  empty progress. Child deletion removes the keys of every shipped pack plus the old ones. Runs inside
  `loadProfiles`, before any progress provider mounts. Dev caveat: a Fast Refresh across this change ran the new
  key without the migration and reset the web preview's test child (cold starts can't hit this).
  2026-11-03 22:00: once the copy is confirmed identical, a failed removal of the old key is logged and retried on
  the next load instead of blocking the app (the data is already safe; review of #7).
- 2026-11-03 · Content access: screens, features and state read language content only via `@/content/packs`
  (`ACTIVE_PACK.themes/alphabet/phrases/audio`, `getTheme`, `getWord`, re-exported `Letter`/`Phrase`/`PhraseKey`).
  `@/content/types` (types) and `@/content/themeArt` (picture per theme, language-neutral) stay importable. Guarded by
  `src/content/packs/packs.test.ts`.
- 2026-11-03 · E2E: Maestro flows in `.maestro/` select by visible text/accessibility labels (no testIDs added);
  `src/lib/maestroFlows.test.ts` fails when a label they use disappears from the source.
- 2026-11-03 · npm audit (`--omit=dev`, 12 moderate, 0 high): all 12 trace to two advisories — glob 13.0.6
  (GHSA-3g3m-2fjr-6pw4, AbortSignal timeout bypass) and minimatch 10.2.6 (GHSA-g3hv-75wg-m249, globparts DoS) —
  reached only through Expo build tooling (`@expo/cli`, `config`, `config-plugins`, `fingerprint`, `metro-config`,
  `prebuild-config`, `inline-modules`, `local-build-cache-provider`; `expo` and `expo-splash-screen` are flagged as
  their parents). Web export source maps: neither glob nor minimatch is bundled; the only `@expo/cli` file shipped is
  Metro's `require` shim. They run at build time on our own project files, not on child input. `npm audit fix` has
  no non-breaking fix (only `--force` → expo 51); `overrides` to glob 14 / minimatch 11 would be major bumps under
  Expo's pinned ranges. Accepted; re-check after each `npx expo install --fix`.
- 2026-11-03 · Startup splash (`src/lib/splash.ts`, `src/features/startup/StartupGate.tsx`): the native splash is held
  at module scope and hidden once settings + progress have loaded (profiles already render nothing until loaded), so
  no default state flashes (English buddy, sound on, onboarding redirect, Home spinner). Only the first launch
  waits; after a profile switch Home's spinner shows as before. Safety timeout 4 s (a stuck splash is worse than a
  flash); the profile load-error screen and the kid error screen release it at once. Web has no native splash:
  the gate shows a plain background. Startup time = performance measure `lr:startup` (hold → `lr:providers-ready`).
  Root `__mocks__/expo-splash-screen.ts` keeps suites that partially mock `react-native` loading.
- 2026-11-02 · Store config: iOS privacy manifest in `app.json` declares no tracking/collection and the union of the
  required-reason APIs our SDKs declare (Apple doesn't reliably read static-pod manifests). expo-audio
  `enableBackgroundPlayback: false` (no `UIBackgroundModes: audio`, no Android media foreground service); Android blocks
  READ/WRITE_EXTERNAL_STORAGE and SYSTEM_ALERT_WINDOW. Added `expo-asset` (required expo-audio peer; first-party, MIT).
  Guarded by `src/lib/storeConfig.test.ts`.
- 2026-11-02 · ~~Audio session~~ (superseded 2026-11-03 by "No voice": effects-only session, silent switch respected) (`src/lib/audioSession.ts`): set once at startup — `playsInSilentMode: true` (word audio
  is the lesson; kids' devices are often on silent and parents read "no sound" as broken), `mixWithOthers` (never
  pause a parent's music; cues are short), no background playback, and word audio/TTS stop when the app goes to the
  background (not on `inactive`, so pulling down Control Center doesn't cut a word). Revisit `duckOthers` for word
  audio after a native test. Parent recording switches to `RECORDING_AUDIO_MODE` and back with
  `restorePlaybackAudioMode()`: always a complete mode, because iOS fills omitted fields with native defaults
  (`playsInSilentMode: false`) — a test guards against inline partial modes.
- 2026-11-02 · SFX: the same cue replays at most once per 120 ms; per-cue volumes (`try` 0.45, `flip` 0.5, others 0.6)
  after measuring the files (all ≈ −21 dB RMS, `tap` ≈ −24 dB), so "try again" never sounds like a scolding.
- 2026-11-02 · Crashes: root `ErrorBoundary` shows a context-free kid screen ("Oops! Let's try that again.", Try again
  / Go home), never error text; logs to console only in `__DEV__` (no crash reporting service — offline, no tracking).
- 2026-11-02 · Coordination moves to PROJECT_STATUS / AI_TASKS / AI_DECISIONS / AI_CHANGELOG; `PROGRESS.md` is the
  frozen log of the first sprint.
- 2026-11-02 · Daily sessions 18:00–01:00 Asia/Yerevan via a local scheduled task; pace by real usage limits, never
  retry past a limit; the other agent continues independent work.
- 2026-10-30 · Language packs: `LanguagePack` + `validatePack`; no language picker until a second pack has
  native-speaker content (no fake choices in the UI).
- 2026-10-30 · Contrast: text-only tokens ≥ 4.5:1; BigButton chooses label colour by contrast (`src/ui/contrast.ts`).
- 2026-10-30 · Production never grants Premium without real billing; paywall shows "Coming soon".
- 2026-10-30 · ~~Audio priority: family recording → bundled native audio → device TTS.~~ (superseded 2026-11-03: no voice)
- 2026-10-30 · Expo Router + React context, no state library; RN Animated; static typed content with tests.
- 2026-10-30 · Privacy: offline, no accounts/analytics/ads; recordings and progress stay on device; mic only in the
  parent area.

## 2026-11-04 — Buddy dress-up (#58)
- Items: party hat (3 stickers), glasses (6), crown (10). Not a scarf: the base bear already wears an orange scarf.
- Stored as optional `ProgressState.buddyOutfit`; no migration (absent = none, unknown ids dropped). A pick is shown
  only while the sticker count still unlocks it, so a progress reset takes the outfit off too.
- Rules live in `src/lib/outfits.ts` (ui and state may import lib, never features).

## 2026-11-04 — iPad orientation (#68, finding; owner to confirm)
- With `supportsTablet: true` and no `ios.requireFullScreen`, Expo adds all iPad orientations (Apple's multitasking
  rule), so iPads rotate; phones stay portrait. Layouts are checked at 1024×768 on web. No change made: switching to
  `requireFullScreen: true` is store-critical config and needs the owner. Sources: expo/fyi "ipad-requires-fullscreen",
  `@expo/config-plugins` RequiresFullScreen.

## 2026-11-04 — Wide-screen layout rule (#66–#79)
- From `WIDE_BREAKPOINT` (600 px window width) grids add columns and pictures grow with their tiles; phones (< 600 px)
  keep their exact sizes. Size grids from the content column (`min(width − 2·spacing.md, CONTENT_MAX_WIDTH)`), never
  the raw window width: the window-based Memory board wrapped to 2 columns at 1024 px (#72).
- Parent-only screens get the same treatment only where a list is long (Family voice, #76); stat cards stay as is.


## 2026-11-10 — Bundled Armenian font (#127, proposal before #117 tracing start dots)
- Problem: the tracing guide letter and letter tiles use the platform system font, so Armenian glyphs differ between
  iOS, Android and web. Start dots (#117) at fixed coordinates would sit off the stroke on some devices — worse than no dot.
- Benefit: one consistent, warm letter shape for children on every device; makes #117 placeable from known outlines.
- Candidate: `@expo-google-fonts/noto-sans-armenian` 0.4.2 (Expo-maintained, MIT code + SIL OFL-1.1 font, last
  publish 2025-09; 1.4 MB unpacked for all weights — ship only one bold weight) with `expo-font` (not yet a direct dep).
- Preferred approach: `expo-font` config plugin (embedded at build time, no startup cost) plus a web load through
  `useFonts` before `StartupGate` opens (keeps the no-flash rule, #5; `SPLASH_MAX_MS` still caps it).
- Risks: native embedding can only be checked after the Xcode update (#10); app size grows ~30–60 KB per weight.
- Success: web and native screenshots show the same glyphs; startup measure `lr:startup` not slower on web.
- Done 2026-11-10: runtime `useFonts` in `StartupGate` (works on native without a rebuild; the bare `expo-font`
  plugin added by `expo install` embeds nothing). Letters grid, letter sheet and tracing letter use it, no `fontWeight`.
  Web: all 38+38 glyphs' ink fits the 255 px canvas (top ≥ 17, bottom ≤ 216). Audit unchanged (5 moderate), doctor 20/20.
- #117 dot data must still be checked by eye per letter (an outline's first point is not a
  writing start), so #117 needs a contact sheet review after #127.

## 2026-11-10 — Weekly pacing for the hourly runs
- Last week the Claude weekly limit hit 98 % by 2026-11-05 and four days of runs could only check usage. From now on
  each hourly run budgets about 1.5 % of the weekly limit (80 % cap ÷ ~6 days ÷ 8 runs) and stops at a checkpoint when
  it reaches it, even inside the 50-minute window.
