import { describe, expect, it } from '@jest/globals';

import { sceneHeight } from './SceneBackdrop';

describe('sceneHeight', () => {
  it('is about a third of the width on phones and capped on tablets', () => {
    expect(sceneHeight(375)).toBe(113);
    expect(sceneHeight(1024)).toBe(240);
  });
});
