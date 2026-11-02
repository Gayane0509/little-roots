# AI decisions — Little Roots

Durable decisions with reasons. Newest first. Earlier ones are summarized from `PROGRESS.md`.

- 2026-11-02 · Store config: iOS privacy manifest in `app.json` declares no tracking/collection and the union of the
  required-reason APIs our SDKs declare (Apple doesn't reliably read static-pod manifests). expo-audio
  `enableBackgroundPlayback: false` (no `UIBackgroundModes: audio`, no Android media foreground service); Android blocks
  READ/WRITE_EXTERNAL_STORAGE and SYSTEM_ALERT_WINDOW. Added `expo-asset` (required expo-audio peer; first-party, MIT).
  Guarded by `src/lib/storeConfig.test.ts`.
- 2026-11-02 · Audio session (`src/lib/audioSession.ts`): set once at startup — `playsInSilentMode: true` (word audio
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
- 2026-10-30 · Audio priority: family recording → bundled native audio → device TTS.
- 2026-10-30 · Expo Router + React context, no state library; RN Animated; static typed content with tests.
- 2026-10-30 · Privacy: offline, no accounts/analytics/ads; recordings and progress stay on device; mic only in the
  parent area.
