import { describe, expect, it } from '@jest/globals';

import { CONTENT_MAX_WIDTH, spacing, TOUCH_MIN } from '@/ui/tokens';

import { memoryLayout } from './memoryLayout';

const rowWidth = (l: ReturnType<typeof memoryLayout>) => l.columns * l.cardWidth + (l.columns - 1) * l.gap;

describe('memoryLayout', () => {
  it('keeps the phone board at 3 columns sized to the window', () => {
    const l = memoryLayout({ width: 375, height: 812, fontScale: 1 }, 12);
    expect(l.columns).toBe(3);
    expect(l.cardWidth).toBe(Math.floor((375 - spacing.md * 2 - spacing.sm * 2) / 3) - 1);
    expect(l.artSize).toBe(72);
  });

  it('fits every row inside the content column on wide windows (was 2 columns at 1024 px)', () => {
    for (const width of [600, 768, 1024, 1366]) {
      const l = memoryLayout({ width, height: 768, fontScale: 1 }, 12);
      expect(l.columns).toBe(4);
      expect(rowWidth(l)).toBeLessThanOrEqual(Math.min(width - spacing.md * 2, CONTENT_MAX_WIDTH));
    }
  });

  it('fits 12 cards on a landscape tablet without scrolling and grows the pictures', () => {
    const l = memoryLayout({ width: 1024, height: 768, fontScale: 1 }, 12);
    expect(3 * (l.cardHeight + l.gap)).toBeLessThanOrEqual(768 - 300);
    expect(l.artSize).toBeGreaterThan(72);
    expect(l.artSize).toBeLessThanOrEqual(l.cardHeight - spacing.sm * 2 - 6);
  });

  it('never drops below the touch minimum on tiny windows', () => {
    const l = memoryLayout({ width: 240, height: 400, fontScale: 1 }, 12);
    expect(l.cardWidth).toBeGreaterThanOrEqual(TOUCH_MIN);
    expect(l.cardHeight).toBeGreaterThanOrEqual(TOUCH_MIN);
  });
});
