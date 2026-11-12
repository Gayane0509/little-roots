import { WIDE_BREAKPOINT } from '@/ui/tokens';

/** Home theme cards a row: two on phones, three on wide windows (matches `ThemeCard` widths). */
export const homeGridColumns = (width: number) => (width >= WIDE_BREAKPOINT ? 3 : 2);

/** Card width as a share of the row, per column count; the rest is the gap `space-between` leaves. */
const CARD_SHARE: Record<number, number> = { 2: 48, 3: 31.5 };

/**
 * Width of the card at `index` among `count` cards in `columns` columns (#157). Full rows keep the usual width; cards
 * left over in a short last row share that whole row, so no card sits alone beside an empty gap.
 */
export function themeCardWidth(index: number, count: number, columns: number): `${number}%` {
  const share = CARD_SHARE[columns] ?? 100 / columns;
  const leftover = count % columns;
  if (leftover === 0 || index < count - leftover) return `${share}%`;
  const gap = (100 - share * columns) / (columns - 1);
  return `${Math.round(((100 - gap * (leftover - 1)) / leftover) * 10) / 10}%`;
}

/** True when the card fills its row alone, so it can lay its picture beside the names. */
export const isFullRowCard = (index: number, count: number, columns: number) => themeCardWidth(index, count, columns) === '100%';
