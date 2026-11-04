# Project status — Little Roots

_Updated: 2026-11-04 (+04). Updated at the end of every session._

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
- Checks (2026-11-04, after #56): `npm run check` — tsc, ESLint, Jest 53 suites / 219 tests.
- Checks (working tree, 2026-11-04 00:05): tsc, ESLint, Jest 46 suites / 189 tests; expo-doctor 20/20 (last run 2026-11-03).
- 2026-11-04: #52 picture pass (4 redraws, bike fix), #53 Family + Food grow to 12 words with new drawings (104 words), #54 clearer parent weekly report, #59 first-lesson tap hint.
- 2026-11-04 17:30 run: #57 Home "Next up" marker (Buddy badge + "Next" ribbon on the theme new words come from;
  web-checked 375 + 800 px); #55 soft hills scene behind Home and the lesson reward (web-checked 375 + 1024 px); #56 Buddy wave/point/proud
  poses + idle blink (web-checked).
- Next unblocked: #62 rhymes (4.5, Armenian needs proofreading), #58 dress-up (4), #63 more scenes (3). Native:
  #10/#14/#16/#39/#50/#61 check.
- Verified only in the web preview (`npx expo start --web`). No native run yet.

## Blockers (owner)
1. Xcode too old for SDK 58 native build (Swift 6 error in expo-modules-jsi) → update Xcode.
2. Codex CLI: configured models are rejected for this ChatGPT account → set a supported model in
   `~/.codex/config.toml` (AI_TASKS #11). Until then Claude subagents implement and review.
3. Store billing products; "Made for Kids"/Families settings; public privacy-policy URL; native proofreading
   (including the new Armenian lines for cards, rhyme and Find prompts).
4. Commits (owner rule, 2026-11-04): each finished task is committed to `main` once `npm run check` passes, one
   clear commit per task; never failing or half-done work. After each commit, push `main` to origin (never
   force-push; if rejected: `git pull --rebase origin main`, `npm run check` again, then push). Everything up to
   9631980 is committed. The hourly `little-roots-daily` task (17:30–01:00) follows the same rule, bans voice features
   other than Family voice, and puts images/design first.
5. #40 Proposal: release Android build without the INTERNET permission (needs a config plugin + native test).
6. #47 Proposal: migration treats an empty-default `.hy` record as missing so a kept old record is shown (stored-data
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
