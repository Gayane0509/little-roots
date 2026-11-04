# AI changelog — Little Roots

Newest first. Each entry: date · agent(s) · what changed · files · checks · commit.

## 2026-11-04 (bigger lesson word picture on tablets, #75)
- claude · The lesson's word card picture grows 160 → 220 px when the window is ≥ 600 px wide and ≥ 700 px tall (so
  Next stays on screen); phones unchanged.
- Files: `src/app/lesson.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 59 suites / 245 tests ✓. Web 1024×768: picture 220 px, Next button top at 672 px,
  no scroll. Lesson left before the end (no progress recorded).
- Commit: see git log ("Bigger lesson word picture on tablets").

## 2026-11-04 (drawn lock on the parent gate, #74)
- claude · The parent gate's 🔐 system emoji (differs per platform) is now the drawn `lock` icon (72 px), hidden from
  screen readers as before. Children see this screen, so it follows the drawn-icons rule (#29/#35).
- Files: `src/app/parent-gate.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 59 suites / 245 tests ✓. Web: gate at 375 px shows the drawn lock, layout unchanged.
- Commit: see git log ("Drawn lock on the parent gate").

## 2026-11-04 (letters grid on wide screens, #73)
- claude · From 600 px the Letters page shows 6 near-square tiles a row (was 4 long flat ones) with bigger letters
  (46 / 30 px, was 34 / 22): 7 rows instead of 10 at 1024 px. Phones unchanged. The lowercase letter now caps its
  growth with large system text too (`DISPLAY_MAX_FONT_SCALE`, caught by the display-text guard test).
- Files: `src/app/letters.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 59 suites / 245 tests ✓ (the guard failed once before the cap was added). Web:
  1024×768 → 108×108 px tiles, 7 rows; 600 px → 85×108, no overflow; 375 px → 77×88, 10 rows (as before); no console
  errors.
- Commit: see git log ("Letters grid fits wide screens").

## 2026-11-04 (memory board fits wide screens, #72)
- claude · Bug: Memory card widths came from the window, not the 720 px content column, so at 1024×768 only 2 cards
  fit a row (6 rows of flat 324×109 cards, board scrolled). New `memoryLayout` sizes cards from the content column;
  from 600 px the board has 4 columns and 120 px pictures. Phones unchanged (3 columns, 72 px pictures).
- Files: `src/features/games/memoryLayout.ts` (+ test), `src/features/games/MemoryGame.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 59 suites / 245 tests ✓. Web: 1024×768 → 12 cards in 4×3 (173×148 px, 120 px art,
  no scroll); 375×812 → 3 columns, 108×119 px, 72 px art (as before). Test child's game count reset for the check
  and restored afterwards.
- Commit: see git log ("Memory board fits wide screens").

## 2026-11-04 (bigger answer pictures on wide screens, #71)
- claude · From 600 px the lesson's answer pictures grow 88 → 120 px and the Find game's 80 → 112 px.
- Files: `src/app/lesson.tsx`, `src/features/games/ChoiceGame.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 58 suites / 241 tests ✓. Web: lesson round at 1024×768 (4 options fit). Find game not
  replayed (free-game limit reached for today in the preview). Test child's data restored afterwards.
- Commit: see git log ("Bigger answer pictures on wide screens").

## 2026-11-04 (emoji-free spoken button labels, #70)
- claude · `BigButton` gives screen readers the label without decorative emoji or ▶ (`ui/spokenLabel`); the visible
  text keeps them. Affects Parent home buttons and the theme page's "▶ Start a lesson".
- Files: `src/ui/spokenLabel.ts` (+ test), `src/ui/BigButton.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 58 suites / 241 tests ✓. Web: theme button `aria-label` "Start a lesson". Parent area
  at 320 px: no horizontal overflow (checked through the gate).
- Commit: see git log ("Emoji-free spoken button labels").

## 2026-11-04 (theme page fits wide screens, #69; iPad orientation finding, #68)
- claude · Theme page shows 3 word cards a row with 120 px pictures from 600 px (phones keep 2 a row, 84 px).
  Research: on iPad the app rotates (Expo adds every iPad orientation unless `requireFullScreen`); landscape layouts
  fit at 1024×768; owner decision logged (#68), no config change.
- Files: `src/app/theme/[id].tsx`; notes.
- Checks: tsc ✓, ESLint ✓, Jest 57 suites / 238 tests ✓. Web: Food theme at 375 + 1024 px.
- Commit: see git log ("Theme page fits wide screens").

## 2026-11-04 (lesson reward announces a new outfit, #67)
- claude · When a lesson's new sticker unlocks a dress-up item, the reward screen adds "New for Արջուկ:" with Buddy
  wearing it; the screen reader hears "New for Little Bear: glasses. Dress up Little Bear in the sticker book."
- Files: `src/lib/outfits.ts` (+ test), `src/app/lesson.tsx`, `src/features/stickers/OutfitPicker.tsx` (exports
  `OutfitPortrait`).
- Checks: tsc ✓, ESLint ✓, Jest 57 suites / 238 tests ✓. Web (375 px): 5 → 6 stickers shows the glasses row; 6 → 7
  shows none. Test child's data restored afterwards.
- Commit: see git log ("Lesson reward announces a new outfit").

## 2026-11-04 (sticker book fits wide screens, #66)
- claude · The sticker book uses 4 columns from 600 px and sizes each drawing from its tile (78 %, 60–140 px), so
  stickers no longer sit small in big empty cards on tablets; rows stay whole.
- Files: `src/features/stickers/stickerGrid.ts` (+ test), `StickerTile.tsx`, `src/app/stickers.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 57 suites / 237 tests ✓. Web: 320 / 375 / 1024 px; no console errors.
- Commit: see git log ("Sticker book fits wide screens").

## 2026-11-04 (Buddy dress-up, #58)
- claude · Stickers unlock dress-up items for Արջուկ: party hat at 3 stickers, glasses at 6, crown at 10. The child
  picks one (or "No dress-up") on the Stickers screen; Buddy wears it on Home and in the lesson. Locked tiles show a
  lock and the stickers still needed. Stored as optional `buddyOutfit` (per child + language like all progress).
- Files: `src/art/buddy.ts` (+ test), `src/lib/outfits.ts` (+ test), `src/features/stickers/OutfitPicker.tsx`
  (+ render test), `src/state/progress.tsx`, `progress.types.ts` (+ test), `src/ui/Buddy.tsx`, `src/app/stickers.tsx`,
  `src/app/index.tsx`, `src/app/lesson.tsx`.
- Review: reviewer subagent (Codex still blocked, #11) → picker tiles under 64 px at 320 px (fixed: 2×2 grid below
  360 px, portrait scales with tile) and hat pom-pom clipped by the viewBox (fixed: hat lowered). Stored data: no
  findings (older saves load unchanged; reset clears the outfit).
- Checks: tsc ✓, ESLint ✓, Jest 56 suites / 234 tests ✓. Web: Stickers at 320 / 375 / 1024 px, picking the hat saves
  `buddyOutfit: "hat"` and Home Buddy wears it; contact sheet of 7 poses × 3 outfits; no console errors.
- Commit: see git log ("Buddy dress-up").

## 2026-11-04 (hills scene on game finish screens, #63)
- claude · Find, Read and Memory report when they show their finish screen (`onFinishedChange`); `GameShell` then
  draws the hills scene behind it, and removes it on Play again. Play screens stay plain.
- Files: `src/features/games/GameShell.tsx` (+ `GameShell.render.test.tsx`), `ChoiceGame.tsx`, `MemoryGame.tsx`,
  `src/app/games/{find,read,memory}.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 54 suites / 224 tests ✓. Web: Find played to the end at 375 px → hills behind the score
  screen. Mid-game "no scene" covered by the render test only (today's free-game limit blocked a replay in the preview).
- Commit: see git log ("Hills behind game finish screens").
- Also: #58 dress-up planned in AI_TASKS (state field, unlock rule, picker, overlay art, checks); not started — it
  changes stored data and needs a review, which did not fit this run.

## 2026-11-04 (research: store rules + learning evidence, #64/#65)
- claude · Research only, no app code. Apple: expanded age-rating questions and content-control labels, Declared Age
  Range API (not needed: no accounts). Google Play: 2026 Families changes target anonymous chat apps and Contacts
  permission (not applicable). Learning: spaced retrieval helps preschool word learning, including recognising the word
  in new pictures → idea #65. Age-rating facts drafted in `STORE_PRIVACY_ANSWERS.md`.
- Sources: developer.apple.com/kids, support.google.com/googleplay/android-developer/answer/9893335,
  pubmed.ncbi.nlm.nih.gov/2010724.
- Files: `STORE_PRIVACY_ANSWERS.md`, `AI_TASKS.md`. Checks: `npm run check` ✓ (docs only).
- Commit: see git log ("Research: age-rating draft").

## 2026-11-04 (second rhymes for Family and Food, #62)
- claude · Themes can carry more rhymes (`moreSongs`); each rhyme lists the words it uses (`wordIds`) and the lesson
  shows the one that uses most of that lesson's words, ties keeping the first rhyme. Family gets "Together" (baby,
  uncle, aunt, friend), Food "Colourful food" (apricot, grapes, carrot, tomato). The pack validator now checks every
  rhyme (unique id, own theme, known word ids, no empty line). Armenian lines listed in AI_DECISIONS for proofreading.
- Files: `src/content/types.ts`, `src/content/themes.ts`, `src/content/packs/validate.ts` (+ 2 tests in
  `packs.test.ts`), `src/lib/lesson.ts` (`pickSong`, + 2 tests in `lesson.test.ts`).
- Checks: tsc ✓, ESLint ✓, Jest 53 suites / 223 tests ✓. Web: a Food lesson (bread, milk, apple) still shows "Yummy
  food" with its 4 lines; the new-rhyme path is covered by unit tests only (the preview child hasn't reached words
  9–12).
- Commit: see git log ("Second rhymes").

## 2026-11-04 (Buddy poses and idle blink, #56)
- claude · Արջուկ gets three new poses in the same style: `wave` (raised paw + motion lines) greets on Home, `point`
  (arm out, eyes following) on the lesson's "Find the picture", `proud` (happy closed eyes, two gold stars) on the lesson
  reward. Idle blink: a lid overlay (fur patch + curved line) shown for 140 ms every 4.5 s on a native-driver opacity
  loop; only moods with open eyes; none under reduce motion or on covered screens (same rule as the bounce). No sound.
- Files: `src/art/buddy.ts` (moods, `BUDDY_BLINK`, `BuddyMood`), `src/art/buddy.test.ts` (7 moods, poses distinct,
  lids sit on that mood's eyes), `src/ui/Buddy.tsx`, `src/ui/Buddy.blink.test.ts` (≥ 4 s apart, ≤ 200 ms, reduce-motion
  guard), `src/app/index.tsx`, `src/app/lesson.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 53 suites / 219 tests ✓. Web: wave on Home, point in the lesson game, proud on the
  reward (each cloned at 260 px to inspect); blink measured on Home: lids at 3.1 s and 7.7 s, 130–155 ms each. Console:
  only Chrome's "vibrate blocked" for scripted clicks. Native look not checked (#10).
- Commit: see git log ("Buddy waves, points and beams").

## 2026-11-04 (scene backdrop on Home and the lesson reward, #55)
- claude · A soft hills scene (cloud, tree, flowers; pale palette tints, no outlines) is drawn along the bottom of Home
  and the lesson reward, behind everything (no touch, hidden from screen readers, static). Height = 30% of the window
  width, capped at 240; `xMidYMax slice` keeps the bottom on wide screens. Home's scroll content is padded by that
  height so the last theme cards rest above the hills. Lesson, game and word screens stay plain.
- Files: `src/art/scenes.ts` (+ `scenes.test.ts`: SVG rules, `colors.text` ≥ 4.5:1 on every fill),
  `src/ui/SceneBackdrop.tsx` (+ `SceneBackdrop.test.ts`), `src/ui/Screen.tsx` (`scene` prop), `src/app/index.tsx`,
  `src/app/lesson.tsx`, `src/features/errors/KidErrorScreen.test.tsx` (stubs the backdrop like it stubs `Icon`).
- Checks: tsc ✓, ESLint ✓, Jest 52 suites / 216 tests ✓. Web: Home at 375 px (top and scrolled to the end) and
  1024 px; a full lesson run to the reward at 375 px; no app console errors (only Chrome's "vibrate blocked" for scripted
  clicks). Device rendering of `preserveAspectRatio` on SvgXml not checked (#10).
- Commit: see git log ("Soft hills scene").

## 2026-11-04 (Home "Next up" marker, #57)
- claude · The theme the next new words come from gets a small Buddy badge with a "Next" ribbon and a darker border
  (static, no motion); its screen-reader label starts with "Next up:". One rule, `nextNewTheme` in `src/lib/lesson.ts`,
  is shared with `buildDailyLesson`, so the marker always matches where "Start today's lesson" takes new words from.
  No marker once every unlocked word was met.
- Files: `src/lib/lesson.ts` (+ 3 tests in `lesson.test.ts`), `src/features/home/ThemeCard.tsx`, `src/app/index.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 50 suites / 213 tests ✓. Web: exactly one marker (Family, 8/12) at 800 px and
  375 px; ribbon fits the card; no console errors. No independent review: Codex blocked (#11), small low-risk diff.
- Commit: see git log ("Home shows where to continue").

## 2026-11-04 (first-lesson tap hint, #59)
- claude · A drawn pointing hand (new `point` icon: skin-tone hand, blue cuff, yellow tap ripples) bobs over the
  picture on the first word card of a child's first lesson and disappears on the first tap of the card. "First
  lesson" = no finished lesson in that child's progress, so each child sees it once and nothing new is stored. Reduce
  motion → a still hand. Decorative only (hidden from screen readers, no touch target).
- Files: `src/ui/TapHint.tsx` (+ render test), `src/features/lesson/tapHint.ts` (+ test), `src/art/icons.ts`,
  `src/ui/Wiggle.tsx` (`onTap`), `src/app/lesson.tsx`.
- Checks: `npm run check` ✓ (50 suites / 210 tests). Web: new child on a fresh origin → hand on the first card at
  375 and 768 px, gone after a tap, no console errors. Committed.

## 2026-11-04 (parent weekly report, #54)
- claude · Parents → This week now opens with one plain sentence ("Mari learned on 4 of 7 days and met 6 new words.
  Try the 3 words below together."; separate lines for a quiet week and for not started). New "New this week" grid
  shows the week's words with pictures (8 shown, "and N more"). "Practice at home" → "Practice together": 3–5 words,
  shaky ones first (box 0, then 1, by accuracy), filled from this week's words, with a how-to line.
- Files: `src/lib/report.ts` (+ `weeklySummary`, `WeeklyReport` type), `src/lib/report.test.ts` (3 new tests),
  `src/app/parent/index.tsx`.
- Checks: `npm run check` ✓ (205 tests). Web: Parents screen at 375 and 768 px, no overflow, no console errors.
  Committed.

## 2026-11-04 (more words, #53)
- claude · Family and Food (the free themes) grow from 8 to 12 words: baby, friend, uncle, aunt; apricot, grapes,
  carrot, tomato. Each has a new drawing in the house style (people share the family look; food has faces). Ids of
  existing words unchanged; Family voice count now "of 104". Proofreading list in AI_DECISIONS. Rhymes → #62.
- Files: `src/content/themes.ts`, `src/art/words/{family,food}.ts`, `src/content/content.test.ts` (12 in free
  themes), `src/features/report/reportData.test.ts` (mastery derived from theme size).
- Checks: `npm run check` ✓ (202 tests). Web: new cards in a Family lesson at 375 px; all 8 drawings on the Family
  voice list at 768 px; no console errors. Committed.

## 2026-11-04 (picture quality, #52)
- claude · Reviewed all 96 word pictures side by side (contact sheet). Most already follow STYLE.md; redrew the
  weakest in the same style: horse (friendly front face with mane and blaze, was a realistic side head), bird (round
  front-facing bird with belly, wings and feet), nose (face with a big highlighted nose instead of arrows), foot
  (sole with five toes and a face); gloves get finger lines. Bike: the frame polyline had an `M` in `points` (console
  error, stroke missing) → path. Buddy reviewed: on-style; new poses stay #56; backgrounds stay #55.
- Files: `src/art/words/{animals,body,clothes,transport}.ts`, `src/art/art.test.ts` (new test: polyline/polygon
  points must be plain numbers).
- Checks: tsc ✓, ESLint ✓, Jest 48 suites / 202 tests ✓. Web (localhost:8095): redrawn pictures on the Family voice
  list at 375 and 768 px, no console errors, no horizontal overflow. Nothing committed.

## 2026-11-04 (owner request: Family voice, #60)
- claude · Owner replaced "No voice" with **Family voice** (AI_DECISIONS 2026-11-04): a grown-up records the app's
  words behind the parent gate; the app plays them wherever the word appears; on-device only; TTS, speech
  recognition, AI voices/cloning, voice messages, online voice services and a spoken Buddy stay banned.
- New: `src/app/parent/voice.tsx` (word picture, Armenian, transliteration; record / stop (auto-stop 5 s) / play /
  re-record / delete with inline confirm; "N of 96 recorded"; theme filter chips with per-theme counts; mic permission
  asked here only, Open Settings when denied), `src/state/familyVoice.tsx` (per child + language index
  `littleroots.voice.v1.<child>.<pack>`, files in `Documents/voice/<child>/`, stale/unsafe entries dropped),
  `src/lib/voiceFiles.ts`, `src/ui/VoiceButton.tsx` (+ `useAutoPlayWord`), drawn `voice` icon, root
  `__mocks__/expo-file-system.ts`. `expo-file-system` re-added via `npx expo install`.
- Playback: lesson word cards (tap + auto-play), lesson game rounds and Find the picture (auto-play once + voice
  button), theme page cards (tap); recorded cards show a small voice badge. Unrecorded words: unchanged (tap sound).
- Cleanup: deleting a recording deletes its file; re-recording replaces the old file; deleting a child removes its
  voice key and folder (profiles test). Reset progress keeps recordings.
- Permissions: `app.json` microphone purpose string; Android RECORD_AUDIO no longer blocked (introspect shows
  NSMicrophoneUsageDescription + RECORD_AUDIO). Guards rewritten, not weakened: speech/TTS/voice-service APIs and
  speaker/mic emoji still banned everywhere; recording APIs allowed only in `parent/voice.tsx` + `audioSession.ts`;
  store test checks the purpose string.
- Docs: PRIVACY.md + in-app privacy (effective 2026-11-04), STORE_PRIVACY_ANSWERS.md, README, FINAL_REPORT note,
  parent intro step "Your voice, their words", parent area entry, RESEARCH.md rule line.
- Checks: tsc ✓, ESLint ✓, Jest 48 suites / 201 tests ✓. Web (localhost:8095, synthetic mic stream): record,
  auto-stop, manual stop, play, delete + confirm, progress/filter counts, badge + playback on the theme page,
  unrecorded card plays only the tap sound, Find auto-plays the recorded word and shows its voice button only for
  it, 375 px no overflow. Native check → #61 (blocked on Xcode). Nothing committed.

## 2026-11-04 (07:50, owner priorities)
- claude · Owner approved four top priorities → #51–#54 at the top of the todo list (competitor study, picture
  quality, more content, clearer parent weekly report).
- claude · #51 competitor study done: `RESEARCH.md` (Duolingo ABC, Khan Academy Kids, Gus on the Go, Lingokids,
  Endless Alphabet, Sago Mini/Toca Boca; sources listed). Findings → #55 scene backgrounds, #56 more Buddy poses,
  #57 "Next up" marker on Home, #58 Buddy dress-up rewards, #59 first-lesson tap hint; rejected: speech grading/mic,
  onboarding accounts and surveys, paywall overlays, child-facing streak pressure, constant floating rewards.
- Docs only, no code change; gate not re-run (last green 00:05). Nothing committed (owner's approval rule).

## 2026-11-04 (00:00 run)
- Codex still unavailable (#11: `~/.codex/config.toml` unchanged, model `gpt-6-sol`); Claude at 26 % of the 5-hour limit and 20 % weekly.
- claude · Robustness check (no change): every AsyncStorage write (progress, settings, letters, profiles) handles
  failures and shows a save error; progress is saved when the app goes to the background (AppState).
- claude · Screen-reader language check → #50 (blocked on the #10 device check; no code change).
- Checks (working tree): tsc ✓, ESLint ✓, Jest 46 suites / 189 tests ✓; web: Home and the lesson start screen
  render with no console errors. Nothing committed (owner's approval rule).

## 2026-11-03 (23:00 scheduled run)
- claude · #48 Confetti pieces unmount when the burst finishes instead of staying mounted (invisible) while a reward
  screen is open. `src/ui/Confetti.tsx`; new `src/ui/Confetti.render.test.tsx` (unmount after finish; stop on unmount,
  no late state update). Web (localhost:8095): lesson reward shows 22 pieces, 0 after the burst; reward screen unchanged.
- claude · #43 (titles part) Web tab title per screen: `src/lib/screenTitle{,.test}.ts` (title map + test that every
  route file under `src/app` has a title), one `<Head>` from `expo-router/head` in `src/app/_layout.tsx`, rendered on
  web only (no iOS Handoff/activity side effects). Web: `/letters` → "Letters · Little Roots", Back → "Home · Little Roots".
  Focus move left as #49 (lowest).
- claude · Audit (no change): timers, animation loops, persisted lists (lesson history capped by `recentLessons`), sound
  players (6, one per cue, reused) — nothing unbounded.
- Codex probe: still rejects `gpt-6-sol` (#11); no Codex work or review this run.
- Checks: tsc ✓, ESLint ✓, Jest 46 suites / 189 tests ✓. Web console: only known preview warnings (notifications
  listener, native-driver fallback). Not committed (owner's explicit approval needed).

## 2026-11-03 (22:00 scheduled run)
- claude · #44 Battery: Buddy pauses its endless bounce while its screen is covered. New `src/ui/useScreenFocused{,.test}.ts`
  (expo-router `useIsFocused`, counts as focused outside a navigator); `src/ui/Buddy.tsx` stops the loop when unfocused.
  Web (localhost:8095): with the lesson open, Home's covered Buddy has no running animation, the lesson Buddy runs; back on
  Home it runs again. Note: the browser pane throttles rAF when not in front, so transform samples are unreliable there;
  checked via the Animated value's attached animation instead. Device battery not measured (#10).
- claude · #45 Touch-target audit (web, 390 px, 9 screens): no button/link/input under 48 × 48. No change.
- claude · #43 checked: expo-router ignores Stack `title` for the web tab title (needs `expo-router/head` per screen); left low.
- claude · Timer audit: every setTimeout/setInterval in games, lesson, gate is cleared on unmount. No change.
- reviewer subagent (Opus; Codex still blocked, #11) · #46 review of #7 migration: nothing blocking. Fixed the low finding:
  `src/state/profiles.tsx` `moveToPackKey` — a failed removal of the old key after a verified copy is logged and retried
  next load instead of blocking the app. Tests in `src/state/profiles.test.tsx`: cleanup failure then retry, letters
  conflict keeps the old record (mutation check: old code fails the new test). Finding 2 → #47 (owner decision).
- Checks: tsc ✓, ESLint ✓, Jest 44 suites / 185 tests ✓. Web: Home, lesson, Letters, games, theme, stickers, profiles render;
  only console errors are Chrome blocking `navigator.vibrate` after scripted (non-user) clicks. Not committed (owner's
  explicit approval needed).

## 2026-11-03 (21:00 scheduled run)
- claude · #39 Large system text: `DISPLAY_MAX_FONT_SCALE` (1.5) in `src/ui/tokens.ts`; `maxFontSizeMultiplier` on
  every display-sized Text (≥ 30 pt) — `app/{games/index,lesson,letters,onboarding,profiles,parent-gate,theme/[id]}`,
  `app/parent/{children,index,intro,paywall,privacy,reminders,report,settings}`, `features/games/ChoiceGame`,
  `features/letters/LetterDetail`, `features/stickers/StickerTile` — plus `ui/BigButton`, `ui/IconTitle` and the gate
  answer `TextInput`; `ui/WordArt` emoji fallback `allowFontScaling={false}`. Guard `src/ui/displayText.test.ts`
  (named display styles, inline font sizes, Text/TextInput/Animated.Text); mutation check: removing the two
  review fixes makes it fail.
- claude · #42 Dependency audit: no unused dependency (5 without imports are expo-router/web peers). #43 found
  (web only: focus drops to `<body>` after navigation, one tab title for all screens) — scored low, not done. Animation check: all `Animated` calls use the native driver; Buddy/HintPulse loops stop on unmount and respect reduce motion; gate timer cleared → #44 (pause Buddy on covered screens; measure on device first).
- Review: reviewer subagent (Codex still blocked, #11) → 2 medium (gate answer field, WordArt emoji) fixed, 1 low
  (guard gaps) fixed.
- Checks: tsc ✓, ESLint ✓, Jest 43 suites / 180 tests ✓. Web (localhost:8095): Home, Letters, gate, theme page render;
  no console errors. Native Dynamic Type / font size not verified (#10). Not committed (owner's explicit approval needed).

## 2026-11-03 (20:00 scheduled run)
- claude · #36 Research pass: Play policy timeline 2026 (anonymous chat apps may not target children, 08-26; contacts +
  location permission policies, 10-28; child-only apps may not request location), Apple 1.3 (parental gate before
  links out, permission requests, purchases). Checked against the app → #41: share + reminders (the only
  notification-permission request) are behind the gate (`GATE_ROUTES`); `npx expo config --type introspect` merged
  Android permissions = INTERNET, VIBRATE, MODIFY_AUDIO_SETTINGS (+4 removed); no iOS usage strings. New tasks #39
  (large system text, native), #40 (release build without INTERNET, owner decision).
- claude · #37 `src/lib/haptics{,.test}.ts`: `haptic(name, enabled)` — the only expo-haptics caller; swallows throws and
  rejections (4 of 5 call sites had no catch); guard test that nothing else imports expo-haptics.
- claude · #38 Vibration setting: `haptics` in `src/state/settings{,.test}.tsx` (default on; older saved settings load
  as on), "Vibration" On/Off card in `src/app/parent/settings.tsx`; call sites use it: `ui/BigButton.tsx`,
  `app/lesson.tsx`, `features/games/{ChoiceGame,MemoryGame}.tsx`, `features/letters/LetterDetail.tsx`.
  `KidErrorScreen.test.tsx` gets an `@/state/settings` stand-in (its react-native stub can't load AsyncStorage;
  assertions unchanged).
- Checks: tsc ✓, ESLint ✓, Jest 42 suites / 175 tests ✓. Web (localhost:8095, behind the gate): card renders, Off →
  `aria-pressed` flips, saved `haptics:false`, tapping Back → no `navigator.vibrate` call; On → tapping Start today's
  lesson → one `vibrate(40)`; setting restored to On; no console errors. Reviewer subagent: no blocking findings (one
  low: defaults apply before settings load — accepted, the splash holds until settings load, same as sound). Codex
  still blocked (#11). Native haptics not verified (#10). Not committed (owner's explicit approval needed).
- claude · Perf check: `npx expo export --platform web` ✓ (CI step); JS 1.5 MB raw / 428 KB gzip. Entry = expo-router,
  react-native-web, react-dom (framework). Shared chunk: app 221 KB src, react-native-svg 126 KB, expo-notifications
  104 KB (unused on web: reminders are phone-only). Not worth a platform split: web is a preview, native loads from disk.

## 2026-11-03 (19:00 scheduled run)
- claude · #32 Fresh-install path on a clean origin (`http://127.0.0.1:8095`, empty storage, preview's test child untouched):
  onboarding (name + avatar) → Home → lesson (3 cards → Find ×3 → rhyme → reward, 6 stars, sticker) → no console errors.
- claude · #33 a11y: reward sticker row is one element labelled `New sticker: <word>` (`src/app/lesson.tsx`); sticker
  book tiles say `Sticker: <word>` via new `stickerLabel()` (`src/features/stickers/stickerArt{,.test}.ts`,
  `StickerTile.tsx`).
- claude · #31 Memory card backs: drawn `sprout` icon (`src/art/icons.ts`) replaces ❓; confetti on the Memory win
  (`src/features/games/MemoryGame.tsx`). Sticker slots already had no emoji placeholder (dashed slot).
- claude · #21 `src/ui/selectedA11y{,.test}.ts`: option buttons report selection as `aria-pressed` on web
  (react-native-web 0.21 ignores `accessibilityState`; `aria-selected` is invalid on `role=button`) and `aria-selected`
  on native (RN merges it into `accessibilityState.selected`: unchanged). Used in onboarding, parent/children,
  profiles, parent/settings ×2. Web: avatar and sound toggles flip `aria-pressed` true/false (setting restored to on).
  Not checked on web: profiles, parent/children (same helper). Native: pending #10.
- claude · #34 checked, no change needed: with the lesson open, Home's subtree is `display:none` + `aria-hidden=true`.
- claude · #35 `ui/BigButton`: optional drawn `icon`, `selected` via `selectedA11y`; letter detail labels without emoji
  ("Trace it", "Unlock tracing" + lock icon) (`features/letters/LetterDetail.tsx`); profile tile "Premium" with drawn
  lock (`app/profiles.tsx`); `KidErrorScreen.test.tsx` gets an `@/ui/Icon` DOM stand-in (its react-native stub has no
  `processColor`; assertions unchanged). Web: labels as above, Uppercase/Lowercase `aria-pressed` true/false, lock icon
  renders in the button. Not checked on web: profile-tile lock (needs a 2nd child).
- Checks: tsc ✓, ESLint ✓, Jest 41 suites / 170 tests ✓. Web: sprout backs render, Memory won in 6 moves → confetti
  layer mounted, labels read as above. Only console errors were `navigator.vibrate` blocked for scripted (non-user)
  clicks. Codex still blocked (#11). Not committed (owner's explicit approval needed).

## 2026-11-03 (third batch: owner's standing instructions — no voice, design first)
- claude · #28 Voice removed everywhere (AI_DECISIONS "No voice"): deleted `lib/speech`, `state/recordings`,
  `parent/voices`, `games/listen`, bundled word audio + recording kit; lesson steps hello → cards → game → read-along
  rhyme → reward; Find the picture game; Buddy is text-only; mic off (`microphonePermission: false`,
  `recordAudioAndroid: false`, RECORD_AUDIO blocked); audio session effects-only, silent switch respected;
  `expo-speech`/`expo-file-system` uninstalled; PRIVACY.md, in-app privacy, store answers, README, FINAL_REPORT,
  intro, paywall updated. Guards in `audioSession.test.ts`, `storeConfig.test.ts`. expo-doctor 20/20.
- claude · Research (NN/g children's UX, Google Building for kids, app-quality studies) → design principles in
  AI_DECISIONS and tasks #22–#27, #29.
- claude · #22 visual hint after 2 misses (`ui/HintPulse`, reducer `wrongTaps`); fixed a pre-existing bug: Find/
  Listen picture grid collapsed to one column (48% + gap > 100%). #23 `Screen` max width 720, Home 3-column theme
  grid ≥ 600 px. #24 `ui/Wiggle` on lesson + theme word cards. #25 drawn icons (`art/icons.ts`, `ui/Icon`) on Home
  tiles. #26 locked themes: tinted theme colour, dashed border, lock badge (`tint()` in contrast.ts). #27
  `ui/Confetti` on lesson reward; drawn star replaces emoji ⭐/✨ there, theme art replaces the lesson-intro emoji.
  Shared `ui/useReduceMotion`. Checks: tsc ✓, ESLint ✓, Jest 40/166 ✓; web: lesson end-to-end, hint after two
  misses, wiggle, confetti, 390 px + 768 px Home. Not committed (owner's explicit approval needed).
- claude · #29 drawn icons for child-facing titles, Home stats, game cards, letter tiles (`IconTitle`; new icons
  flame, memory, find, read). #30 onboarding avatar grid. Sweep: all child routes at 320/360/390/768/1024 px — no
  horizontal overflow, nothing off-screen, no error screen, no console errors. Jest 40/166 ✓.

## 2026-11-03 (second batch, new tasks #17–#21 added)
- claude · #17 Recording kit: `scripts/words.mjs`, `scripts/recording-sheet.mjs`, `assets/audio/RECORDING_SHEET.md`
  (0 of 96), manifest refuses unknown ids (tried `family.mum.m4a` → exit 1), `src/content/recordingSheet.test.ts`,
  audio README. `audio.generated.ts` unchanged.
- claude · #18 README + FINAL_REPORT: content via `ACTIVE_PACK`, per-language progress, recording sheet, Maestro,
  status pointers to PROJECT_STATUS/AI_TASKS.
- claude · #19 `.github/workflows/ci.yml`: web export step; same command passes locally. CI not run (no push).
- claude · #20 Labels for 3 Pressables (parent settings ×2, profile load-error retry) + brace-aware source guard
  `src/ui/pressableA11y.test.ts`. Web: labels present on /parent/settings, no console errors. Found #21.
  Checks: tsc ✓, ESLint ✓, Jest 41/173 ✓. Not committed (awaiting owner OK).

## 2026-11-03
- claude · #5 Startup splash: hold the native splash until settings + progress load; 4 s safety timeout; released
  by the profile load-error and kid error screens; web shows a blank background instead of a spinner/defaults;
  perf marks `lr:splash-held` / `lr:providers-ready`, measure `lr:startup`. Files: `src/lib/splash{,.test}.ts`,
  `src/features/startup/StartupGate{,.test}.tsx`, `src/app/_layout.tsx`, `src/state/profiles.tsx`,
  `src/features/errors/KidErrorScreen.tsx`, `__mocks__/expo-splash-screen.ts`. Checks: tsc ✓, ESLint ✓,
  Jest 38/157 ✓; web reload (existing profile) goes blank → Home with no spinner or default text, `lr:startup`
  ≈ 47 ms, no console errors. Not verified: native splash timing (Xcode, #10); fresh-install onboarding path on web
  (would wipe the preview's stored profile). Not committed yet (awaiting owner OK).
- claude · #13 npm audit triage: 12 moderate = glob + minimatch via Expo build tooling only; not in the bundle
  (web export source maps); no non-breaking fix. Accepted, recorded in AI_DECISIONS. No dependency change.
- claude · #8 Maestro smoke flows: `.maestro/onboarding_lesson_reward.yaml`, `.maestro/parent_gate.yaml`,
  `subflows/onboard.yaml`, README; label-drift guard `src/lib/maestroFlows.test.ts`. Maestro not installed and no
  device build, so flows not run; their step sequence was walked in the web preview (lesson: 3 cards → game → song →
  say it ×3 → "You earned 5 stars!" → Home; gate: wrong answer, Cancel, correct answer → /parent).
- claude · #6 `ACTIVE_PACK` wiring: 25 files import content via `@/content/packs`; `getTheme`/`getWord` moved to
  the packs module; guard test. Web: Home, letters, theme, stickers, games, profiles, lesson render; no errors.
- claude · #7 Per-language progress keys + migration in `src/state/profiles.tsx`; 6 new tests in
  `profiles.test.tsx`. Web cold start migrated an old-format record (⭐ 7 kept, old keys removed). Incident: Fast
  Refresh during the edit reset the preview's test child (Mari) to 0 stars; the migration now never deletes a
  conflicting old record.
- claude · #9 Share-card image research → decision (AI_DECISIONS), implementation queued as #16 after #10.
- claude · #15 "Let's learn 1 new word!": new `lesson_new_word` phrase (Armenian text unchanged — the noun stays
  singular after numbers), chosen in `lesson.tsx` when there is one new word; test in `phrases.test.ts`.
  Checks after all: tsc ✓, ESLint ✓, Jest 39/170 ✓; web lesson renders. Not committed (awaiting owner OK).

## 2026-11-02 (evening session, 18:00 +04)
- Codex unavailable: `codex exec` rejects `gpt-6-sol` and `gpt-6-astra` on this ChatGPT account (task #11, owner).
  Work was done by Claude (owner) + Claude implementer/reviewer subagents.
- claude/implementer · #1 Kid-safe error screen: root `ErrorBoundary` → `KidErrorBoundary`/`KidErrorScreen`
  (Try again / Go home; no error text). Files: `src/app/_layout.tsx`, `src/features/errors/KidErrorScreen{,.test}.tsx`.
- claude · #2 Audio session: `src/lib/audioSession{,.test}.ts`, wired in `_layout.tsx`. Review found a real iOS bug:
  `parent/voices.tsx` passed partial modes, resetting `playsInSilentMode` to false after recording → fixed with
  complete modes + source guard test.
- claude · #3 SFX: 120 ms per-cue throttle, measured per-cue volumes. Files: `src/lib/sfx{,.test}.ts`.
  Checks: tsc ✓, ESLint ✓, Jest 35/147 ✓; web preview: forced render error shows the kid screen, Try again and
  Go home both land on Home, lesson/home render. Commit c2b75a7.
- claude · #4 Store config: iOS privacy manifest, `enableBackgroundPlayback: false`, blocked Android storage/overlay
  permissions, `expo-asset` peer added (expo-doctor 19/20; remaining = 4 patch updates, task #12),
  `STORE_PRIVACY_ANSWERS.md`, `src/lib/storeConfig.test.ts`. Checks: introspect confirms; tsc ✓, ESLint ✓,
  Jest 36/150 ✓; web preview renders. Commit: see git log ("Store readiness").
- claude · #12 Expo SDK patch updates via `npx expo install --fix` (expo 58.0.22, expo-audio 58.0.11, expo-router
  58.0.29, @expo/metro-runtime 58.0.16). expo-doctor 20/20; npm audit (prod) 14 → 12 moderate, 0 high; privacy
  reason union unchanged. Checks: tsc ✓, ESLint ✓, Jest 36/150 ✓; fresh web server: onboarding → home → lesson,
  games gate, no console errors. Files: package.json, package-lock.json.
- Not verified: anything native (Xcode blocker) — silent-switch playback, background stop, error screen on device.

## 2026-11-02 (setup, outside the work window)
- claude · Added coordination files (this file, PROJECT_STATUS.md, AI_TASKS.md, AI_DECISIONS.md) and the daily
  18:00 scheduled session. No app code changed.

## 2026-10-30 (first build sprint — details in PROGRESS.md)
- Waves 1–9 + accessibility pass; final regression in the web preview; FINAL_REPORT.md. Last commit 6b63ae5.
  Checks: tsc, ESLint, Jest 33/135, CI green.
