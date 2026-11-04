# Maestro smoke flows

End-to-end smoke checks for a device or simulator build (`com.littleroots.kids`). They need no test IDs or app
changes: they find elements by visible text and accessibility labels. `src/lib/maestroFlows.test.ts` checks in Jest
that every literal label the flows use still exists in the app source.

| Flow | Covers |
|------|--------|
| `onboarding_lesson_reward.yaml` | fresh install → name a child → first lesson (cards, picture game, rhyme) → reward → Home |
| `parent_gate.yaml` | wrong answer is refused, Cancel returns Home, correct answer opens the parent area |

Run (after a development build is installed on a booted simulator/emulator):

```bash
maestro test .maestro/
```

Both flows start with `clearState`, so they wipe the app's data on that device. Not run yet: the native build is
blocked (Xcode too old for SDK 58, AI_TASKS #10).
