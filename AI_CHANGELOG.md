# AI changelog — Little Roots

Newest first. Each entry: date · agent(s) · what changed · files · checks · commit.

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
- Not verified: anything native (Xcode blocker) — silent-switch playback, background stop, error screen on device.

## 2026-11-02 (setup, outside the work window)
- claude · Added coordination files (this file, PROJECT_STATUS.md, AI_TASKS.md, AI_DECISIONS.md) and the daily
  18:00 scheduled session. No app code changed.

## 2026-10-30 (first build sprint — details in PROGRESS.md)
- Waves 1–9 + accessibility pass; final regression in the web preview; FINAL_REPORT.md. Last commit 6b63ae5.
  Checks: tsc, ESLint, Jest 33/135, CI green.
