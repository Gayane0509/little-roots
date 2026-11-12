import { WIDE_BREAKPOINT } from '@/ui/tokens';

/** Picture size on the Games list cards: bigger on tablets so the 720 px cards don't look empty (#96). */
export function gameCardIconSize(windowWidth: number): number {
  return windowWidth >= WIDE_BREAKPOINT ? 88 : 56;
}

/** Games list columns: two on tablets so every game shows without two screens of scrolling (#170); one on phones. */
export function gameCardColumns(windowWidth: number): 1 | 2 {
  return windowWidth >= WIDE_BREAKPOINT ? 2 : 1;
}
