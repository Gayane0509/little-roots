import { ACTIVE_PACK, getWord } from '@/content/packs';

/** Resolve a saved emoji sticker to the first matching word in theme order. */
export function wordIdForSticker(emoji: string): string | undefined {
  return ACTIVE_PACK.themes.flatMap((theme) => theme.words).find((word) => word.emoji === emoji)?.id;
}

/** Screen-reader name of a sticker: the word it shows ("Sticker: mom"), not the emoji's system name. */
export function stickerLabel(emoji: string, wordId?: string): string {
  return `Sticker: ${(wordId && getWord(wordId)?.en) || emoji}`;
}
