import { describe, expect, it } from '@jest/globals';

import { chunk } from './chunk';

describe('chunk', () => {
  it('makes rows of the given size, the last one shorter', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('keeps one item a row for size 1 and treats sizes below 1 as 1', () => {
    expect(chunk(['a', 'b'], 1)).toEqual([['a'], ['b']]);
    expect(chunk(['a', 'b'], 0)).toEqual([['a'], ['b']]);
  });

  it('returns no rows for no items', () => {
    expect(chunk([], 3)).toEqual([]);
  });
});
