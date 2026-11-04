import { WIDE_BREAKPOINT } from '@/ui/tokens';

/** Picture size on the Games list cards: bigger on tablets so the 720 px cards don't look empty (#96). */
export function gameCardIconSize(windowWidth: number): number {
  return windowWidth >= WIDE_BREAKPOINT ? 88 : 56;
}
