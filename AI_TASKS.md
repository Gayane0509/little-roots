# AI task backlog — Little Roots

Score = impact (1–5) × confidence (1–5) ÷ effort (1–5); risk L/M/H. Owner: codex | claude | owner.
Status: todo · doing · waiting-capacity · blocked · done. One owner per task; disjoint files when parallel.

| # | Task | Score | Risk | Owner | Status | Acceptance |
|---|------|-------|------|-------|--------|------------|
| 1 | Kid-safe error boundary (expo-router `ErrorBoundary` in root layout): friendly screen + "Try again", no stack trace to children | 5×5÷1=25 | L | codex | todo | thrown render error shows the screen; retry recovers; test |
| 2 | App-wide audio session: `setAudioModeAsync` once at start (plays in silent mode? decide; duck other audio; interruption handling), stop speech/sfx when app backgrounds | 4×4÷2=8 | M | claude research → codex | todo | decision in AI_DECISIONS; sounds stop on background (web check + code review); tests for sfx gating |
| 3 | Sound polish: throttle repeated sfx (no spam on rapid taps), per-sound volume balance, settings copy | 3×4÷1=12 | L | codex | todo | rapid taps play ≤1 sfx per 120 ms; test |
| 4 | Store readiness config: iOS privacy manifest (`ios.privacyManifests` for AsyncStorage/UserDefaults reasons), Android permissions audit (only RECORD_AUDIO, POST_NOTIFICATIONS), Play data-safety + App Privacy answers drafted in PRIVACY.md | 4×4÷2=8 | L | claude | todo | `npx expo config --type introspect` shows manifest; no extra permissions |
| 5 | Startup: keep splash until providers have loaded (no flash of defaults), measure with web perf marks | 3×4÷2=6 | M | codex | todo | no default-state flash on reload; tests unchanged |
| 6 | Screens/state read `ACTIVE_PACK` instead of Armenian modules (no visible change) | 3×4÷3=4 | M | codex | todo | rg shows no direct content imports outside packs; all tests green |
| 7 | Per-language progress keys + migration (after #6) | 3×3÷3=3 | H | codex | todo | migration test from current keys |
| 8 | E2E smoke flows (Maestro YAML, no app dependency) for onboarding → lesson → reward, gate | 3×3÷2=4.5 | L | claude | todo | flows documented; run once device build works |
| 9 | Share card as image (evaluate react-native-view-shot: size, maintenance, license) | 2×3÷3=2 | M | claude research | todo | decision recorded |
| 10 | Native test pass incl. VoiceOver/TalkBack | 5×5÷2 | — | owner → claude | blocked (Xcode) | — |
