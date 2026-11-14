# AI changelog — Little Roots

Newest first. Each entry: date · agent(s) · what changed · files · checks · commit.

## 2026-11-14 18:30 run
- claude · #143 (family part) 3D "family" picture: `scripts/compose-family.mjs` composes `assets/words/family/family.png` (256 px, 70 KB) from the bundled Fluent 3D dad, mom and child with resvg (MIT sources, same Light skin tone); `src/art/pictures.ts` registers `family.family`; `src/art/pictures.test.ts` adds a guard that only colours and numbers keep drawn pictures on theme pages (fails without the picture, passes with it). #176 overflow scan at 320×568: no child screen wider than the window. New #175 (family picture on the Home card?). Usage at start: Claude 5-hour 9 %, weekly 65 %; Codex still blocked (#11, config still `gpt-6-sol`). No reviewer pass (asset + registry only; weekly pacing). Checks: `npm run check` 95 suites / 424 tests ✓; web 320×568 Family page: 13 pictures loaded, 0 drawings, no console errors. Commit ecf749f.
- claude · #175 Family theme portrait: `src/content/themeArt.ts` family → `family.family` (Home card, lesson intro, theme header, parent voice chip); `src/content/themeArt.test.ts` checks portraits are 3D except colours/numbers. Compared mom vs family at 3× density (168 px card, 72 px chip): the family reads clearly. Checks: `npm run check` 95 suites / 425 tests ✓; web Home 320 (56 px) + 1024 (72 px) picture loaded, no console errors. Commit: see `git log` ("#175 Family card shows the family").

## 2026-11-14 17:30 run
- claude · #174 trace letters centred: new `src/features/letters/letterInk.ts` (glyph ink table for the 76 alphabet characters from the bundled Noto Sans Armenian Bold + `traceBaselineY`), `TraceCanvas.tsx` uses it (lowercase ascender letters no longer touch the top edge, descender letters no longer sit low, Է/Հ centred). `letterInk.test.ts` parses the TTF and checks the table equals the font + centring for every letter. #117 start dots set to blocked (needs teacher/copybook stroke starts). Checks: `npm run check` 95 suites / 423 tests ✓; web 320×568 trace sheet: Ե y 149.28, ե 152.5 (was 121), no console errors. Reviewer subagent (sonnet): no findings. Commit: see `git log` ("#174 Centre trace letters by their ink").
- claude · #172 Expo SDK 58 patch updates: `npx expo install --fix` (expo 58.0.25, expo-asset, expo-audio 58.0.12, expo-constants, expo-font, expo-haptics, expo-linking, expo-notifications 58.1.9, expo-router 58.0.31, expo-splash-screen, expo-status-bar 58.0.5); `expo-status-bar` added to `app.json` plugins by the installer (no props → no-op). Files: `package.json`, `package-lock.json`, `app.json`, notes. Checks: expo-doctor 20/20; `npm run check` 94 suites / 419 tests ✓; `expo export --platform web` ✓; web smoke (Home, Games, Big or small) no console errors; npm audit unchanged (3 moderate, build tooling). Native not verified (#10, Xcode). Usage at start: 5-hour 1 %, weekly 64 %. Commit: see `git log` ("#172 Expo SDK 58 patch updates").

## 2026-11-14 00:30 run
- claude · pacing stop, no app change. Started 00:33 (12 min before the 00:45 no-new-task cutoff). Usage at start: Claude 5-hour 15 %, weekly 63 % (resets 2026-11-16 23:00 UTC); Codex usage script still reports a stale 2026-10-30 reading and Codex stays blocked (#11). Open backlog is low-score or blocked (#163 attended, #165 visible pane, #171 native fonts, #172 patch updates need a web smoke). Starting #172 now could not be finished and smoke-tested before 01:00. Files: `PROJECT_STATUS.md`, `AI_CHANGELOG.md`. Checks: none needed (notes only). Commit: see `git log` ("Notes: pacing stop 00:30").

## 2026-11-13 23:30 run
- claude · #154 Print this week's words. Usage at start: Claude 5-hour 9 %, weekly 62 % (end 63 %); Codex still blocked (#11). Added `expo-print` ~58.0.9; new `src/features/report/printSheet.ts` (+ `printSheet.test.ts`, 6 tests) and `printWeek.ts`; button on `src/app/parent/index.tsx`. Web check (127.0.0.1:8095, 1024×768): button shown under Practice together; the print frame got 9 cards (8 pictures loaded, 1 drawing), Armenian words, title "Ani's words this week"; frame removed after afterprint; sheet screenshot looks right. First web try showed drawings instead of PNGs (Asset.downloadAsync path) → web now uses the bundled URL directly. Not verified: native print (#173). No reviewer pass (weekly pacing). Checks: `npm run check` ✓ (tsc, ESLint, Jest 94 suites / 419 tests); expo-doctor 19/20 — patch updates out upstream, same without this change → #172. Commit: see `git log` ("#154 Print this week's words").

## 2026-11-13 22:30 run
- claude · planning only, no app change. Usage at start: Claude 5-hour 7 %, weekly 62 % (cap 80 %, resets 2026-11-16 23:00 UTC → ~0.7 % per remaining run); Codex still blocked (#11). #154 printable weekly words plan written in `AI_TASKS.md` (expo-print + pure HTML builder with tests, base64 pictures, button on `parent/report.tsx`). Files: `AI_TASKS.md`, `PROJECT_STATUS.md`, `AI_CHANGELOG.md`. Checks: none needed (notes only). Commit: see `git log` ("Notes: #154 plan").

## 2026-11-13 21:30 run
- claude · #168 "Big or small" sorting game (`/games/sort-size`). Usage at start: Claude 5-hour 0 %, weekly 61 % (≤ 65 %
  build rule from the 18:30 plan); Codex still blocked (#11). `sorting.ts`: `SortPair` ('food' | 'size'), `BIG_IDS` (14) /
  `SMALL_IDS` (17), `PAIR_BASKETS`, pair argument on `basketOf` / `canPlaySorting` / `buildSortRounds` (food stays the
  default). `SortGame`: `pair` prop, Big / Small baskets with new drawn icons `bigBox` (crate with a tree and house) /
  `smallBox` (little box with a cherry), prompt `game_size_prompt` (Armenian → proofreading), screen-reader question per
  pair. Games card only after 3 big + 3 small met words; free themes hold no big word (tested). Files:
  `src/features/games/{sorting.ts,sorting.test.ts,SortGame.tsx,SortGame.render.test.tsx}`, `src/app/games/{index.tsx,sort-size.tsx}`,
  `src/app/_layout.tsx`, `src/lib/screenTitle.ts`, `src/art/icons.ts`, `src/content/phrases.ts`. Checks: `npm run check` ✓
  (93 suites / 413 tests). Web (127.0.0.1:8095): card hidden for the free test child; with the dev test child made Premium
  + 6 size words for the check (backed up and restored afterwards, verified): played to the finish (3 big / 3 small, Try
  again, "5 of 6"), fits 320×568 / 375×812 / 1024×768 with no overflow or scroll, no console errors. Reviewer subagent:
  no blocking findings; low: `basketAt` with the new keys untested → assertion added; slide / gloves noted as defensible
  content calls. Commit: see `git log` ("#168").

## 2026-11-13 20:30 run
- claude · Pacing stop, no app change. Usage at start: Claude 5-hour 32 %, weekly 61 % (cap 80 %, resets
  2026-11-16 23:00 UTC); Codex still blocked (#11). Files: PROJECT_STATUS.md, AI_CHANGELOG.md. Checks: `npm run check`
  (see commit). Commit: see `git log` ("Notes: pacing stop 20:30").

## 2026-11-13 18:30 run
- claude · Usage at start: Claude 5-hour 29 %, weekly 60 % (unchanged since 17:30); Codex still blocked (#11, config unchanged
  since 2026-10-30). Planning only, no app change: #168 (big / small sorting pair) gets its size lists (14 big, 17 small,
  arguable sizes left out), unlock rule and build plan, re-sized L → M. Files: AI_TASKS.md, PROJECT_STATUS.md,
  AI_CHANGELOG.md. Checks: `npm run check` (see commit). Commit: see `git log` ("Notes: #168 plan").

## 2026-11-13 17:30 run
- claude · Pacing stop, no app change. Usage at start: Claude 5-hour 28 %, weekly 60 % (47 % at the end of the 00:30 run);
  80 % cap until the 2026-11-16 23:00 UTC reset → ~0.8 % per run. Codex still blocked (#11). Files: PROJECT_STATUS.md,
  AI_CHANGELOG.md. Checks: `npm run check` — tsc, ESLint, Jest 93 suites / 408 tests ✓. Commit: see `git log` ("Notes: pacing stop").

## 2026-11-13 00:30 run
- claude · Usage at start: Claude 5-hour 9 %, weekly 47 %; Codex still blocked (#11, `~/.codex/config.toml` unchanged since
  2026-10-30). Short run (started 00:33, cutoff 00:45).
- Review of Home at 320×568 on web (scrollWidth 320, no off-screen elements, no console errors; Word of the Day card fits).
  New task #171: Կենդանիներ at 12 px vs 17–18 px neighbours, because `homeCardTitleSize`'s em estimate is ~19 % above the web
  font; held until native fonts are measured (#10). No app code changed. Files: AI_TASKS.md, PROJECT_STATUS.md,
  AI_CHANGELOG.md. Checks: `npm run check` — tsc, ESLint, Jest 93 suites / 408 tests ✓. Commit: see `git log` ("Notes: Home 320 px review, #171").

## 2026-11-12 23:30 run
- claude · Usage at start: Claude 5-hour 6 %, weekly 47 %; Codex still blocked (#11, `~/.codex/config.toml` unchanged since
  2026-10-30).
- Review of the Games list at 320 px (fits) and 1024×768 → #170. **#170 done**: Games list two columns on tablets
  (`gameCardColumns`, ≥ 600 px; lone last card fills its row; card text centred). Files: `src/app/games/index.tsx`,
  `src/features/games/gameListLayout.ts`, `src/features/games/gameListLayout.test.ts`. Checks: `npm run check` — tsc,
  ESLint, Jest 93 suites / 408 tests ✓; web 1024×768 (page 1,511 → 1,111 px), 600×900, 320×640 (unchanged), no console
  errors. Commit: see `git log` ("Games list: two columns on tablets (#170)").

## 2026-11-12 22:30 run
- claude · Usage at start: Claude 5-hour 1 %, weekly 46 %; Codex still blocked (#11, `~/.codex/config.toml` unchanged since
  2026-10-30, not re-probed).
- #167 Sort it web check (no code change): the Little Roots Expo web server was already running on 8095. 320×568,
  375×667, 375×812 and 1024×768 all fit (no horizontal overflow or vertical scroll, baskets side by side, Back on screen). Mouse
  drag into a basket, drop outside (springs back, not counted), tapping a basket, Try again, the finish screen ("4 of 6") and the
  daily-games limit all work. For the tablet check the preview test child's `gamesToday.count` was reset to 0 in browser
  storage (dev preview data only). Console: only Chrome blocking `navigator.vibrate` before a real user tap. Native drag → #10.
- #169 Sort it basket labels 30 px on tablets (were 18 px under 96 px drawings). Files: `src/features/games/SortGame.tsx`,
  `src/features/games/SortGame.render.test.tsx` (3 assertions). Web: 1024×768 30 px, no scroll; 320×568 18 px, unchanged.
- Checks: `npm run check` — tsc ✓, ESLint ✓, Jest 93 suites / 407 tests ✓. Commit 0e223e2 (#169) + notes c9d3d0a.
- #148 marked blocked: grandparent voice messages conflict with the voice rule (owner decision; PROJECT_STATUS Blockers 8).

## 2026-11-12 21:30 run
- claude · Usage at start: Claude 5-hour 23 %, weekly 45 %; Codex still blocked (#11, config unchanged since 2026-10-30).
- #149 Sorting game "Sort it" (`/games/sort`): drag a picture (or tap a basket) into Food / Not food; Family voice says the
  word when recorded; answers recorded for spaced review; card in Games after 3 food + 3 other sortable met words. New
  drawn icons `sort`, `plate`, `toybox`; phrase `game_sort_prompt` (Armenian → proofreading). Files:
  `src/features/games/sorting.ts` (+ test), `src/features/games/SortGame.tsx` (+ render test), `src/app/games/sort.tsx`,
  `src/app/games/index.tsx`, `src/app/_layout.tsx`, `src/art/icons.ts`, `src/content/phrases.ts`, `src/lib/screenTitle.ts`.
- Reviewer subagent: ice cream was "Not food" and 5 kitchen pictures show food (fixed: ice cream → Food, those 5 left out);
  ScrollView had scrolling off (fixed: Back reachable on short phones); answers not recorded (fixed); rects refreshed on
  layout/resize; no jump when caught mid spring-back; comment order. All fixed, +3 tests.
- Checks: `npm run check` → 93 suites / 407 tests ✓. **Not web-checked**: the unattended run can't start the preview
  server (terminal start needs a person) → #167. Drag never seen on screen yet.
- Commit: see git log ("Sort it game (#149)").

## 2026-11-12 20:30 run
- claude · Usage at start: Claude 5-hour 20 %, weekly 44 %; Codex still blocked (#11, config unchanged since 2026-10-30).
- #166 Letter sounds on tablets: new `soundLayout(window)` — tablets (≥ 600 px wide, not short) get a 128 px letter
  (was 88) and answer pictures up to 176 px in a 600 px row (were 128 px inside 234 px tiles); phones and short windows
  keep their sizes. Files: `src/features/games/SoundsGame.tsx`, `src/features/games/SoundsGame.render.test.tsx` (+1 test).
- Checks: `npm run check` → 91 suites / 397 tests ✓. Web (127.0.0.1:8095, test child's traced letters and today's game
  count set in web storage): 1024×768 pictures 172 px, no scroll, Back on screen; 768×1024 pictures 172 px, no scroll;
  320×568 pictures 68 px as before, no horizontal overflow. No console errors. Not separately reviewed (small layout
  diff; Codex blocked). Native not run (#10). Commit: see git log ("Letter sounds fills tablets (#166)").

## 2026-11-12 19:30 run
- claude · Usage at start: Claude 5-hour 11 %, weekly 42 % (end 18 % / 44 %); Codex still blocked (#11, config unchanged
  since 2026-10-30).
- #150 Letter sounds game (`/games/sounds`): a big traced letter (Noto Armenian, upper + lower) and three example
  pictures; the child taps the one whose word starts with it; found → the word appears under it with the letter in
  orange and the Family voice says it if recorded. Only traced letters are asked (card after 3 traced); wrong pictures
  never start with the letter and the answer never starts with theirs (Ո/Ու apart); և left out (արև). New drawn
  `sounds` icon; phrases `game_sounds_prompt` (Ո՞ր նկարն է սկսվում այս տառով։) and `game_sounds_locked` (Նախ գրի՛ր
  երեք տառ։) → proofreading. Files: `src/features/games/letterSounds{,.test}.ts`,
  `src/features/games/SoundsGame{.tsx,.render.test.tsx}`, `src/app/games/sounds.tsx`, `src/app/games/index.tsx`,
  `src/app/_layout.tsx`, `src/lib/screenTitle.ts`, `src/content/phrases.ts`, `src/art/icons.ts`.
- Reviewer subagent: medium (rounds stuck empty if the screen opened before traced letters loaded) fixed + test; low
  (cards grew when the word appeared) fixed; low (direct route with < 3 letters counts a daily game, as Count) kept.
- Checks: `npm run check` → 91 suites / 396 tests ✓. Web (localhost:8095, test child: traced letters set to Ա Բ Գ in
  web storage for the check): locked screen with 2 letters; card in Games list with 3; 375×812 round, wrong (red) then
  right (green, արջ under the bear); 320×568 no horizontal overflow, Back bottom 552, card heights 118 before and after
  solving, letter orange rgb(255,140,66); 1024×768 fits (→ #166 bigger tablet sizing). Console: only the browser's
  blocked `navigator.vibrate` from scripted clicks. Native not run (Xcode, #10). Commit 852ef1b.

## 2026-11-12 18:30 run
- claude · Usage at start: Claude 5-hour 7 %, weekly 42 %; Codex still blocked (#11, config unchanged since 2026-10-30).
- #160 review line: lesson game rounds for due-review words open with Buddy's "Do you remember? Find the picture!"
  (Հիշու՞մ ես։ Գտի՛ր նկարը։ — proofreading); a wrong tap still shows "Good try". Files: `src/content/phrases.ts`,
  `src/features/lesson/game.ts` (`roundPromptKey`), `src/features/lesson/game.test.ts` (+2 tests), `src/app/lesson.tsx`.
- Checks: `npm run check` → 89 suites / 387 tests ✓. Web (localhost:8095, test child Mari, practice-only lesson,
  Buddy in Armenian): 320×640 bubble shows both lines, 4 pictures in view; wrong tap → "Good try"; 375×667 no
  horizontal or vertical overflow; no console errors. Lesson closed unfinished (test child's progress unchanged).
  No separate reviewer (27-line diff, capacity pacing).
- Commit: "Buddy asks "Do you remember?" on review rounds (#160)".
- #150 letter sounds game: plan only (problem, design, risks, success measure in AI_TASKS row 150); not built this run (pacing).

## 2026-11-12 17:30 run
- claude · Usage at start: Claude 5-hour 2 %, weekly 41 %; Codex still blocked (#11: `~/.codex/config.toml` unchanged
  since 2026-10-30), so Claude alone.
- #156 learned-word bounce: on the lesson reward, each of "Today's words" (the words just learned) hops once, one after
  another, after the star burst (450 ms + 160 ms per card; up 10 pt with a 6 % grow, a small settle, then still).
  Native driver; nothing moves under reduced motion; the hop stops on unmount. Files: `src/ui/Bounce.tsx` (new),
  `src/ui/Bounce.render.test.tsx` (new, 3 tests), `src/app/lesson.tsx`.
- Checks: `npx tsc --noEmit && npx eslint . && npx jest --watchman=false` → 88 suites / 380 tests ✓. Web 375×812: two
  full lessons to the reward; cards in one row inside the column, at rest `translateY(0) scale(1)`, no new console
  errors (only the known blocked `navigator.vibrate` from scripted clicks). The hop itself could **not** be seen on web:
  the Browser pane was hidden (unattended run), so requestAnimationFrame never fired — motion verified by unit tests
  only; watch it on the next attended web check or native (#10) → #165. No separate reviewer (small diff, capacity pacing).
- Commit: "Learned words hop on the lesson reward (#156)".
- #157 Home grid: cards left in a short last row now share that row (`src/features/home/themeGrid.ts`, + test); a lone
  card fills it with its picture beside the names. With 19 themes, Phrases is a full-width card on phones (2 columns)
  and tablets (3). Files: `src/features/home/themeGrid.ts` (new), `themeGrid.test.ts` (new, 5 tests),
  `src/features/home/ThemeCard.tsx` (`width`, `fullRow` props), `src/app/index.tsx`.
- Checks: tsc, ESLint, Jest 89 suites / 385 tests ✓. Web: 375×812 (last card 343 px wide, x 16), 1024×768 (720 px, same
  left edge as the row above), 320×700 (288 px); no horizontal overflow; screenshots at 375 and 1024.
- Commit: "Lone last theme card fills its row on Home (#157)".

## 2026-11-12 00:30 run
- claude · Usage at start: Claude 5-hour 19 %, weekly 35 %; Codex still blocked (#11, usage data from 2026-10-30), so
  Claude alone; short final run of the window (started 00:33), one task.
- #153 "Talk together" cards in the parent weekly report: up to three questions for a grown-up to ask in the family
  language, one per word (this week's new words first, then practice words), picture + Armenian + transliteration ·
  English. New pack phrases `talk_show_me`, `talk_is_this`, `talk_say_with_me` (`{word}` placeholder). Web check at
  320 px found "Do we have grandma at home?" (didn't fit people words) and "Is this apple?" — replaced with
  "Say it with me: {word}!" and "Is this the {word}?". Files: `src/features/report/talkTogether.ts` (+ test),
  `src/content/phrases.ts`, `src/app/parent/index.tsx`.
- Checks: `npm run check` — tsc, ESLint, Jest 87 suites / 377 tests ✓; web /parent at 320 px: 3 cards, no horizontal
  overflow, no console errors. Not checked: 1024 px (cards are full-width rows in the 720 px column), native (#10).
  No reviewer subagent (out of time in the window). Commit: "Talk together cards in the weekly report (#153)".

## 2026-11-11 23:30 run
- claude · Usage at start: Claude 5-hour 9 %, weekly 33 %; Codex config unchanged since 2026-10-30 (#11), so a reviewer
  subagent reviewed: no blocking findings; 2 low applied (counted pictures no longer announced as dimmed; no number
  asked twice in a row), 1 low skipped (no live region for the "How many?" prompt — same as Find/Read today).
- #151 Counting game "Count with me": tap each picture to count it (badge 1..N; Family voice plays that number word if
  recorded, else tap sound), then pick how many from three met numbers (digit + Armenian); 6 rounds; recorded as answers
  on the number words. Games card only after 3 met Numbers words; new drawn `count` icon; web tab title "Counting game".
  Web check found and fixed: several taps in one tick counted once (count/answer lock now in refs), answer row 8 px past
  the column at 320 px, count badges clipped on the right column, 5 a row on tablets (now always 4).
- Files: src/features/games/counting.ts, counting.test.ts, CountGame.tsx, CountGame.render.test.tsx,
  src/app/games/count.tsx, src/app/games/index.tsx, src/app/_layout.tsx, src/lib/screenTitle.ts, src/art/icons.ts,
  src/content/phrases.ts; AI_TASKS.md (#151 done; #162, #163 new), AI_DECISIONS.md, PROJECT_STATUS.md.
- Checks: `npm run check` (tsc, ESLint, Jest 86 suites / 374 tests) ✓. Web (localhost:8095, test child given Numbers
  words + Premium for the check, then restored from a backup): Games card hidden without numbers, shown with them; full
  game 6/6 at 375×812 and 375×667; 8 pictures at 320×640 (no horizontal overflow) and 1024×768 (no scroll); wrong then
  right answer; console only shows Chrome's blocked `navigator.vibrate` from scripted clicks (no user gesture).
- Not verified: native (#10); a Family voice recording during counting (#163). Commit: "Counting game (#151)".

## 2026-11-11 22:30 run
- claude · Usage at start: Claude 5-hour 1 %, weekly 32 %; Codex config unchanged since 2026-10-30 (#11), so a
  reviewer subagent reviewed instead: 2 medium + 3 low applied (word changed mid-day after a lesson; voice icon could
  cover a long word; tests at large text and the 600 px breakpoint; picker tests; header role), 1 nit skipped (memo).
- #147 Word of the day on Home: one picture + Armenian + transliteration + English after the tiles (lesson button stays
  above the fold). Same word all day per child (FNV hash of profile id + local day) from words met before today in
  unlocked themes, else the theme the next lesson started with; tap plays the Family voice recording (else wiggle +
  tap sound). Long words go under the picture rather than shrinking below heading size.
- Files: src/lib/wordOfDay.ts, src/lib/wordOfDay.test.ts, src/features/home/WordOfTheDay.tsx, src/app/index.tsx,
  src/ui/wordFit.ts, src/ui/wordFit.test.ts; AI_TASKS.md (#147 done, #161 new), AI_DECISIONS.md, PROJECT_STATUS.md.
- Checks: `npm run check` (tsc, ESLint, Jest 84 suites / 365 tests) ✓. Web (localhost:8095, test child): card at 320,
  375 and 1024 px, word whole (նորածին 22 px in its 124 px column at 320), tap works, heading role, no console errors.
- Not verified: native (Xcode, #10); a recorded word on the card (no recording in the test child). Commit: see git log
  ("Word of the day on Home (#147)").
- #161 Home and lesson grown-up button said "80 more words"; Premium holds 136 since #144/#145. Now
  `ASK_GROWN_UP_LABEL` (counted from `PREMIUM_WORDS`). Files: src/features/paywall/offer.ts, offer.test.ts,
  src/app/index.tsx, src/app/lesson.tsx, src/features/games/grownUpPrompts.test.ts, src/features/home/homeOrder.test.ts
  (the two guards look for the constant instead of the old text; same colour and order rules). Checks: `npm run check`
  84 suites / 366 tests ✓; the new test failed against the old labels; web 375×667 Home "136 more words", no console
  errors (lesson out-of-lessons state not reachable with the test child). Commit: "Count Premium words on the
  grown-up button (#161)".

## 2026-11-11 21:30 run
- claude · Usage at start: Claude 5-hour 36 %, weekly 31 %; Codex config unchanged since 2026-10-30 (#11), so a
  reviewer subagent (sonnet) reviewed instead: no correctness findings, 1 low applied (replay no longer re-asks the
  answered review words).
- #146 spaced review. Found that the Leitner scheduler and due reviews in the daily lesson already existed. Added:
  Find and Read ask words due for review first (most overdue, at most one game's rounds, then other met words before a
  repeat) — `buildChoiceRounds(..., reviewIds)`, ids taken once in `GameShell` when the game is admitted. Bug fixed:
  `scheduleReview` moved a word up a box on every correct answer, even before it was due, so three games in a day took
  a word from box 0 to 3 (next seen in 14 days); early correct answers now keep box and due time.
- Files: src/lib/srs.ts, src/lib/srs.test.ts, src/features/games/logic.ts, src/features/games/logic.test.ts,
  src/features/games/GameShell.tsx, src/features/games/ChoiceGame.tsx, src/app/games/find.tsx, src/app/games/read.tsx;
  AI_TASKS.md (#146 done, #159, #160 new), AI_DECISIONS.md, PROJECT_STATUS.md.
- Checks: `npm run check` (tsc, ESLint, Jest 83 suites / 355 tests) ✓. Web (127.0.0.1:8095, test child, data backed up
  and restored): with grandma + dad due and 4 words not due, Find asked dad then grandma in rounds 1–2; dad stored box 1,
  due in 3.00 days; brother (not due) answered correctly kept box 0 and its due date; no console errors.
- Not verified: native (Xcode, #10). Commit: see git log ("Spaced review in Find and Read (#146)").

## 2026-11-11 20:30 run
- claude · Usage at start: Claude 5-hour 23 %, weekly 29 %; Codex config unchanged since 2026-10-30, so #11 still
  blocks it (not re-probed). No reviewer subagent this run (same recipe as the four reviewed themes; capacity kept).
- #144 5 of 6 — Holidays theme (Տոներ, premium): New Year tree, Ձմեռ պապ (Santa, Light tone), gata (Fluent "Pie"),
  fireworks, cake, candle, Vardavar (Fluent "Water pistol"), dove; drawn fallbacks; rhyme "Holidays" with one picture per
  line (test). 144 theme words in 17 themes (the 19:30 entry's "137" was a miscount: 136).
- Finding while adding it: հրավառություն (9.75 em) can't fit a 320 px phone's Memory card (67 px) even at the 8 px
  floor. New `wordFits` (src/ui/wordFit.ts); `buildMemoryDeck` takes a `fits` predicate and uses non-fitting words only
  when too few others are seen; MemoryGame passes it for a full deck's card width. The word-fit test now names this one
  known exception and a new test pins `wordFits` (only հրավառություն fails at 320 px; fits at 375).
- Files: assets/words/holidays/*.png (8), src/art/pictures.ts, src/art/words/{holidays,index}.ts,
  src/content/{themes,types,themeArt,content.test}.ts, src/features/lesson/rhymeWords.test.ts,
  src/features/games/{logic,logic.test}.ts, src/features/games/MemoryGame.tsx, src/ui/{wordFit,wordFit.test}.ts, notes.
- Checks: `npx tsc --noEmit` ✓, `npx eslint .` ✓, `npx jest --watchman=false` 83 suites / 349 tests ✓. Web (127.0.0.1:8095):
  Holidays card on Home 375 px (locked, tree picture); all 8 pictures in Parent → Family voice (filter Holidays);
  Memory at 320×700 renders 12 cards, no console errors. Not verified: native fonts (#10).

- #144 6 of 6 — Action words theme (Գործեր, premium): eat (Fluent "Spaghetti"), sleep, run, play (yo-yo), swim, dance,
  sing, draw (palette), infinitives; drawn fallbacks; rhyme "What I like to do" (test). Guard tests caught two things
  before commit: 🎤 is banned by the no-voice guard (→ 🎶), and the two-word title Ի՞նչ եմ անում broke the one-line title
  fit (→ Գործեր). #144 done (152 theme words, 18 themes); #157 closed (even rows).
- Files: assets/words/actions/*.png (8), src/art/pictures.ts, src/art/words/{actions,index}.ts,
  src/content/{themes,types,themeArt,content.test}.ts, src/features/lesson/rhymeWords.test.ts, notes.
- Checks: tsc ✓, ESLint ✓, Jest 83 suites / 350 tests ✓. Web 375 px: Home last row Holidays + Action words; Family voice
  shows all 8 pictures ("0 of 152"); fresh bundle has no resolve error (an earlier console error was from the moment
  index.ts was saved before actions.ts existed).
- #145 Phrases theme (Խոսքեր, premium): hello (raising hand), good morning (sunrise), good night (night with stars), thank
  you (folded hands), please (pleading face), I love you (heart with ribbon), how are you? (smiling face), goodbye (waving
  hand); Light tone for hands/people; drawn fallbacks; rhyme "Kind words" (test). Files: assets/words/phrases/*.png (8),
  src/art/pictures.ts, src/art/words/{phrases,index}.ts, src/content/{themes,types,themeArt,content.test}.ts,
  src/features/lesson/rhymeWords.test.ts, notes. Checks: tsc ✓, ESLint ✓, Jest 83 suites / 351 tests ✓; web 375 px
  Family voice ("0 of 160", 8 phrases with pictures and Record buttons); fresh bundle has no resolve error.

## 2026-11-11 19:30 run
- claude · Usage at start: Claude 5-hour 15 %, weekly 27 %; Codex still blocked by #11, so a reviewer subagent reviews
  instead of Codex.
- #158 (bug, found while checking the new Playground card): `fitFontSize` estimated every Armenian letter at 0.75 em, but
  Խաղահրապարակ measures 9.99 em (0.83/letter) and broke "Խաղահրապար / ակ" on its Home card at 375 px. New `wordEms`
  weighs wide and narrow letters (widths measured with canvas in the web preview), rounded to 2 decimals (a size that
  exactly filled its box was rejected by float error). Home title floor 9 px, header floor 11 px. Tests now use
  `wordEms` (src/ui/fitFontSize.test.ts adds the measured case). Files: src/ui/fitFontSize.ts,
  src/features/home/themeTitle.ts, src/ui/fitFontSize.test.ts, src/ui/wordFit.test.ts,
  src/features/home/themeTitle.test.ts.
- Web (127.0.0.1:8095): Home 375 px — every theme name on one line (Խաղահրապարակ 12 px, 121 of 129 px; Տրանսպորտ 17,
  Զգացմունքներ 14); 320 px — all one line (Խաղահրապարակ 9 px), no horizontal scroll; no console errors.
- Reviewer subagent: no blocking findings; applied narrow letters 0.5 → 0.55 em (margin for Android fonts) and a second
  measured anchor (Տրանսպորտ ≥ 6.66 em); uppercase-letter note not taken (Ա 0.72, Տ 0.67 em measured, not wide).
- Checks: `npm run check` 83 suites / 345 tests ✓ (without the Playground files). Commit 738a6df "Fit Armenian words by
  letter width (#158)".
- #144 (4 of 6): new premium theme **Playground** (`playground`) — slide, kite, bucket, carousel, bubbles, ice cream,
  fountain, scooter; 8 Fluent 3D PNGs (assets/words/playground/, 21–43 KB, MIT: Playground slide, Kite, Bucket,
  Carousel horse, Bubbles, Soft ice cream, Fountain, Kick scooter), drawn fallbacks (src/art/words/playground.ts,
  contact sheet checked), rhyme "At the playground" (each line shows its picture; test). "National park" dropped (shows
  mountains). Same files as Kitchen + src/art/words/playground.ts.
- Web: Home 375 + 320 px shows the Playground card, name whole (after #158); locked card → parent gate → paywall "112
  more words in 14 themes", Words Premium 136; no console errors.
- Checks: `npm run check` 83 suites / 346 tests ✓. Commit: "New theme: Playground (#144)".

## 2026-11-11 18:30 run
- claude · Usage at start: Claude 5-hour 7 %, weekly 26 %; Codex still blocked by #11 (`~/.codex/config.toml`
  unchanged since 2026-10-30), so no Codex implementation or review.
- #144 (2 of 6): new premium theme **Weather & seasons** (`weather`) — rainbow, snow, wind, umbrella, spring, summer,
  autumn, winter; 8 Fluent 3D PNGs (assets/words/weather/, 31–41 KB, MIT: Rainbow, Snowflake, Wind face, Umbrella
  with rain drops, Cherry blossom, Beach with umbrella, Fallen leaf, Snowman), drawn SVG fallbacks
  (src/art/words/weather.ts, contact sheet checked), rhyme "All year round"; nature's sun/rain/cloud not repeated.
  Picked wind face over "leaf fluttering in wind" (looked like autumn's leaves). Test: each rhyme line maps to its
  pictures (src/features/lesson/rhymeWords.test.ts). Files: src/content/{types,themes,themeArt}.ts,
  src/content/content.test.ts, src/art/pictures.ts, src/art/words/{index,weather}.ts.
- Web (127.0.0.1:8095): Home 375 + 320 px shows the Weather card (title wraps to two whole lines, no horizontal
  overflow; 14 cards in even rows); locked theme → parent gate → paywall "96 more words in 12 themes", Words 24 /
  120, strip 6 + 6; Family voice filter "Weather & seasons 0/8" lists the 8 pictures (all 256 px PNGs loaded); no
  console errors.
- Checks: `npm run check` 83 suites / 343 tests ✓. Commit 631d195 "New theme: Weather & seasons (#144)".
- #144 (3 of 6): new premium theme **Kitchen** (`kitchen`) — plate, spoon, bowl, cup, pot, frying pan, teapot, salt;
  8 Fluent 3D PNGs (assets/words/kitchen/, 21–44 KB, MIT), drawn fallbacks (src/art/words/kitchen.ts, contact sheet
  checked), rhyme "In the kitchen" (each line shows its picture; test). Fork and knife left out: the plate picture
  already shows them, so a Find round would have two right-looking answers. Same files as Weather +
  src/art/words/kitchen.ts.
- Web (375 px): Home shows the Kitchen card; Family voice "Kitchen 0/8" lists the 8 pictures (256 px loaded), "0 of
  128 recorded". A console "Unable to resolve ./kitchen" came from Fast Refresh between two edits; the current dev
  bundle builds (HTTP 200, no resolve error, kitchen pictures in it).
- Checks: `npm run check` 83 suites / 344 tests ✓. Commit: "New theme: Kitchen (#144)".

## 2026-11-11 17:30 run
- claude · Usage at start: Claude 5-hour 2 %, weekly 25 %; Codex still blocked by #11 (config unchanged since
  2026-10-30), so no Codex implementation or review.
- #144 (1 of 6): new premium theme **School** — school, teacher, backpack, pencil, notebook, scissors, ruler, crayon;
  8 Fluent 3D PNGs (assets/words/school/, 19–53 KB each, MIT), drawn SVG fallbacks (src/art/words/school.ts), rhyme
  "At school". Files: src/content/{types,themes,themeArt}.ts, src/content/content.test.ts, src/art/pictures.ts,
  src/art/words/{index,school}.ts.
- Bug found in the web check: the paywall headline was hard-coded "80 more words to discover" (true only for 10
  Premium themes); now derived from `PREMIUM_WORDS` (88). Files: src/features/paywall/offer{,.test}.ts.
- Web (127.0.0.1:8095, 375×812): Home shows the School card with its picture; locked School → parent gate → paywall
  (11 theme pictures in 6 + 5 rows, "88 more words in 11 themes", Words 24 / 112); Family voice School filter shows the
  8 pictures; no console errors. Drawn fallbacks checked by the art tests only (not shown when a PNG exists).
- Checks: `npm run check` (tsc + eslint + jest) 83 suites / 342 tests ✓. Commit: "New theme: School (#144)".

## 2026-11-11 owner session (#142, skin tone)
- claude · Owner: "make them light, Armenians usually don't have dark skin; hair can stay a little dark". Compared
  Fluent Light vs Medium-Light (Medium-Light makes hair blonde); switched the 15 people and body pictures to Light
  (light skin, dark hair). Files: assets/words/{body,family}/*.png, src/art/pictures.ts comment, notes. Web: Family
  page 375 px. Checks: `npm run check` 83 suites / 341 tests ✓.

## 2026-11-11 owner session (#142)
- claude · Owner asked for better word pictures. Compared the drawn SVGs with Microsoft Fluent Emoji 3D (MIT, 111 of
  121 words covered) side by side; owner chose Fluent 3D.
- Added 102 PNGs (256 px, 3.5 MB) in assets/words/<theme>/ + assets/words/LICENSE; src/art/pictures.ts (registry);
  src/ui/WordArt.tsx shows the picture first, then the SVG, then the emoji; src/content/themeArt.ts Family card → mom;
  test src/art/pictures.test.ts. People and body parts in Medium skin tone (default yellow and Medium-Light blonde
  looked wrong). Colours, numbers, family, walnut, ship's wheel and wheat stay drawn (#143 logged).
- Web (127.0.0.1:8095): Home, Food and Family theme pages at 375×812 and 1024×768, letter Բ sheet; no console errors.
- Checks: `npm run check` (tsc + eslint + jest) 83 suites / 341 tests ✓. Commit: "Word pictures: Microsoft Fluent Emoji 3D (#142)".

## 2026-11-11 00:33 run
- claude · Usage: Claude 5-hour 1 %, weekly 17 %; Codex still blocked by #11 (no Codex review; small diff checked in
  the browser). Short run (00:45 cutoff).
- Review: Letters list and Games list at 320×640 — no overflow (scrollWidth 320), letter tiles and game cards fit;
  no change.
- #141 Lesson intro theme picture grows on tall tablets: `intro` in src/features/lesson/artSizes.ts (200 px on tall
  tablets, 140 px elsewhere; + test in artSizes.test.ts); src/app/lesson.tsx uses `art.intro`. Web: 1024×768 200 px,
  375×667 140 px, no scrolling container on either.
- Checks: `npm run check` (tsc + eslint + jest) 82 suites / 338 tests ✓. Commit: "Lesson intro picture grows on
  tablets (#141)".

## 2026-11-10 23:30 run
- claude · Usage: Claude 5-hour 18 %, weekly 16 %; Codex config unchanged (#11 still blocks it; small UI diff checked
  in the browser instead of a Codex review).
- Review: Stickers at 320 px fits (earned tiles only look small mid bounce-in; scale 1 after). Outfit "★ 1" under a
  lock means "1 more sticker" (hat needs 3) — easy to misread → #140.
- #139 Paywall picture strip in even rows: `premiumStripLayout` in src/features/paywall/offer.ts (+ test) sizes the
  10 Premium theme tiles from the window — one row when all fit, else two rows of five, tiles below 56 px only when
  needed; src/app/parent/paywall.tsx uses it (row maxWidth keeps 5 + 5). Web (127.0.0.1:8095, through the gate):
  320×640 two rows of five 51 px tiles (17–304, was 4 + 4 + 2), 375×812 two rows of 56 px, 1024×768 one row; no
  horizontal scroll, no console errors. `npm run check`: tsc ✓, ESLint ✓, Jest 82 suites / 336 tests ✓.
- #140 Dress-up progress bar: `outfitProgress` in src/lib/outfits.ts (+ test); src/features/stickers/OutfitPicker.tsx
  shows a star and a gold bar (stickers earned of the unlock count) on each locked outfit instead of the "★ N more"
  number; screen-reader labels unchanged ("Party hat, locked: 1 more sticker"). Web (127.0.0.1:8095) 2 stickers:
  320×640 2×2 tiles with bars at 2/3, 2/6, 2/10, inside the tiles; 1024×768 one row of 140 px tiles; no console
  errors. `npm run check`: tsc ✓, ESLint ✓, Jest 82 suites / 337 tests ✓.

## 2026-11-10 22:30 run
- claude · Usage: Claude 5-hour 14 %, weekly 15 %; Codex config unchanged since 2026-10-30 (#11 still blocks it;
  Codex review skipped, small UI diff checked in the browser).
- #137 Family voice messages beside their word: new src/features/parent/voiceNotice.ts (`VoiceNotice`, `VOICE_NOTICE`,
  `noticeForWord`) + voiceNotice.test.ts (3 tests); src/app/parent/voice.tsx shows the message and Open Settings in the
  row of the word they are about instead of above the list. Web (localhost:8095, through the gate) 320×640: Family voice
  fits (no horizontal overflow); Record on tatik, then papik (the preview denies the microphone) — the message shows
  in the tapped row, inside the card (34–286 px); no console errors. Saved/Deleted messages not seen on web (no
  microphone); native → #61. Checks: `npm run check` — tsc, ESLint, Jest 81 suites / 332 tests ✓. Commit 30eb920 (#137).
- #138 Report names the child: new src/features/report/exploredLine.ts + exploredLine.test.ts (3 tests);
  src/app/parent/report.tsx count line uses the active child's name ("Mari has explored 24 words" on the free plan,
  "Mari: 24 of 104 words explored" on the full report). First wording "… so far" wrapped "far" alone at 320 px →
  shortened. Web (free plan) 320×640 and 1024×768: one line, no console errors; full report not opened (Premium off).
  Checks: `npm run check` — tsc, ESLint, Jest 82 suites / 335 tests ✓. Commit: see git log (#138).

## 2026-11-10 21:30 run
- claude · Usage: Claude 5-hour 9 %, weekly 14 %; Codex config unchanged since 2026-10-30 (#11 still blocks it;
  Codex review skipped, three-line style change checked in the browser).
- #135 Children rows fit at 320 px: src/app/parent/children.tsx — the name sits in a wrapping row with Edit/Delete
  (`info`, `actions` styles; name `minWidth: 0`), so a name too long for one line moves Edit/Delete under it. Before, on
  web at 320 px with a 20-character name, Delete ended at 313 px (card edge 304) and Edit/Delete didn't line up between
  rows. Web (localhost:8095, through the gate, test child added in preview storage) 320×640: "Anahit-Mariam Sargis" wraps
  at word breaks, Edit 156–220 / Delete 228–296 on both rows; "Alexandrapetrosyanaa" (no spaces) stays inside the card;
  1024×768: one line per child, actions aligned; renamed through Edit → Save; no console errors.
- #128 Delete child checked on web: confirm text = the #126 warning; accepting removed the test child (preview storage
  back to Mari only). The browser pane dismisses native dialogs, so `window.confirm` was stubbed to accept.
- Checks: `npm run check` — tsc, ESLint, Jest 79 suites / 327 tests ✓. Commit 413005c (#135).
- #136 "Playing now" on Children: new src/features/parent/childRow.ts (`isPlayingNow`, `PLAYING_NOW`) +
  childRow.test.ts (2 tests); src/app/parent/children.tsx shows the green tag under the active child's name when there
  are two or more children. Web (test child added in preview storage, then removed) 320×640: tag on Mari only, rows
  wrap cleanly; 375×812 and 1024×768: tag under the name, actions aligned; no console errors. Checks: `npm run check` —
  tsc, ESLint, Jest 80 suites / 329 tests ✓. Commit: see git log (#136).

## 2026-11-10 20:30 run
- claude · Usage: Claude 5-hour 6 → 7 %, weekly 14 %; Codex config unchanged since 2026-10-30 (#11 still blocks it;
  Codex review skipped, one-line style change).
- #134 Reminders time chips fill their rows: src/app/parent/reminders.tsx (`minWidth: '30%'` → `flexGrow: 1,
  flexBasis: '30%'`). Web (localhost:8095, through the gate) 320×640: chips 16–107 / 213–304 (were 16–102 / 205–291),
  no horizontal scroll; 1024×768: three equal chips across the column; no console errors. Settings at 320×640: no
  overflow, no change. Checks: `npm run check` — tsc, ESLint, Jest 79 suites / 327 tests ✓. Commit: see git log (#134).

## 2026-11-10 19:30 run
- claude · Usage: Claude 5-hour 0 %, weekly 13 %; Codex config unchanged since 2026-10-30 (#11 still blocks it; Codex
  review skipped, copy-only change).
- #128 web check: Parent → Settings → Reset progress shows the browser confirm ("…Family voice recordings and other
  children are kept."); Cancel kept Mari's progress. Delete child needs two children (not re-run, would need a test child).
- #132 privacy text complete: src/features/parent/privacyText.ts, PRIVACY.md (avatar, Buddy's outfit, traced letters,
  settings, reminder time; Share this week line; effective date 2026-11-10), new src/features/parent/privacyText.test.ts
  (stored kinds named; PRIVACY.md in sync). Web 375×812 Privacy: new lines shown, no horizontal scroll, no console
  errors. Checks: `npm run check` — tsc, ESLint, Jest 79 suites / 327 tests ✓.
- Finding → #133 (web tab title stale after Back) → checked: no change. `document.title` is right after Back
  ("Grown-ups · Little Roots"); only the preview pane's tab label lagged. Notes only.

## 2026-11-10 18:30 run
- claude · Usage: Claude 5-hour 22 %, weekly 12 %; Codex config unchanged since 2026-10-30 (#11 still blocks it).
- #128 system dialogs work in the web preview: new `src/lib/dialog.ts` (`notify`, `confirmAction`; browser
  alert/confirm on web, `Alert.alert` with Cancel first on native) + `src/lib/dialog.test.ts` (4 tests). All
  `Alert.alert` call sites switched with identical text and buttons: src/app/onboarding.tsx, src/app/profiles.tsx,
  src/app/parent/index.tsx (Reset progress), src/app/parent/children.tsx (Delete child), src/app/parent/paywall.tsx,
  src/features/report/WeeklyShareCard.tsx (local notify removed). Checks: `npm run check` — tsc, ESLint, Jest 78 suites
  / 325 tests ✓. Reviewer subagent: no findings (2 optional nits: non-destructive style untested, import order).
  Not verified: the web preview itself (the preview server start was declined in this unattended run) and native.

## 2026-11-10 17:30 run
- claude · Usage: Claude 5-hour 13 %, weekly 11 % (weekly reset → work resumes); Codex config unchanged since
  2026-10-30, so #11 still blocks it (not re-probed). Codex cross-review unavailable; change is one string.
- #126 delete-child warning now names Family voice recordings and says it cannot be undone (deleting a child removed
  them silently from the warning's point of view). Files: src/features/parent/deleteChildText.ts (+ test),
  src/app/parent/children.tsx. Checks: `npm run check` — tsc, ESLint, Jest 77 suites / 318 tests ✓. Web: Children
  screen renders behind the gate, no app console errors (the alert itself is a no-op on web → #128).
- #117 blocked (system fonts differ per platform → #127 bundle an Armenian font first). New: #127, #128.
- #127 bundled Noto Sans Armenian Bold (50 KB, OFL) for big letters: Letters grid, letter sheet, tracing guide letter;
  first launch waits for it (a failed load doesn't block; splash timeout still caps). Files: package.json,
  package-lock.json, app.json (expo-font plugin from `expo install`), src/ui/letterFont.ts,
  src/features/startup/StartupGate.tsx (+ test), src/app/letters.tsx, src/features/letters/LetterDetail.tsx,
  src/features/letters/TraceCanvas.tsx, README.md. Checks: `npm run check` 77 suites / 319 tests ✓; expo-doctor
  20/20; `npm audit --omit=dev` 5 moderate (unchanged). Web (1024×768): font loaded, tiles/sheet/SVG use it, every
  glyph inside the canvas. Native not checked (#10).
- #129 Reset progress warning: "Family voice recordings and other children are kept." File: src/app/parent/index.tsx.
  Checks: `npm run check` 319 tests ✓. Copy only (native alert, not shown on web).
- #130 letter-sheet example word fits its box in the bundled font (`wordBox.letterExample`, src/ui/wordFit.ts + test,
  src/features/letters/LetterDetail.tsx). Web 320×568: all 39 example words on one line.
- #131 reviewer subagent on #127: no blockers; low finding fixed — StartupGate stops waiting for the font after
  `SPLASH_MAX_MS` (src/features/startup/StartupGate.tsx + 2 tests). Android SVG bold weight to check on device (#10).
  Checks: `npm run check` 77 suites / 321 tests ✓.

## 2026-11-06 00:30 run (capacity stop)
- claude · Usage: Claude 5-hour 2 %, **weekly 99 %** (≥ 80 % cap → review/rest only); Codex not re-probed (config
  unchanged since 2026-10-30, #11 still blocks). No implementation; #117 stays waiting-capacity. Files:
  PROJECT_STATUS.md, AI_CHANGELOG.md. No code change, so no checks run.

## 2026-11-05 23:30 run (capacity stop)
- claude · Usage: Claude 5-hour 0 %, **weekly 99 %** (≥ 80 % cap → review/rest only); Codex probe still fails
  ("`gpt-6-sol` not supported with a ChatGPT account", #11). No implementation; #117 stays waiting-capacity. Files:
  PROJECT_STATUS.md, AI_CHANGELOG.md. No code change, so no checks run.

## 2026-11-05 22:30 run (capacity stop)
- claude · Usage: Claude 5-hour 40 %, **weekly 98 %** (≥ 80 % cap → review/rest only); Codex probe still fails
  ("`gpt-6-sol` not supported with a ChatGPT account", #11). No implementation; #117 stays waiting-capacity. Files:
  PROJECT_STATUS.md, AI_CHANGELOG.md. No code change, so no checks run.

## 2026-11-05 18:30 run (capacity stop)
- claude · Found #125 (side session) uncommitted; `npm run check` — tsc, ESLint, Jest 76 suites / 317 tests ✓ → committed
  ffe0c5f "Games: one Buddy bubble on the finished screen (#125)" and pushed (first push failed transiently, retry ok).
- Usage: Claude 5-hour 36 %, **weekly 98 %** (≥ 80 % cap → review/rest only); Codex probe still fails ("`gpt-6-sol` not
  supported with a ChatGPT account", #11). No implementation this run; #117 → waiting-capacity. Files: AI_TASKS.md,
  PROJECT_STATUS.md, AI_CHANGELOG.md. No code change.

## 2026-11-05 (side session, #125; committed by the 18:30 run after `npm run check` 76 suites / 317 tests ✓)
- claude · #125 finished-game screen: two Buddy bubbles stacked (the score, then "that's all the games for today").
  `GameDoneActions` now takes the game's `result` line and shows one Buddy: the result, with "That's all the games for
  today" on a second line once the free games are used up. `ChoiceGame` (Find, Read) and `MemoryGame` pass their result
  instead of rendering their own Buddy. Files: `src/features/games/{GameDoneActions.tsx,ChoiceGame.tsx,MemoryGame.tsx}`.
  Checks: `npm run check` — tsc, ESLint, Jest 76 suites / 317 tests ✓; web [::1] Find finished on the last free game at
  375×667: one bubble, Trace letters / My stickers / Back / grown-up prompt on screen, no scroll. Suggested commit:
  "Games: one Buddy bubble on the finished screen (#125)".

## 2026-11-05 (side session, #124, committed as ae7cdaa)
- claude · Review pass 4 continued (reminders: fine; game screens out of games) → #124 done, #125 found. Opening a game
  with none left and finishing the last free game still ended in Back and the grown-up upsell. New shared
  `src/features/games/FreeActivities.tsx` (Trace letters, My stickers) on the games list, GameShell and GameDoneActions;
  there Back is grey so the free activities are the orange choices, and the grown-up prompt stays last (order checked
  for all three in `grownUpPrompts.test.ts`). Files: `src/app/games/index.tsx`,
  `src/features/games/{FreeActivities.tsx,GameShell.tsx,GameDoneActions.tsx,grownUpPrompts.test.ts}`. Checks:
  `npm run check` — tsc, ESLint, Jest 76 suites / 317 tests ✓; web [::1] (today's count set on the test profile as
  asked): GameShell out-of-games screen and the finished-game screen after the last free game at 375×812 and 375×667,
  all buttons on screen, no console errors. Suggested commit: "Games: every out-of-games screen offers Letters and
  Stickers (#124)".

## 2026-11-05 (side session, review pass 4 + #123, committed as 5e91b75)
- claude · Review pass 4 (Home on a tablet, Family voice; the voice chips already use the theme drawings, no finding) →
  #123 done: a finished theme gets a gold star badge on its Home card (drawn `stickers` icon in a white circle with a
  star-gold border, same corner as the Next ribbon, which a finished theme never has) and the label says "all 12 words
  learned". Label and completion rule moved to `src/features/home/themeCardLabel.ts` with tests. Files:
  `src/features/home/{ThemeCard.tsx,themeCardLabel.ts,themeCardLabel.test.ts}`. Checks: `npm run check` — tsc, ESLint,
  Jest 76 suites / 315 tests ✓; web [::1] Home 375×812 and 768×1024: badge on Family (12/12), Next ribbon on Food, no
  horizontal scroll, no console errors. Suggested commit: "Home: a gold star on finished themes (#123)".

## 2026-11-05 (side session, #122, committed as bdf8453)
- claude · Review pass 3: Memory (today's game count on the [::1] test profile reset to 0 in local storage, as the parent
  session asked) → #122 done: Memory opens with Buddy's line like Find and Read — new phrase `game_memory_prompt`
  ("Գտի՛ր զույգերը՝ նկարն ու բառը։" / "Find the pairs: a picture and its word!"; Armenian needs the owner's proofreading),
  shown for the whole game on windows ≥ 800 px tall (`memoryLayout().prompt`); shorter windows keep the full card height.
  Files: `src/content/phrases.ts`, `src/features/games/{MemoryGame.tsx,memoryLayout.ts,memoryLayout.test.ts}`. Checks:
  `npm run check` — tsc, ESLint, Jest 75 suites / 313 tests ✓; web [::1] 375×812 (cards 119 px, Back ends 776), 768×1024
  (Back 841), 375×667 and 1024×768 without the prompt, no scroll, no console errors. Suggested commit: "Memory: Buddy says
  find the pairs (#122)".

## 2026-11-05 (side session, #121, committed as 1500857)
- claude · #121 paywall shows what Premium adds as pictures: a strip of the 10 Premium themes' drawings (56 px tiles in
  each theme's colour) with "80 more words in 10 themes", under the subtitle; one screen-reader label lists the theme
  names. `PREMIUM_THEMES` / `PREMIUM_WORDS` live in `src/features/paywall/offer.ts`; a test checks free + Premium-theme
  words equal the comparison table's Premium words. Files: `src/app/parent/paywall.tsx`,
  `src/features/paywall/{offer.ts,offer.test.ts}`. Checks: `npm run check` — tsc, ESLint, Jest 75 suites / 312 tests ✓;
  web [::1] paywall at 375×667 (two rows of five) and 768×1024 (one row), no horizontal scroll, no console errors. Memory
  still unreviewed (today's free games are used up on the test profile). Suggested commit: "Paywall: pictures of the
  Premium themes (#121)".

## 2026-11-05 (side session, #120, committed as 4240289)
- claude · Review pass 3 continued (paywall, settings) → #119–#121; settings had nothing to fix. #120 done: the yearly
  plan said "Best value" twice (badge and the note under the price); the note is now just "≈ $2.92/month". #119 needs the
  owner: the paywall links the privacy policy but no Terms of Use, which Apple expects for auto-renewing subscriptions.
  Files: `src/app/parent/paywall.tsx`. Checks: `npm run check` — tsc, ESLint, Jest 75 suites / 311 tests ✓; web [::1]
  paywall 375×812 through the gate: "Best value" once. Memory not reviewed (today's free games are used up on the test
  profile). Suggested commit: "Paywall: say Best value once (#120)".

## 2026-11-05 (side session, #118, committed as d14301f)
- claude · Review pass 3 continued (parent full report on the free plan) → #118 done: the locked report was a title, one
  line and "Explore Premium" with no way back but the system gesture. It now shows a drawn chart picture, the real count
  ("21 words explored so far"), what Premium adds, and a grey "Back to parents" after Explore Premium (shared
  `backToParents`, same logic as the full report's footer). Files: `src/app/parent/report.tsx`,
  `src/features/report/lockedReport.test.ts`. Checks: `npm run check` — tsc, ESLint, Jest 75 suites / 311 tests ✓; web
  [::1] 375×812 through the parent gate; Back leaves the page; no console errors. Paywall and settings sit behind the gate
  on each direct visit and weren't reviewed in content yet. Suggested commit: "Parent report: the free-plan preview shows
  the word count and a way back (#118)".

## 2026-11-05 (side session, review pass 3 + #116, committed as e6055f3)
- claude · Review pass 3 (games list, letter tracing, parent intro) → #116–#117. #116 done: when today's games are used
  up the games list no longer ends in a goodbye and a grown-up upsell — "Trace letters" and "My stickers" (no daily limit)
  come after Buddy's line and the grey "Grown-ups: unlimited games" stays last (order added to the grown-up prompt test).
  Files: `src/app/games/index.tsx`, `src/features/games/grownUpPrompts.test.ts`. Checks: `npm run check` — tsc, ESLint,
  Jest 74 suites / 310 tests ✓; web [::1] out-of-games state at 375×812, 375×667 (all three buttons end by 456 px) and
  768×1024, no horizontal scroll; the buttons open /letters and /stickers. Suggested commit: "Games: offer Letters and
  Stickers when today's games are used up (#116)".

## 2026-11-05 (side session, #114, committed as 4b6daa1)
- claude · #114 profile picker: phone card avatar 82 → 112 px; new grey "Grown-ups: add a child" button after "Back to
  home" opens the parent gate with next=/parent/children (its Add child already handles the free-plan paywall). The picker
  joins the grown-up prompt guard test (grey; after the child's button). Files: `src/app/profiles.tsx`,
  `src/features/games/grownUpPrompts.test.ts`. Checks: `npm run check` — tsc, ESLint, Jest 74 suites / 309 tests ✓; web
  [::1] picker 375×812 (161×192 card, 112 px avatar), 320×568, 768×1024 (120 px), no horizontal scroll; the button opens
  "Grown-ups check" with next=/parent/children. Suggested commit: "Profile picker: bigger avatar and a grown-up add-a-child
  button (#114)".

## 2026-11-05 (side session, #113, committed as 536b5b9)
- claude · #113 lesson reward shows "Today's words": one card per new word (56 px picture + the Armenian word, fitted
  with `wordFontSize`) under the sticker, the intro's seeds grown; one screen-reader label lists them in English. Not
  shown for practice-only lessons, below 640 px tall, or on short windows (< 700 px) when a new Buddy outfit also shows
  (measured: that reward scrolled 69 px at 375×667). Files: `src/app/lesson.tsx`,
  `src/features/lesson/{artSizes.ts,artSizes.test.ts}`. Checks: `npm run check` — tsc, ESLint, Jest 74 suites / 307 tests
  ✓; web [::1] reward 375×667 (row ends 512, Back home 571), 375×812 (644/716), 768×1024 (716/928), no scroll; console only
  shows the browser blocking `navigator.vibrate` for scripted taps. Suggested commit: "Lesson reward: today's new words
  (#113)".

## 2026-11-05 (side session, #115, committed as d234a39)
- claude · #115 rhyme step fits 375×667 (it scrolled 50 px with the Family rhyme). On windows under 700 px tall
  (`lessonArtSizes`: `songEnglishOnTap`, `songTitleSize`, `songPicture` 24): a line's English shows once it's tapped (the
  screen-reader label always has it), the rhyme title uses the 22 px heading size, and the stacked line pictures are 24 px
  so they match the two-line text height instead of setting it. Budget test from the 375×667 measurements (line 89 → 72
  px, ≥ 50 px saved with one line open). Files: `src/app/lesson.tsx`, `src/features/lesson/{artSizes.ts,artSizes.test.ts}`.
  Checks: `npm run check` — tsc, ESLint, Jest 74 suites / 306 tests ✓; web [::1] 375×667: "Together" and "Yummy food"
  rhymes with Next at 571 and no scroll, a tapped line shows its English. The long Family rhyme was not reachable on the
  test profile (all Family words learned), so it's covered by the budget test. Suggested commit: "Lesson rhyme fits
  short phones: English on tap, smaller pictures (#115)".

## 2026-11-05 (side session, review pass 2 + #112, committed as 87c18a5)
- claude · Review pass 2 at 375×812 (profile picker, lesson rhyme and reward) → new tasks #112–#115. #112 done: each rhyme
  line shows the pictures of its words. `src/features/lesson/rhymeWords.ts`: `lineWordIds` (song's words matched inside
  inflected forms, longest first so մորաքույր doesn't add քույր, at most 2) and `keepLastWord` (a ≤ 3-letter last word
  keeps a no-break space, so "սիրուն է։" stays together). Pictures sit in a small column beside the text (32 px; 40 on
  windows ≥ 860 px tall via `lessonArtSizes.songPicture`) and add no height. Files: `src/app/lesson.tsx`,
  `src/features/lesson/{rhymeWords.ts,rhymeWords.test.ts,artSizes.ts,artSizes.test.ts}`. Checks: `npm run check` — tsc,
  ESLint, Jest 74 suites / 305 tests ✓; web [::1] rhyme step 375×812 (lines end 677, Next at 716, no scroll) and 768×1024;
  at 375×667 the step scrolls 50 px as it did before (picture column 68 px ≤ 69 px text) → #115. Suggested commit:
  "Lesson rhyme: pictures for each line's words (#112)".

## 2026-11-05 (side session, #111, committed as 81678e6)
- claude · #111 boy avatar: the default (preselected) avatar used the "child" word picture, a small full-body figure whose
  face came out half the size of the brother/sister portraits. New avatar-only portrait in `src/art/avatars.ts`
  (`AVATAR_PORTRAITS`, typed by `AvatarWordId`; head and shoulders, green shirt, brown hair, ears) used by
  `ProfileAvatar`; the word picture is unchanged. Phone onboarding avatars 64 → 80 px (≤ 80 % of the tile: 71 px at
  320 px; short windows 56, tablets unchanged). Files: `src/art/{avatars.ts,art.test.ts}`,
  `src/features/profiles/{ProfileAvatar.tsx,onboardingLayout.ts,onboardingLayout.test.ts}`. Checks: `npm run check` —
  tsc, ESLint, Jest 73 suites / 302 tests ✓ (portraits under the SVG rule tests); web [::1] onboarding 375×812 (80 px in
  106 px tiles, no scroll), 320×812 (71/89), 375×667 (56, unchanged), 768×1024 (134, unchanged), Home chip shows the
  portrait; no console errors. Suggested commit: "Avatars: boy portrait and bigger avatars on phones (#111)".

## 2026-11-05 (side session, #110, committed as 3b334d3)
- claude · #110 Letters sheet example: picture 70 → 96 px (the drawing read as ~44 px) and the sheet's letter coloured
  inside the example word (`src/features/letters/exampleHighlight.ts`: first upper/lower match, two-character letters
  too; e.g. **բ**ադ, ար**և**) in the big letters' colour. Files: `src/features/letters/{LetterDetail.tsx,
  exampleHighlight.ts,exampleHighlight.test.ts}`. Checks: `npm run check` — tsc, ESLint, Jest 73 suites / 302 tests ✓
  (every alphabet example contains its letter and rebuilds from the parts); web [::1] Ben and Yev sheets at 375×812,
  Ben at 768×1024: buttons on screen, no console errors. Suggested commit: "Letters: bigger example picture and the
  letter coloured in the word (#110)".

## 2026-11-05 (side session, review pass + #109, committed as 06f1da0)
- claude · Review pass at 375×812 (lesson intro and word card, Letters sheet, onboarding, parent gate) → new tasks
  #109–#111. #109 done: the lesson intro now leads with the theme's Armenian name (44 px, sized by `wordFontSize` over
  the content column) with English under it, and shows one sleeping `seed` per new word (none for practice lessons;
  left out below 640 px tall via `lessonArtSizes.introSeeds`, since at 320×568 the row made the step scroll 62 px). Header
  label "Ընտանիք, Family". Files: `src/app/lesson.tsx`, `src/features/lesson/{artSizes.ts,artSizes.test.ts}`. Checks:
  `npm run check` — tsc, ESLint, Jest 72 suites / 300 tests ✓; web [::1] intro at 375×812 (Let's go! at 716), 375×667,
  320×568 (no seeds, no scroll), 768×1024: no scroll, no horizontal scroll. Suggested commit: "Lesson intro: Armenian theme
  name and a seed per new word (#109)".

## 2026-11-05 (side session, #107, committed as b695b93)
- claude · #107 sticker book: the 23 identical empty dashed slots looked unfinished. New `starSlot` icon in
  `src/art/icons.ts` (pale cream star with a grey outline, no face, so it doesn't hint at the next sticker) drawn at 60% of
  the sticker art size and 0.7 opacity in each empty slot by `StickerTile`; the slot label is unchanged. Files:
  `src/art/icons.ts`, `src/features/stickers/StickerTile.tsx`. Checks: `npm run check` — tsc, ESLint, Jest 72 suites / 299
  tests ✓ (art rule tests cover the icon); web [::1] Sticker book 375×812 and 768×1024: 23 starred slots, earned sticker
  stands out, no horizontal scroll. Suggested commit: "Stickers: a faint drawn star in empty slots (#107)".

## 2026-11-05 (side session, #106, committed as 7d9c87c)
- claude · #106 theme page: words not learned yet showed a grey "?" and "Learn it in a lesson!", text a pre-reader can't
  read. New `seed` icon in `src/art/icons.ts` (a sleeping seed with closed eyes and pink cheeks in a soil mound, a tiny
  two-leaf shoot; STYLE.md outline and palette; `sprout` stays Memory's card back) shown at word-picture size and faded
  (opacity 0.55) on those cards; the sentence stays only in the screen-reader label. Files: `src/art/icons.ts`,
  `src/app/theme/[id].tsx`. Checks: `npm run check` — tsc, ESLint, Jest 72 suites / 299 tests ✓ (art rule tests cover the
  new icon); web [::1] Family page 375×812 and 768×1024: 9 seeds beside 3 learned words, 9 labels, no visible sentence or
  "?", no horizontal scroll. Suggested commit: "Theme page: a sleeping seed for words not learned yet (#106)".

## 2026-11-05 (side session, #108, committed as 1eaaf1d)
- claude · #108 theme page header at 320 px: the "12/12" count wrapped under the title because the title box had
  `minWidth: '50%'` (144 px; 64 + 16 + 144 + 16 + 54 > 288). The box's `minWidth` is now `themeHeaderTitleWidth` (the
  width the title font is fitted to, 72 px kept for the count). Files: `src/app/theme/[id].tsx`,
  `src/features/home/themeTitle.test.ts`. Checks: `npm run check` — tsc, ESLint, Jest 72 suites / 299 tests ✓; web localhost
  Family page 320×640: picture, title (22 px), count on one row; 375 and 768 unchanged; no console errors. Suggested commit:
  "Theme page: count stays beside the title on 320 px phones (#108)".

## 2026-11-05 (side session, #105, committed as c3e31f1)
- claude · #105 word names never break mid-word. Audit of the longest words (նարնջագույն 11 letters, վարդագույն 10,
  մորաքույր/ժամացույց 9; 44 px widths measured on the web, up to 298 px) against every box that shows one word: lesson word
  card and Find prompt broke at 375, Read rows at 320, theme page cards and Memory word cards (box ~86 px at 375) broke,
  parent tiles cut with an ellipsis. New `src/ui/wordFit.ts` (box per component from the window width, Memory from
  `memoryLayout`, prompts lose the voice button's room only when a recording exists) + `wordFontSize`; `fitFontSize`'s
  minimum now applies to the size on screen. Used in `app/lesson.tsx`, `ChoiceGame.tsx`, `MemoryGame.tsx`,
  `app/theme/[id].tsx`, `app/parent/index.tsx` (inline sizes keep `maxFontSizeMultiplier`). Checks: `npm run check` — tsc,
  ESLint, Jest 72 suites / 298 tests ✓ (new test: 104 words × 7 boxes × 320–1024 px × text scale 1/1.5); web Family page
  (localhost profile, viewed only): 375 aunt 19 px, 320 aunt 15 px, all one line, 768 all 22 px; no console errors. Games,
  lesson and parent tiles checked by the test only (no profile there has met a long word). Found #108. Suggested commit:
  "Words: long names shrink instead of breaking mid-word (#105)".

## 2026-11-05 (side session, #104, committed as 1f8fc7f)
- claude · Design review at 375×812 (Home, theme page, Stickers, Letters) → new tasks #104–#107. #104 done: theme names
  no longer break mid-word. `src/ui/fitFontSize.ts` sizes text from its longest word (0.75 em per letter; widest measured on
  the web 0.74) and `src/features/home/themeTitle.ts` gives the Home card and theme header text boxes from the window width
  (system text scale capped at `DISPLAY_MAX_FONT_SCALE`); used in `ThemeCard.tsx` and `app/theme/[id].tsx`. 375: Feelings
  18 → 14 px, Toys/Animals 16, others 18; 320: every name one line (11–18); 768: all 18. `onLayout` was tried first and
  dropped: it gives a first frame at the old size and, in a hidden preview pane, never fires (no requestAnimationFrame).
  Files: `src/ui/{fitFontSize.ts,fitFontSize.test.ts}`, `src/features/home/{themeTitle.ts,themeTitle.test.ts,ThemeCard.tsx}`,
  `src/app/theme/[id].tsx`. Checks: `npm run check` — tsc, ESLint, Jest 71 suites / 295 tests ✓; web Home 375×812, 320×640,
  768×1024 (reloaded at each size); theme header for a locked long-name theme covered by tests only. Suggested commit:
  "Home: long theme names shrink instead of breaking mid-word (#104)".

## 2026-11-05 (side session, #103, committed as 659cd7c)
- claude · #103 Read Back on screen at 375×667 with Buddy in Armenian + English: picture and rows unchanged; `choiceLayout`
  returns `gap` (`spacing.sm` on windows under 760 px tall, `spacing.md` otherwise) and `ChoiceGame` uses it for the screen and
  the answer list (Find too). New budget test. Files: `src/features/games/{choiceLayout.ts,choiceLayout.test.ts,ChoiceGame.tsx}`.
  Checks: `npm run check` — tsc, ESLint, Jest 69 suites / 288 tests ✓; web 375×667 (clean origin, two-line prompt put into
  the bubble in the page, profile settings untouched): rows end 570, Back 587–651, no scroll; 375×812 unchanged (Back
  732–796); 320×568 still scrolls as before; no console errors. Suggested commit: "Games: half gaps on short phones so Read's
  Back fits at 375×667 (#103)".

## 2026-11-05 (side session, #102, committed as bc3c664)
- claude · #102 Read fits 375×812: the overflow came from Buddy's two-line Armenian + English prompt. `choiceLayout` gives
  regular phones answer rows of `TOUCH_MIN + 24` (88) instead of 104; tablets keep 104, short-window compact rows stay 80.
  New budget test (picture + three rows + Back inside 812 px with a two-line prompt; fails on the old rows). Files:
  `src/features/games/{choiceLayout.ts,choiceLayout.test.ts}`. Checks: `npm run check` — tsc, ESLint, Jest 69 suites / 287
  tests ✓; web (Armenian + English Buddy) 375×812: rows end 690, Back 732–796, no scroll; 430×932 and 768×1024 fit; no console
  errors. Found: 375×667 in that mode Back is 39 px below the fold → #103. Suggested commit: "Read: fits 375×812 phones with
  the two-line prompt (#102)".

## 2026-11-05 (side session, #101, committed as 12ca8a5)
- claude · #101 Find answer pictures fill tall phones: `choiceLayout` gets a tall-phone tier (`CHOICE_TALL_FROM = 800`, width
  below `WIDE_BREAKPOINT`) that sizes the Find picture to the answer card's inner width, capped at 128 (375×812 and 430×932:
  80 → 128 px, last row ends at 643 with Back at 732 on 375×812). Short phones (375×667, 320×568) and tablets unchanged; Read
  unchanged because it already fills 375×812 → new task #102. Files: `src/features/games/{choiceLayout.ts,choiceLayout.test.ts}`.
  Checks: `npm run check` — tsc, ESLint, Jest 69 suites / 285 tests ✓; web 375×812, 430×932, 375×667, 320×568, 768×1024: no
  horizontal scroll, no console errors. Commit: none yet (suggested "Find: bigger answer pictures on tall phones (#101)").

## 2026-11-05 (00:30 run; lock taken 00:34)
- claude · Verification only, no code change: in a clean origin (127.0.0.1:8095, 375×812) the theme "Start a lesson" button shows the
  drawn play icon (#100) and a right answer in Find shows the drawn tick; no console errors. New task #101 (Find answer pictures
  on tall phones). Files: `PROJECT_STATUS.md`, `AI_TASKS.md`, `AI_CHANGELOG.md`. Checks: `npm run check` — tsc, ESLint, Jest
  69 suites / 283 tests ✓. Commit: "Notes: 00:30 run checkpoint".

## 2026-11-04 (23:30 run; lock taken 23:34)
- claude · #94 tracing canvas leaves room for the screen-reader "Mark as traced" button: `traceCanvasSize` gets a
  `markButton` flag (`TRACE_MARK_BUTTON_CHROME = TOUCH_MIN + spacing.md`), screen-reader state lifted to `TraceCanvas`.
  Files: `src/features/letters/{tracing.ts,TraceCanvas.tsx,tracing.test.ts}`. Checks: `npm run check` — tsc, ESLint,
  Jest 66 suites / 270 tests ✓; web 1024×768 + 375×812: Clear/Done inside the window; reviewer subagent: no blockers.
  Commit: "Letters: tracing canvas leaves room for Mark as traced (#94)".
- claude · #95 letter sheet keeps the 720 px content column on tablets (centred) instead of full-width buttons. File:
  `src/features/letters/LetterDetail.tsx`. Checks: `npm run check` — tsc, ESLint, Jest 66 / 270 ✓; web 1024×768 sheet +
  tracing view, 375×812 unchanged; no console errors after reload (one HMR-only error between edits). Commit: "Letters:
  sheet keeps the content width on tablets (#95)".
- claude · #96 Games list pictures 56 → 88 px from 600 px wide. Files: `src/features/games/gameListLayout{,.test}.ts`,
  `src/app/games/index.tsx`. Checks: `npm run check` ✓ (67 suites / 271 tests); web 1024×768 + 375×812 (HMR-only console
  errors between edits, none after reload). Commit: "Games: bigger game pictures on tablets (#96)".
- claude · #97 grown-up upgrade buttons grey and below the child's action on the lesson, Games list, game shell and game
  finish screens. Files: `src/app/lesson.tsx`, `src/app/games/index.tsx`, `src/features/games/{GameShell,GameDoneActions}.tsx`,
  new `src/features/games/grownUpPrompts.test.ts`. Checks: `npm run check` ✓ (68 suites / 279 tests); guard fails on old
  code; web 375×812 out-of-games screens. Commit: "Kid screens: grown-up prompts grey, after the child's button (#97)".
- claude · #98 Games list: disabled game cards dimmed (opacity 0.5) when no games are left today. Files:
  `src/app/games/index.tsx`, `src/features/games/grownUpPrompts.test.ts`. Checks: `npm run check` ✓ (68 / 280); web 375×812.
  Commit: "Games: dim the cards when today's games are used up (#98)".
- claude · Reviewer subagent on #96/#97: no behaviour findings; low note taken — the #97 guard now matches whole multi-line
  `<BigButton … />` blocks. File: `src/features/games/grownUpPrompts.test.ts`. Checks: `npm run check` ✓ (68 / 280).
- claude · #99 parent report: drawn flame on the Streak tile (was 🔥), "Share with family" without 📤. Files:
  `src/app/parent/index.tsx`, `src/features/report/WeeklyShareCard.tsx`, new `src/ui/noEmojiLabels.test.ts`. Checks: `npm run
  check` ✓ (69 suites / 282 tests); guard fails on old code; web 1024×768 parent report. Remaining button emoji → #100.
  Commit: "Parent report: drawn streak flame, plain share label (#99)".
- claude · #100 last emoji buttons → drawn icons: new `chart`, `clock`, `bulb`, `gear`, `play` icons (house style, art
  SVG rules); parent menu (Full progress, Reminder, How it works, Settings, Privacy → `lock`) and theme "Start a lesson".
  Files: `src/art/icons.ts`, `src/app/parent/index.tsx`, `src/app/theme/[id].tsx`, `src/ui/noEmojiLabels.test.ts` (KNOWN
  emptied). Checks: `npm run check` ✓ (69 / 282); web 375×812 parent menu + icon contact sheet. Not seen: theme Start button
  (every free theme learned in the test profile). Commit: "Icons: drawn chart, clock, bulb, gear, play replace button emoji (#100)".
- claude · Reviewer subagent on #99/#100: no blockers; lows fixed — bulb rays get an ink outline (were ~1.2:1 on orange),
  Privacy title 🔒 → drawn lock, Read/Find right-answer ✅ → new drawn `check` icon, guard widened to `label={…}` strings and
  emoji-only `<Text>` pictures (fails on the old code), redundant KNOWN list removed. Files: `src/art/icons.ts`,
  `src/app/parent/privacy.tsx`, `src/features/games/ChoiceGame.tsx`, `src/ui/noEmojiLabels.test.ts`. Checks: `npm run check` ✓
  (69 / 283); web: Privacy title. Not seen: game tick (test profile used today's 3 games). Remaining emoji by design: WordArt
  / avatar fallbacks, share text, reminder notification title.

## 2026-11-04 (22:30 run; lock taken 22:34)
- claude · #92 sheep (letter sheet, Vo): wool `#FFFFFF` → cream `#FFF3DC`, face + ears → grey `#B8BCC6`, hidden
  opacity-0 path replaced by a white highlight (STYLE.md palette). File: `src/art/words/letters.ts`. Checks: `npm run
  check` — tsc, ESLint, Jest 65 suites / 268 tests ✓; web 375×812 Vo sheet screenshot, no console errors. Commit 50eec77.
- claude · #93 removed 12 invisible (`opacity="0"`) SVG elements from `src/art/words/{animals,letters,body,food,family,clothes}.ts`;
  new guard `src/art/hiddenShapes.test.ts` (checked to fail before the removal). Checks: `npm run check` — tsc, ESLint, Jest
  66 suites / 269 tests ✓; web Family + Food theme pages, Vo sheet: unchanged, no console errors. Commit: "Art: drop hidden shapes… (#93)".

## 2026-11-04 (21:30 run; lock taken 21:34)
- claude · #85 review (reviewer subagent): no blockers. Low 1 (tight rhyme gap also on 700–859 px tall tablets) is
  intended — the fit depends on height and `artSizes.test.ts` already pins 1024×768 → `songGap: sm`; low 2 (812 px
  threshold has little slack) → recorded as unverified on device (#10). No code change.
- claude · #86 Home: "Start today's lesson" moved above the free-words-finished grown-up card, so at 375×667 it is
  fully on screen (302–382, was 590–670 in a 635 px area) and the child's action leads instead of the upgrade prompt.
  Files: `src/app/index.tsx`, `src/features/home/homeOrder.test.ts`. Checks: `npm run check` — tsc, ESLint, Jest
  63 suites / 260 tests ✓; web 375×667 screenshot, no console errors. Short-phone sweep: Letters, Stickers, theme
  page, Games list scroll as lists (expected); Memory/Find showed the daily-limit gate; profiles fit. Commit: see git log.
- claude · #87 Onboarding on short phones: below 700 px tall the gap tightens (24 → 16) and avatar tiles become 5:4, so
  "Let's go!" is on screen at 375×667 (533–597, was 624–688 in a 635 px area; Skip still scrolls). New token
  `SHORT_WINDOW_BELOW` shared with the lesson. Files: `src/app/onboarding.tsx`, `src/features/profiles/onboardingLayout{,.test}.ts`,
  `src/ui/tokens.ts`, `src/features/lesson/artSizes.ts`. Checks: `npm run check` — tsc, ESLint, Jest 64 suites / 262
  tests ✓; web 375×667 screenshot + 375×812 unchanged; Memory board at 375×667 fits (no change). Commit: see git log.
- claude · #87 follow-up (reviewer subagent on #86/#87: no blockers): avatar picture 56 on short phones, so a 5:4 tile
  of a 320 px phone (~89×71) holds it with the 4 px selected border (was ~1 px over). Other reviewer lows: the Home
  order test reads source text (fails loudly on a rename: kept); onboarding wiring has no render test (kept: pure
  helper tested, web-checked). Files: `src/features/profiles/onboardingLayout{,.test}.ts`. Checks: `npm run check` ✓
  (64 suites / 263 tests). Commit: see git log.
- claude · #88 Letter tracing fits short phones: canvas side = min(width cap, 90 % of the height − 356 px sheet chrome,
  floor 200). 375×667: 323 → 244, the whole letter is in the sheet (333–577) and Clear/Done take the slot at 595–659
  when no screen reader is on (web always reports one, so the preview also shows "Mark as traced" and Done scrolls
  there); 375×812 unchanged (323). Files: `src/features/letters/{tracing,tracing.test,TraceCanvas}.ts(x)`. Checks:
  `npm run check` ✓; web: traced Ben at 375×667 → "Wonderful tracing!", 2 of 39 traced (preview data only). Not
  verified on device (#10). Commit: see git log.
- claude + implementer subagent · #89 Letter sheet pictures: 18 new drawings in the house style for the alphabet
  examples that aren't theme words (they showed emoji). Contact sheet reviewed: snake (body join, tongue over the face),
  football (white on the white tile) and rose (read as a heart with a face) redrawn. `letterExampleArtId` picks the theme
  word's drawing, else `letters.<english_slug>`. Files: `src/art/words/{letters,index}.ts`,
  `src/features/letters/{exampleArt,exampleArt.test,LetterDetail}.ts(x)`. Checks: `npm run check` — tsc, ESLint, Jest
  65 suites / 266 tests ✓ (first run caught a direct `@/content/alphabet` import → now via `@/content/packs`); web 375×812:
  Ben shows the drawn duck, no console errors. Commit: see git log.
- claude · #88/#89 review (reviewer subagent): no actionable defects (score uses the real canvas size, remount on size
  change, no `letters` theme-id collision, SVG subset respected).
- claude · #90 Parent intro: the five steps' emoji replaced with the app's drawn art (Buddy waving, read, voice,
  clock, sprout; 96 px). Files: `src/features/parent/introSteps{,.test}.ts`, `src/app/parent/intro.tsx`. Checks: `npm
  run check` — tsc, ESLint, Jest 65 suites / 267 tests ✓; web 375×667: all 5 steps (through the parent gate), no
  console errors. Commit: see git log.
- claude · #91 Home, free words finished: one Buddy (cheer, says the free-words-finished line instead of the greeting),
  the extra card removed, "Ask a grown-up for 80 more words" in the secondary grey so "Start today's lesson" is the one
  orange action (fits kids-store guidance against pushing purchases at children). Files: `src/app/index.tsx`,
  `src/features/home/homeOrder.test.ts`. Checks: `npm run check` — 65 suites / 268 tests ✓; web 375×667 screenshot.
  Commit: see git log.
- claude · #90/#91 review (reviewer subagent): no defects; white on `textMuted` 4.98:1 (AA); nits kept (free-done
  Buddy line has no name by design; source-regex guard tests; intro WordArt fallback guarded by its test). Web 1024×768
  Home checked. Durable decisions added to AI_DECISIONS.md (short-window rule, grown-up prompts secondary, no emoji
  pictures). Run checkpoint: everything up to this notes commit pushed; preview data restored except Ben marked traced.

## 2026-11-04 (20:30 run)
- claude · #80 Hills scene crop on wide screens: clouds moved down (art top y = 22), `sceneHeight` keeps the
  `slice` crop above `SCENE_ART_TOP` (grows past 240 only above ~980 px: 1024 → 251, 1366 → 335; phones unchanged). Files:
  `src/art/scenes.ts`, `src/ui/SceneBackdrop{,.test}.tsx/ts`. Checks: `npm run check` — tsc, ESLint, Jest
  60 suites / 250 tests ✓; web: lesson reward at 375, 1024×768, 1366×1024, Home at 1024; no console errors.
  Codex still unavailable (#11).
- claude · #81 Bigger reward star (180) and new sticker (128) on ≥ 600×700 windows unless a new-outfit row shows;
  lesson art sizes moved to `src/features/lesson/artSizes{,.test}.ts`; `src/app/lesson.tsx` uses it. Logged #82
  (pre-existing ~21 px overflow with an outfit row at 1024×768).
- reviewer subagent on #80 + #81: no blocking findings; 3 low fixed (threshold tests, "~980 px" wording + 979 test,
  path guard fails on non-absolute commands). Checks: `npm run check` — Jest 61 suites / 255 tests ✓.
- claude · #83 Read game fits short phones: `src/features/games/choiceLayout{,.test}.ts`, `ChoiceGame.tsx` uses it
  (compact picture + rows below 760 px tall). Also checked: Read game at 1024×768 fits (picture kept at 128 px —
  bigger would push the third answer off a 768-tall iPad). Checks: `npm run check` — Jest 62 suites / 258 tests ✓;
  web export ✓; web 375×667 Read + Find, 1024×768 Read. Fast-refresh-only console errors during the edit (import
  added after the call); none on fresh loads. Preview test data (games-today count) restored afterwards.
- reviewer subagent on #83: no findings.
- claude · #82 Reward with a new outfit fits tablets: sticker + outfit side by side from 600 px; big art with an
  outfit only from 768 px. Files: `src/app/lesson.tsx`, `src/features/lesson/artSizes{,.test}.ts`. Checks:
  `npm run check` — Jest 62 suites / 258 tests ✓; web (preview profile temporarily premium to reach the crown
  unlock, restored after): 375×812, 600×800, 768×1024, 1024×768 all without scroll.
- reviewer subagent on #82: no findings.
- claude · #84 Compact lesson on short phones (< 700 px tall). Files: `src/app/lesson.tsx`,
  `src/features/lesson/artSizes{,.test}.ts`. Checks: `npm run check` — Jest 62 suites / 258 tests ✓; web 375×667
  every step (rhyme 13 px over, noted), 375×812 unchanged. Logged #85 (rhyme at 375×812, pre-existing).
- reviewer subagent on #84: no findings (nit fixed: `tallTablet` reuses `LESSON_COMPACT_BELOW`).
- claude · #85 Rhyme step fits 375×812: tight gap on that step below 860 px tall. Files: `src/app/lesson.tsx`,
  `src/features/lesson/artSizes{,.test}.ts`. Checks: `npm run check` — Jest 62 suites / 259 tests ✓; web 375×812
  rhyme 620/620, 375×667 unchanged (488/475).

## 2026-11-04 (profile picker on tablets, #79)
- claude · From 600 px the "Who is learning?" cards are 3 a row (31 %, near-square) with 120 px avatars (was 2 long
  flat cards, 82 px). Phones unchanged.
- Files: `src/app/profiles.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 60 suites / 248 tests ✓. Web 1024×768: card 223×224 px, avatar 120 px. No profile
  switched.
- Commit: see git log ("Profile picker fits tablets").

## 2026-11-04 (onboarding avatars fill their tiles on tablets, #78)
- claude · Onboarding's avatar pictures stayed 64 px in 223 px tiles at 1024 px (29 % of the tile). From 600 px the
  picture is 60 % of the tile (≤ 140 px), as on phones. Phones unchanged (64 px in 106 px tiles).
- Files: `src/app/onboarding.tsx`.
- Checks: tsc ✓, ESLint ✓, Jest 60 suites / 248 tests ✓. Web: 1024×768 → 134 px pictures in 223 px tiles; 375 px →
  64 / 106 px; no overflow, no console errors. Onboarding not submitted (no profile created).
- Commit: see git log ("Onboarding avatars fill their tiles on tablets").

## 2026-11-04 (Expo SDK 58 patch updates, #77)
- claude · `npx expo install --fix`: expo 58.0.23, expo-router 58.0.30, expo-asset 58.0.20, expo-constants 58.0.15,
  expo-linking 58.0.16, expo-notifications 58.1.8, expo-splash-screen 58.0.13, @expo/metro-runtime 58.0.17,
  react-native-safe-area-context 5.11.1, jest-expo 58.0.14 (dev).
- Files: `package.json`, `package-lock.json`.
- Checks: tsc ✓, ESLint ✓, Jest 60 suites / 248 tests ✓; expo-doctor 20/20 (was 19/20); `expo export --platform web`
  ✓; `npm audit --omit=dev` 8 → 5 moderate, 0 high. Web (fresh server): Home, theme page, lesson render, no console
  errors (resolve errors seen only from the old server while packages were being replaced). Native not built (#10).
- Commit: see git log ("Expo SDK 58 patch updates").

## 2026-11-04 (Family voice list two a row on tablets, #76)
- claude · Parent → Family voice showed one full-width row per word (104 words) on tablets; from 600 px it now shows
  two words a row (`SectionList` rows of pairs via new `lib/chunk`, a spacer keeps an odd last word half-width).
  Phones unchanged (one a row). Recording logic untouched.
- Files: `src/app/parent/voice.tsx`, `src/lib/chunk.ts` (+ test).
- Checks: tsc ✓, ESLint ✓, Jest 60 suites / 248 tests ✓ (incl. the recording-file source guard). Web: 1024×768 →
  Record buttons side by side (316 px each), no overflow; 375 px → one a row (307 px), no console errors. Not checked:
  a recorded word's Record/Play/Delete wrap at half width (needs a web mic grant; buttons wrap 2 + 1 by their 120 px
  min width).
- Commit: see git log ("Family voice list two a row on tablets").

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

## 2026-11-13 19:30 run
- Pacing stop: Claude weekly 61 % (5-hour 31 %), Codex blocked (#11). No app change. Files: PROJECT_STATUS.md,
  AI_CHANGELOG.md. Checks not run (notes only).

## 2026-11-14 19:30 run
- Pacing stop: Claude weekly 66 % (5-hour 15 %), Codex blocked (#11). No app change. Files: PROJECT_STATUS.md,
  AI_CHANGELOG.md. Checks not run (notes only).

## 2026-11-14 20:30 run
- claude · #155 3D-style Buddy: `src/art/buddy.ts` shades head, ears, body and the think paw with stacked flat tones
  (`#874621` → `#A0582F` → `#B06637`), adds a ground shadow, muzzle shade, eye catchlights, nose shine and a warm brown
  fur outline; blink lids now use the lit tone. No gradients (gradient ids clash across Buddy instances on web).
  `src/art/buddy.test.ts`: lids use the lit tone, the lit circle covers each lid and stays inside the head (fails when
  the lit circle shrinks — mutation-checked). `src/art/STYLE.md` notes the Buddy shading exception. New task #177.
- Checks: `npm run check` (tsc ✓, ESLint ✓, Jest 95 suites / 426 tests ✓). Visual: resvg contact sheet of 7 poses,
  4 blinks, 3 outfits (before/after); web Home (localhost:8095) renders the new Buddy with its hat, no console errors.
  Not verified: native rendering (Xcode blocker #10). Codex review skipped (Codex blocked, #11); no subagent review
  (art-only diff, usage pacing at 66 % weekly).
