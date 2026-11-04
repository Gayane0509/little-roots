import { expect, test } from '@jest/globals';

import { contrastRatio, labelColorOn, tint } from './contrast';
import { colors } from './tokens';

test('button labels reach large-text contrast on every fill', () => {
  for (const fill of [colors.primary, colors.success, colors.danger, colors.textMuted, colors.locked]) {
    expect(contrastRatio(labelColorOn(fill), fill)).toBeGreaterThanOrEqual(3);
  }
});

test('text-only colors reach body-text contrast on both backgrounds', () => {
  for (const text of [colors.text, colors.textMuted, colors.primaryText, colors.successText, colors.dangerText]) {
    expect(contrastRatio(text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(text, colors.surface)).toBeGreaterThanOrEqual(4.5);
  }
});

test('tint mixes toward white and keeps the endpoints', () => {
  expect(tint('#FF0000', 0)).toBe('#FF0000');
  expect(tint('#FF0000', 1)).toBe('#FFFFFF');
  expect(tint('#000000', 0.5)).toBe('#808080');
});
