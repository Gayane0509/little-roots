import type { LanguagePack } from './types';

const PLACEHOLDER = /\{[a-z0-9_]+\}/gi;
const placeholders = (text: string) => [...text.matchAll(PLACEHOLDER)].map((m) => m[0]).sort().join(',');

/** Structural checks every language pack must pass before it ships. Returns readable problems, empty when valid. */
export function validatePack(pack: LanguagePack, reference?: LanguagePack): string[] {
  const problems: string[] = [];
  const words = pack.themes.flatMap((theme) => theme.words);
  const ids = new Set(words.map((word) => word.id));
  if (ids.size !== words.length) problems.push('duplicate word ids');
  if (!pack.themes.some((theme) => theme.free)) problems.push('no free theme');
  for (const theme of pack.themes) {
    if (theme.words.length < 3) problems.push(`${theme.id}: fewer than 3 words`);
    for (const word of theme.words) {
      if (word.themeId !== theme.id || !word.id.startsWith(`${theme.id}.`)) problems.push(`${word.id}: wrong theme`);
      if (![word.hy, word.translit, word.en].every((text) => text.trim())) problems.push(`${word.id}: empty text`);
    }
    if (theme.song.lines.length === 0 || theme.song.lines.some((line) => !line.hy.trim() || !line.en.trim())) problems.push(`${theme.id}: empty song line`);
  }
  for (const [key, phrase] of Object.entries(pack.phrases)) {
    if (!phrase.hy.trim() || !phrase.en.trim()) problems.push(`phrase ${key}: empty`);
    if (placeholders(phrase.hy) !== placeholders(phrase.en)) problems.push(`phrase ${key}: placeholders differ`);
  }
  for (const id of Object.keys(pack.audio)) if (!ids.has(id)) problems.push(`audio ${id}: unknown word`);
  if (pack.alphabet.length === 0) problems.push('empty alphabet');
  if (reference) {
    for (const key of Object.keys(reference.phrases)) if (!(key in pack.phrases)) problems.push(`phrase ${key}: missing`);
    // Word ids key saved progress: a theme that also exists in the reference must keep all of its word ids.
    for (const theme of reference.themes) {
      const same = pack.themes.find((t) => t.id === theme.id);
      if (!same) continue;
      const kept = new Set(same.words.map((w) => w.id));
      const lost = theme.words.filter((w) => !kept.has(w.id)).map((w) => w.id);
      if (lost.length > 0) problems.push(`${theme.id}: missing word ids ${lost.join(', ')}`);
    }
  }
  return problems;
}
