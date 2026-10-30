import { getTheme, THEMES } from '@/content/themes';
import type { Word } from '@/content/types';

export function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function gameOptions(answer: Word): Word[] {
  const selected = [answer];
  const ids = new Set([answer.id]);
  const emojis = new Set([answer.emoji]);
  const home = getTheme(answer.themeId);
  const candidates = [
    ...shuffled(home.words),
    ...shuffled(THEMES.filter((theme) => theme.id !== answer.themeId).flatMap((theme) => theme.words)),
  ];
  for (const word of candidates) {
    if (selected.length === 4) break;
    if (ids.has(word.id) || emojis.has(word.emoji)) continue;
    selected.push(word);
    ids.add(word.id);
    emojis.add(word.emoji);
  }
  return shuffled(selected);
}
