/** Splits `items` into rows of `size` (the last row may be shorter); `size` below 1 counts as 1. */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  const step = Math.max(1, Math.floor(size));
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += step) rows.push(items.slice(i, i + step));
  return rows;
}
