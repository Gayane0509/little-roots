# Little Roots

A kids' app (ages 3–8) for learning the family's language — starting with Eastern Armenian — in 5–10 minutes a day.

- **Daily lesson:** hello → 3 new words with pictures → find-the-picture game → short read-along rhyme → reward.
- **Spaced repetition:** learned words come back after 1, 3, 7, 14 and 30 days.
- **Family voice:** behind the parent gate a grown-up records the words one by one; the child hears that voice on word
  cards, in lessons and in Find the picture. Recordings stay on the device. No text-to-speech, speech recognition or AI
  voices; unrecorded words stay pictures and text.
- **Parent area** behind an adult gate: weekly report, words to practise at home, family voice, children, settings, privacy.
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

End-to-end smoke flows for a device build live in `.maestro/` (`maestro test .maestro/`; see its README).

## Structure

| Path | What |
|---|---|
| `src/app` | Screens (Expo Router) |
| `src/features/<name>` | Feature components and logic |
| `src/lib` | Pure logic: spaced repetition, lesson builder, reports, sound effects |
| `src/state` | Profiles, progress (per child and language) and settings, stored locally |
| `src/content` | Words, rhymes and the alphabet; read through `src/content/packs` (`ACTIVE_PACK`) |
| `src/ui` | Design tokens and shared components |

Status: [PROJECT_STATUS.md](PROJECT_STATUS.md). Backlog: [AI_TASKS.md](AI_TASKS.md). Privacy: [PRIVACY.md](PRIVACY.md).

## Adding a family language

Content lives behind the `LanguagePack` interface (`src/content/packs/`). Armenian is the first pack.

1. Create `src/content/packs/<language>.ts` exporting a `LanguagePack`: themes and words (keep the word ids of themes
   that already exist, since progress is keyed by them), alphabet, every Buddy phrase with the same `{placeholders}`,
   and the language's name.
2. Add it to `PACKS` in `src/content/packs/index.ts`. `packs.test.ts` runs `validatePack` on every shipped pack.
   Screens, features and state read content only through `ACTIVE_PACK` (a test enforces it), and progress and traced
   letters are saved per child and per language, so switching packs never mixes progress. What's still missing is a
   parent-facing language picker that sets the active pack; it waits until a second pack has native-speaker content.
3. Have a native speaker review all text before release.
