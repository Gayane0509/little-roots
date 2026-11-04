import { CONTENT_MAX_WIDTH, spacing, WIDE_BREAKPOINT } from '@/ui/tokens';

export interface StickerGrid {
  columns: 3 | 4;
  /** Tile width as a share of the row; the rest is the gap between tiles. */
  tileWidth: '30%' | '23%';
  /** Sticker drawing size, so the art fills its tile on phones and tablets alike. */
  artSize: number;
}

const ART_SHARE = 0.78;
const ART_MIN = 60;
const ART_MAX = 140;

/** Sticker book layout for a window width (#66): three big tiles on phones, four on wide windows. */
export function stickerGrid(windowWidth: number): StickerGrid {
  const wide = windowWidth >= WIDE_BREAKPOINT;
  const content = Math.min(windowWidth - spacing.md * 2, CONTENT_MAX_WIDTH);
  const tile = content * (wide ? 0.23 : 0.3);
  const artSize = Math.round(Math.min(ART_MAX, Math.max(ART_MIN, tile * ART_SHARE)));
  return wide ? { columns: 4, tileWidth: '23%', artSize } : { columns: 3, tileWidth: '30%', artSize };
}

/** Slots in the book: at least `min`, always whole rows. */
export function stickerSlots(count: number, columns: number, min = 24): number {
  return Math.max(min, Math.ceil(count / columns) * columns);
}
