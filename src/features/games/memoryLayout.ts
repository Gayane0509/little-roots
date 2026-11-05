import { CONTENT_MAX_WIDTH, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

export type MemoryLayout = { columns: number; cardWidth: number; cardHeight: number; artSize: number; gap: number; prompt: boolean };

/**
 * Windows at least this tall show Buddy's "find the pairs" line above the board (#122): at 375×812 about 130 px sat free
 * under Back, and a one-line prompt needs ~70. Shorter windows keep the whole height for the cards.
 */
export const MEMORY_PROMPT_FROM = 800;

/** Height that the title, moves line, back button and padding take around the board. */
const CHROME_HEIGHT = 300;

/**
 * Card sizes for the memory board. Widths come from the content column (capped at CONTENT_MAX_WIDTH by `Screen`),
 * not the window, so three cards always fit a row; wide windows get four columns and bigger pictures.
 */
export function memoryLayout(window: { width: number; height: number; fontScale: number }, cardCount: number): MemoryLayout {
  const gap = spacing.sm;
  const wide = window.width >= WIDE_BREAKPOINT;
  const columns = wide ? 4 : 3;
  const contentWidth = Math.min(window.width - spacing.md * 2, CONTENT_MAX_WIDTH);
  const cardWidth = Math.max(TOUCH_MIN, Math.floor((contentWidth - gap * (columns - 1)) / columns) - 1);
  const rows = Math.ceil(cardCount / columns) || 1;
  const fitHeight = Math.floor((window.height - CHROME_HEIGHT) / rows) - gap;
  const cardHeight = Math.ceil(Math.max(TOUCH_MIN + 16, Math.min(Math.round(cardWidth * 1.1), fitHeight)) * Math.max(1, window.fontScale));
  const artSize = Math.min(wide ? 120 : 72, cardWidth - spacing.sm * 2 - 6, cardHeight - spacing.sm * 2 - 6);
  return { columns, cardWidth, cardHeight, artSize, gap, prompt: window.height >= MEMORY_PROMPT_FROM };
}
