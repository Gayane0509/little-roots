import { describe, expect, test } from '@jest/globals';

import { homeGridColumns, isFullRowCard, themeCardWidth } from './themeGrid';

describe('Home theme grid (#157)', () => {
  test('two columns on phones, three from the wide breakpoint', () => {
    expect(homeGridColumns(320)).toBe(2);
    expect(homeGridColumns(599)).toBe(2);
    expect(homeGridColumns(600)).toBe(3);
  });

  test('full rows keep the usual card width', () => {
    expect(Array.from({ length: 18 }, (_, i) => themeCardWidth(i, 18, 2))).toEqual(Array(18).fill('48%'));
    expect(Array.from({ length: 18 }, (_, i) => themeCardWidth(i, 18, 3))).toEqual(Array(18).fill('31.5%'));
  });

  test('a lone last card fills its row on phones and tablets', () => {
    expect(themeCardWidth(17, 19, 2)).toBe('48%');
    expect(themeCardWidth(18, 19, 2)).toBe('100%');
    expect(themeCardWidth(17, 19, 3)).toBe('31.5%');
    expect(themeCardWidth(18, 19, 3)).toBe('100%');
    expect(isFullRowCard(18, 19, 3)).toBe(true);
    expect(isFullRowCard(17, 19, 3)).toBe(false);
  });

  test('two cards left on a tablet share the row and keep the usual gap', () => {
    const width = themeCardWidth(19, 20, 3);
    expect(themeCardWidth(18, 20, 3)).toBe(width);
    // 31.5% cards leave a 2.75% gap: two leftovers take (100 − 2.75) / 2.
    expect(width).toBe('48.6%');
    expect(isFullRowCard(19, 20, 3)).toBe(false);
  });

  test('every row adds up to no more than the column', () => {
    for (const columns of [2, 3]) {
      for (let count = 1; count <= 25; count += 1) {
        const widths = Array.from({ length: count }, (_, i) => parseFloat(themeCardWidth(i, count, columns)));
        for (let start = 0; start < count; start += columns) {
          const row = widths.slice(start, start + columns);
          expect(row.reduce((sum, w) => sum + w, 0)).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});
