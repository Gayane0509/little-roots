import { THEMES } from '@/content/themes';

/** Resolve a saved emoji sticker to the first matching word in theme order. */
export function wordIdForSticker(emoji: string): string | undefined {
  return THEMES.flatMap((theme) => theme.words).find((word) => word.emoji === emoji)?.id;
}
