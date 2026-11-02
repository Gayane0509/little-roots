# Project status — Little Roots

_Updated: 2026-11-02 evening (+04). Updated at the end of every session._

## Where things stand
- Expo SDK 58 / RN 0.88 / React 19 / strict TS kids app teaching the family language (Armenian first). Offline, no
  ads, no tracking, parent gate. Shipped waves 1–9 + accessibility pass; see `FINAL_REPORT.md` and the history in
  `PROGRESS.md` (frozen log of the first build sprint, 2026-10-30).
- 2026-11-02 evening: kid-safe error screen, app-wide audio session (+ iOS silent-switch fix after recording),
  gentler/throttled sound effects, store config (privacy manifest, no background audio, trimmed Android permissions,
  `expo-asset`), store privacy answers drafted (`STORE_PRIVACY_ANSWERS.md`).
- Checks on `main`: tsc clean, ESLint clean, Jest 36 suites / 150 tests; expo-doctor 19/20 (patch updates, task #12).
- Verified only in the web preview (`npx expo start --web`). No native run yet.

## Blockers (owner)
1. Xcode too old for SDK 58 native build (Swift 6 error in expo-modules-jsi) → update Xcode.
2. Native-speaker recordings of 96 words → `assets/audio/<wordId>.m4a` + `node scripts/build-audio-manifest.mjs`.
3. Codex CLI: configured models are rejected for this ChatGPT account → set a supported model in
   `~/.codex/config.toml` (AI_TASKS #11). Until then Claude subagents implement and review.
4. Store billing products; "Made for Kids"/Families settings; public privacy-policy URL; native proofreading.

## How a session works
Schedule: daily 18:00–01:00 Asia/Yerevan (local scheduled task "little-roots-daily"). Read this file, `AI_TASKS.md`,
`AI_DECISIONS.md`, `AI_CHANGELOG.md`; pick the top unblocked task; plan → implement (Codex/Claude on disjoint files)
→ cross-review → `npx tsc --noEmit && npx eslint . && npx jest` → web-preview check → commit + push each verified
milestone → update these files. At 01:00 stop starting work; checkpoint.

## Resume commands
```bash
cd ~/Desktop/little-roots && source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit && npx eslint . && npx jest --watchman=false
npx expo start --web --port 8095
```
