# Bundled word audio

Place native-speaker Armenian recordings here. Name each file with its word ID, for example `family.mom.m4a`. Supported extensions are `.m4a`, `.mp3`, and `.wav`. Run `node scripts/build-audio-manifest.mjs` after adding files to regenerate the static Metro asset map in `src/content/audio.generated.ts`.

Family recordings made inside the app take priority over these bundled recordings. Device speech is the fallback.
