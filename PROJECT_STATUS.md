# Project status — Little Roots

_Updated: 2026-11-11 17:30 run. Updated at the end of every session._

## Where things stand
- Expo SDK 58 / RN 0.88 / React 19 / strict TS kids app teaching the family language (Armenian first). Offline, no
  ads, no tracking, parent gate. Shipped waves 1–9 + accessibility pass; see `FINAL_REPORT.md` and the history in
  `PROGRESS.md` (frozen log of the first build sprint, 2026-10-30).
- 2026-11-02 evening: kid-safe error screen, app-wide audio session (+ iOS silent-switch fix after recording),
  gentler/throttled sound effects, store config (privacy manifest, no background audio, trimmed Android permissions,
  `expo-asset`), store privacy answers drafted (`STORE_PRIVACY_ANSWERS.md`).
- 2026-11-03: #5 startup splash (no default-state flash, `lr:startup` measure), #13 audit triage (accepted, build
  tooling only), #8 Maestro smoke flows (not run: no device), #6 content only via `ACTIVE_PACK`, #7 per-language
  progress keys + migration, #9 share-image decision, #15 "1 new word" copy.
- 2026-11-03 second batch: #17 recording kit (later removed: no voice), #18 docs refresh, #19 CI web export,
  #20 Pressable accessibility guard.
- 2026-11-03 third batch: **voice removed** (owner's decision) and a design pass — visual hints, tablet layout, tap
  feedback, drawn icons, inviting locked themes, confetti.
- 2026-11-03 19:00 run: #32 fresh-install path ✓ (clean origin), #33 sticker labels for screen readers, #31 drawn
  memory-card backs + win confetti, #21 selected state announced on web, #34 checked
  (no change), #35 emoji-free button labels + drawn locks.
- 2026-11-03 20:00 run: #36 research → #41 store-rule check (compliant), #37 safe haptics helper, #38 parent
  Vibration on/off setting.
- 2026-11-03 21:00 run: #39 large system text capped on display text and kid buttons (guard test; device check
  pending #10), #42 dependency audit (no change), #43 logged (web-only focus/title, low), animation check (all native driver, loops cleaned up, reduce motion respected) → #44 logged.
- 2026-11-03 22:00 run: #44 Buddy pauses on covered screens (web-checked), #45 touch targets ≥ 48 (no change), #46
  independent review of #7: nothing blocking, 1 low fixed (failed old-key cleanup no longer blocks load) + 2 tests;
  #47 proposal logged (owner).
- 2026-11-03 23:00 run: #48 confetti unmounts after its burst (web-checked), #43 web tab title per screen (web-checked;
  focus part → #49, lowest), resource audit (nothing unbounded).
- 2026-11-04 00:00 run: storage robustness check (no change needed), screen-reader language → #50 (device check
  first). Gate and web smoke green.
- 2026-11-04 07:50: owner's four top priorities added (#51–#54). #51 competitor study done (`RESEARCH.md`) →
  new tasks #55–#59. Next: #52 picture quality, then #53 more content, #54 parent weekly report.
- 2026-11-04: **Family voice (#60, owner's top priority; replaces "No voice")** — parent records words on
  Parent → Family voice; played on lesson cards/rounds, theme page, Find; on-device only, per child + language; mic
  asked only there. Web-verified; native check #61 blocked on Xcode.
- Checks (2026-11-05, after #124: 76 suites / 317 tests; 2026-11-05 00:35, unchanged code; 2026-11-04 23:54, after #100 review): `npm run check` — tsc, ESLint, Jest 69 suites / 283 tests; (after #93: 66 / 269); web export ✓ (after #83); expo-doctor 20/20 (after #77).
- Checks (working tree, 2026-11-04 00:05): tsc, ESLint, Jest 46 suites / 189 tests; expo-doctor 20/20 (last run 2026-11-03).
- 2026-11-04: #52 picture pass (4 redraws, bike fix), #53 Family + Food grow to 12 words with new drawings (104 words), #54 clearer parent weekly report, #59 first-lesson tap hint.
- 2026-11-04 17:30 run: #57 Home "Next up" marker (Buddy badge + "Next" ribbon on the theme new words come from;
  web-checked 375 + 800 px); #55 soft hills scene behind Home and the lesson reward (web-checked 375 + 1024 px); #56 Buddy wave/point/proud
  poses + idle blink (web-checked); #62 second rhymes for Family + Food (Armenian → proofreading list);
  #64 store-rule research (age-rating draft, no app change); #63 hills behind game finish screens.
- 2026-11-04 18:30 run: #58 Buddy dress-up (hat / glasses / crown unlocked by stickers; picker on Stickers; worn on
  Home + lesson; reviewer subagent findings fixed; web 320 / 375 / 1024 px). #66 sticker book fits wide screens (4 columns ≥ 600 px,
  art scales with tile); #67 lesson reward shows a newly unlocked outfit (web-checked 5 → 6 stickers); #68 iPad rotates to landscape
  (finding, owner decision; landscape layouts fit at 1024×768). Screen sweep at 320 px: no horizontal overflow. #69 theme page 3 a row on wide screens. #70 BigButton
  labels spoken without emoji. Parent area at 320 px: no overflow. #71 bigger answer pictures on wide screens.
- 2026-11-04 19:30 run: wide-screen sweep → #72 Memory board bug fixed (was 2 columns / scrolling at 1024 px; now
  4×3 sized from the content column), #73 Letters 6 a row, #74 drawn lock on the parent gate, #75 bigger lesson
  picture on tablets, #76 Family voice two a row on tablets, #77 Expo SDK 58 patch updates (doctor 20/20, audit 8 → 5
  moderate), #78 onboarding avatars fill their tiles, #79 profile picker 3 a row. Reviewer subagent on #72–#75: no
  blocking findings (comment fixed; web-only scrollbar slack noted, not fixed).
- 2026-11-04 20:30 run: #80 hills scene no longer crops its clouds past ~980 px wide; #81 bigger reward star/sticker
  on tablets; #82 new sticker + outfit side by side on tablets; #83 Read game fits iPhone SE (third answer was below
  the fold); #84 compact lesson below 700 px tall (card, rhyme, reward overflowed at 375×667); #85 rhyme fits 375×812.
  Reviewer subagents on every diff (#80/#81: 3 low fixed; #82/#83: none; #84: nit fixed; #85 not separately reviewed,
  same helper). Lesson reward + Read game at 1024 px now checked.
- 2026-11-04 21:30 run: #85 reviewed (no change: height-based gap intended, already pinned by a test); short-phone
  (375×667) sweep → #86 Home lesson button above the grown-up card, #87 onboarding "Let's go!" on screen (+ 320 px
  avatar follow-up), #88 letter tracing canvas capped by height so Done stays in the sheet; Memory, parent gate,
  profiles fit; Letters/Stickers/theme/Games scroll as lists. #89 drawn pictures for the 18 letter examples that showed
  emoji (done; snake/football/rose redrawn after a contact-sheet check); #90 parent intro emoji → drawn art. Reviewer
  on #88/#89: no defects. Reviewer subagents on #85 and #86/#87: no blockers.
- #91 Home free-words-finished: one Buddy, grown-up button secondary. Reviewer on #90/#91: no defects.
- 2026-11-04 22:30 run (short: Claude 5-hour limit at 70 %, Codex still blocked #11): #92 sheep recoloured (cream wool,
  grey face; web-checked); #93 12 hidden opacity-0 SVG shapes removed + guard test. Stopped early to keep Claude capacity.
- 2026-11-04 23:30 run (Codex still blocked #11; Claude 5-hour ~1 %, weekly 57 %): tablet/a11y sweep → #94 tracing
  canvas leaves room for the screen-reader "Mark as traced" button (Clear/Done were below 1024×768 and 375×812), #95 letter
  sheet keeps the 720 px column on tablets, #96 bigger Games pictures on tablets, #97 grown-up upgrade buttons grey and
  after the child's button on 4 more kid screens, #98 Games cards dimmed when today's games are used up, #99/#100 last UI
  emoji → drawn icons (flame, chart, clock, bulb, gear, play, lock, new check) + guard test. Reviewer subagents on every
  diff: no blockers; lows fixed. Expo deps up to date (`expo install --check`).
- 2026-11-05 00:30 run (short: last hour; Codex still blocked #11; Claude 5-hour 18 %, weekly 59 %): #100 icons seen on
  screen in a clean origin (127.0.0.1:8095, 375×812): theme "Start a lesson" drawn play icon and the Find game right-answer
  tick; no console errors. `npm run check` green (69 suites / 283 tests). Finding → #101.
- #101 done (12ca8a5): Find answer pictures 128 px on tall phones. #102 done (bc3c664): Read fits 375×812 with a two-line Armenian + English prompt. #103 done (659cd7c): Read and Find use half gaps on short windows. #104 done (1f8fc7f): theme names stay whole. #105 done (c3e31f1): word names stay whole in every word box. #108 done (1eaaf1d): theme header count stays beside the title at 320 px. #106 done (7d9c87c): unlearned words show a drawn sleeping seed. #107 done (b695b93): empty sticker slots show a faint drawn star. Review pass 2026-11-05 → #109–#111; #109 done (06f1da0): lesson intro leads with the Armenian theme name. #110 done (3b334d3): Letters sheet example picture 96 px and the letter coloured in the word. #111 done (81678e6): boy avatar portrait; phone avatars 80 px. Review pass 2 → #112–#115; #112 done (87c18a5): rhyme lines show their words as pictures. #115 done (d234a39): the rhyme step fits 375×667. #113 done (536b5b9): the reward shows today's new words. #114 done (4b6daa1): profile picker avatar 112 px and a grown-up add-a-child button. Review pass 3 (games list, tracing, parent intro) → #116–#117; #116 done (e6055f3): out of games, the child gets Trace letters and My stickers first. #118 done (d14301f): the free-plan full report shows the word count and a way back. Paywall and settings reviewed → #119–#121; #120 done (4240289): "Best value" once on the paywall. #121 done (1500857): the paywall shows the 10 Premium themes as pictures. #122 done (bdf8453): Memory opens with Buddy's "find the pairs" line (Armenian needs proofreading). Review pass 4 (Home on tablet, Family voice) → #123; #123 done (5e91b75): finished themes get a gold star badge on Home. Review 4 (reminders fine, game screens) → #124–#125; #124 done (ae7cdaa): every out-of-games screen offers Trace letters and My stickers. #125 done: one Buddy bubble on the finished-game screen. Owner decision: #119 Terms of Use link (store-critical). Next unblocked: #117 tracing start dots (3); review privacy and children screens; Memory review waits for a new day's games; #68 waits on the owner; research new scored tasks (backlog left is
  low-score: #49 1.5, #65 1.5). Native: #10/#14/#16/#39/#50/#61 check (VoiceOver: #94 canvas size).
- 2026-11-05 18:30 run: committed and pushed #125 left uncommitted by a side session (ffe0c5f; `npm run check` 76 suites /
  317 tests ✓). Then stopped: **Claude weekly limit 98 %** (cap 80 %, resets 2026-11-09 23:00 UTC; 5-hour 36 %) and Codex
  still rejects `gpt-6-sol` (#11, re-probed). No tool may implement until the weekly reset or until the owner fixes #11;
  hourly runs should only check usage and stop. #117 marked waiting-capacity.
- 2026-11-05 21:30 run: usage check only. Claude weekly 98 % (5-hour 39 %), Codex re-probed: still rejects `gpt-6-sol`
  (#11). No work started; nothing changed in the app.
- 2026-11-05 22:30 run: usage check only. Claude weekly 98 % (5-hour 40 %, weekly resets 2026-11-09 23:00 UTC),
  Codex re-probed: still rejects `gpt-6-sol` (#11; `~/.codex/config.toml` unchanged since 2026-10-30). No app change.
- 2026-11-05 23:30 run: usage check only. Claude weekly 99 % (5-hour 0 %, weekly resets 2026-11-09 23:00 UTC),
  Codex re-probed: still rejects `gpt-6-sol` (#11; config unchanged since 2026-10-30). No app change.
- 2026-11-06 00:30 run: usage check only. Claude weekly 99 % (5-hour 2 %, weekly resets 2026-11-09 23:00 UTC);
  Codex not re-probed (`~/.codex/config.toml` unchanged since 2026-10-30, so #11 still blocks). No app change.
- 2026-11-10 17:30 run: weekly limit reset (Claude 5-hour 13 %, weekly 11 %); Codex still blocked (#11). #126 done:
  delete-child warning names Family voice recordings. #117 blocked on #127 (bundle an Armenian font: system fonts differ
  per platform) → #127 done the same run: Noto Sans Armenian Bold bundled for big letters (web-checked; native → #10);
  #117 unblocked (but start points need a handwriting reference check). #129 reset warning says recordings are kept;
  #130 example word fits at 320 px; #131 font wait capped by the splash timeout. `npm run check` 77 suites / 321 tests ✓.
  Pacing: weekly 11 → 12 % this run (5-hour 21 %). To stay under the 80 % weekly cap until the 2026-11-16 reset, budget
  ~1.5 % weekly per hourly run (~13 %/day): one or two small tasks per run, then stop. Next: #117 needs a handwriting
  reference for start points (owner/native check), so prefer new review tasks; #128 (web Alert), #49 lowest.
- 2026-11-10 18:30 run: #128 done — confirm/notice dialogs go through `src/lib/dialog.ts`, so Delete child and Reset
  progress work in the web preview (browser confirm); native unchanged. `npm run check` 78 suites / 325 tests ✓;
  reviewer: no findings. Web preview not opened (server start declined in the unattended run) → check Delete child
  and Reset on web next run. Usage: 5-hour 22 %, weekly 12 %. Next: web check of #128, then a new review task
  (privacy and children screens); #117 needs a handwriting reference; #49 lowest.
- 2026-11-10 19:30 run: #128 web-checked (Reset progress confirm; Cancel keeps progress). #132 privacy text lists
  everything stored (avatar, outfit, traced letters, settings, reminder time) + Share this week line; PRIVACY.md in sync
  (test), effective date 2026-11-10 — store listing privacy URL should show the new version. `npm run check` 79 suites /
  327 tests ✓. Usage: 5-hour 0 %, weekly 13 %. #133 checked: not an app bug (no change). Next: #117 handwriting reference, new review
  tasks (Children screen with two children, Settings, Reminders at 320 px); #49 lowest.
- 2026-11-10 20:30 run: #134 Reminders time chips fill their rows (were 13 px short at 320 px; web-checked 320 + 1024 px).
  Settings at 320 px fine. `npm run check` 79 suites / 327 tests ✓. Usage: 5-hour 7 %, weekly 14 %. Next: Children
  screen with two children (needs a test child on web), #117 handwriting reference; #49 lowest.
- 2026-11-10 21:30 run: #135 Children rows fit at 320 px (long names wrap at word breaks, Edit/Delete move under them,
  aligned across rows; web-checked 320 + 1024 px). #128 Delete child checked on web. `npm run check` 79 suites / 327
  tests ✓. Usage: 5-hour 9 %, weekly 14 %.
  #136 "Playing now" tag on the active child (two or more children; 80 suites / 329 tests ✓). Next: new review tasks
  (Family voice screen at 320 px, Report with two children), #117 handwriting reference; #49 lowest.
- 2026-11-10 22:30 run: Family voice at 320 px fits. #137 its messages (microphone off + Open Settings, save/delete
  errors, saved, deleted) show in the row of the word they are about, not above the 104-word list (web-checked; 81
  suites / 332 tests ✓). #138 the Report names the child ("Mari has explored 24 words"; 82 suites / 335 tests ✓).
  Usage: 5-hour 14 %, weekly 15 %. Next: new review tasks (Paywall and Stickers at 320 px), #117 handwriting
  reference; #49 lowest.
- 2026-11-10 23:30 run: Stickers at 320 px fits (#140 logged: outfit unlock count is easy to misread). #139 paywall
  Premium theme strip in even rows (5 + 5 at 320 px, was 4 + 4 + 2; web 320/375/1024; 82 suites / 336 tests ✓).
  #140 locked outfits show a gold progress bar toward their unlock instead of "★ N" (web 320 + 1024; 82 suites /
  337 tests ✓). Usage at start: 5-hour 18 %, weekly 16 %. Next: new review tasks (Letters list and Games list at
  320 px, lesson flow on tablet), #117 handwriting reference; #49 lowest.
- 2026-11-11 00:33 run: Letters list and Games list at 320 px fit (no change). #141 lesson intro theme picture 200 px
  on tall tablets (was 140; web 1024×768 + 375×667, no scroll; 82 suites / 338 tests ✓). Usage at start: 5-hour 1 %,
  weekly 17 %. Next: review the lesson word/answer steps on tablet, #117 handwriting reference; #49 lowest.
- 2026-11-11 (owner session): #142 word pictures replaced by Microsoft Fluent Emoji 3D (MIT) — 102 bundled PNGs,
  people in Light skin tone (dark hair); colours, numbers, family and 3 letter examples stay drawn (#143 follow-up). Web-checked.
- 2026-11-11 17:30 run: #144 started — School theme (8 words, Fluent 3D pictures, rhyme; 113 theme words, 13
  themes); paywall headline now counts Premium words (was hard-coded 80). `npm run check` 83 suites / 342 tests ✓;
  web-checked 375×812. Usage at start: 5-hour 2 %, weekly 25 %. Next: the remaining #144 themes (weather & seasons,
  kitchen, playground, holidays, action words), then #145.
- Verified only in the web preview (`npx expo start --web`). No native run yet.

## Next priorities (owner, 2026-11-11)
Agreed with the owner: build #144 (more themes) → #145 (phrases) → #146 (review round) → #147 (word of the day),
then #148–#156 by score; #143 (last flat drawings) alongside. New Armenian text always goes on the proofreading list.

## Blockers (owner)
1. Xcode too old for SDK 58 native build (Swift 6 error in expo-modules-jsi) → update Xcode.
2. Codex CLI: configured models are rejected for this ChatGPT account → set a supported model in
   `~/.codex/config.toml` (AI_TASKS #11). Until then Claude subagents implement and review.
3. Store billing products; "Made for Kids"/Families settings; public privacy-policy URL; native proofreading
   (including the new Armenian lines for cards, rhyme and Find prompts, and the two #62 rhymes).
4. Commits (owner rule, 2026-11-04): each finished task is committed to `main` once `npm run check` passes, one
   clear commit per task; never failing or half-done work. After each commit, push `main` to origin (never
   force-push; if rejected: `git pull --rebase origin main`, `npm run check` again, then push). Everything up to
   3f36517 is committed and pushed. The hourly `little-roots-daily` task (17:30–01:00) follows the same rule, bans voice features
   other than Family voice, and puts images/design first.
5. #40 Proposal: release Android build without the INTERNET permission (needs a config plugin + native test).
6. #68 Decision: keep iPad rotation (recommended) or set `ios.requireFullScreen: true` (portrait-only iPad, no Split View).
7. #47 Proposal: migration treats an empty-default `.hy` record as missing so a kept old record is shown (stored-data
   contract change).
(No bundled native-speaker recordings: since 2026-11-04 each family records its own words in Family voice.)

## How a session works
Schedule: daily 17:30–01:00 Asia/Yerevan, hourly at half past until 00:30 (local scheduled task "little-roots-daily"). Read this file, `AI_TASKS.md`,
`AI_DECISIONS.md`, `AI_CHANGELOG.md`; pick the top unblocked task; plan → implement (Codex/Claude on disjoint files)
→ cross-review → `npx tsc --noEmit && npx eslint . && npx jest` → web-preview check → commit the finished task to `main` once `npm run check`
passes, then push `main` (never force-push; rejected → pull --rebase, check, push) → update these files. At 01:00 stop starting work; checkpoint.

## Resume commands
```bash
cd ~/Desktop/little-roots && source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit && npx eslint . && npx jest --watchman=false
npx expo start --web --port 8095
```
