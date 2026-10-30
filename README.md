# Little Roots

A kids' app (ages 3–8) for learning the family's language — starting with Eastern Armenian — in 5–10 minutes a day.

- **Daily lesson:** hello → 3 new words → find-the-picture game → short rhyme → say it aloud → reward.
- **Spaced repetition:** learned words come back after 1, 3, 7, 14 and 30 days.
- **Family voice:** parents record words in their own voice; the app plays them in lessons.
- **Parent area** behind an adult gate: weekly report, words to practise at home, recordings, privacy.
- **Private by design:** everything stays on the device — no accounts, ads, analytics or tracking.

Free: Family and Food themes. Premium: all other themes.

## Run

Requires Node 22 (`nvm use`).

```bash
npm install
npx expo start          # scan the QR code with Expo Go, or press i / a / w
```

## Check

```bash
npx tsc --noEmit && npx eslint . && npx jest
```

## Structure

| Path | What |
|---|---|
| `src/app` | Screens (Expo Router) |
| `src/features/<name>` | Feature components and logic |
| `src/lib` | Pure logic: spaced repetition, lesson builder, reports, speech |
| `src/state` | Progress and recordings, stored locally |
| `src/content` | Words, rhymes and the alphabet |
| `src/ui` | Design tokens and shared components |

Progress and roadmap: [PROGRESS.md](PROGRESS.md). Privacy: [PRIVACY.md](PRIVACY.md).

## Adding a family language

Content lives behind the `LanguagePack` interface (`src/content/packs/`). Armenian is the first pack.

1. Create `src/content/packs/<language>.ts` exporting a `LanguagePack`: themes and words (keep the word ids of themes
   that already exist, since progress is keyed by them), alphabet, every Buddy phrase with the same `{placeholders}`,
   the device speech locale, and bundled recordings.
2. Add it to `PACKS` in `src/content/packs/index.ts`. `packs.test.ts` runs `validatePack` on every shipped pack.
   Today only speech and the settings screen read `ACTIVE_PACK`; screens still import the Armenian content modules
   directly, and there is no language picker yet. Wiring screens to the active pack and per-language progress is
   the next step before a second language can ship.
3. Have a native speaker review all text before release.
