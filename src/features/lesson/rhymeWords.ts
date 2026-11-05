import type { Song, Word } from '@/content/types';

/** Words shorter than this are skipped: they would match inside unrelated words. */
const MIN_LETTERS = 3;

/**
 * The theme words a rhyme line uses, in reading order, so the line can show their pictures (#112). A word matches inside
 * an inflected form (Մայրիկս → մայրիկ). Longer words win, so մորաքույր doesn't also show քույր. Only the song's own
 * `wordIds` are considered when it lists them.
 */
export function lineWordIds(lineHy: string, song: Pick<Song, 'wordIds'>, themeWords: Pick<Word, 'id' | 'hy'>[], max = 2): string[] {
  const text = lineHy.toLocaleLowerCase('hy');
  const candidates = themeWords
    .filter((word) => !song.wordIds || song.wordIds.includes(word.id))
    .filter((word) => [...word.hy].length >= MIN_LETTERS)
    .sort((a, b) => b.hy.length - a.hy.length);
  const taken: { id: string; start: number; end: number }[] = [];
  for (const word of candidates) {
    const start = text.indexOf(word.hy.toLocaleLowerCase('hy'));
    if (start < 0) continue;
    const end = start + word.hy.length;
    if (taken.some((t) => start < t.end && t.start < end)) continue;
    taken.push({ id: word.id, start, end });
  }
  return taken.sort((a, b) => a.start - b.start).slice(0, max).map((t) => t.id);
}

/** Keeps a short last word (է։, ենք։) on the line before it, instead of alone on a new line; punctuation isn't counted. */
export function keepLastWord(text: string, maxLetters = 3): string {
  const at = text.lastIndexOf(' ');
  if (at < 0 || (text.slice(at + 1).match(/\p{L}/gu) ?? []).length > maxLetters) return text;
  return `${text.slice(0, at)} ${text.slice(at + 1)}`;
}
