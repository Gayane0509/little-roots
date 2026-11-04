import { describe, expect, it } from '@jest/globals';

import { selectedA11y } from './selectedA11y';

describe('selectedA11y', () => {
  it('uses aria-pressed on web, where react-native-web drops accessibilityState', () => {
    expect(selectedA11y(true, 'web')).toEqual({ 'aria-pressed': true });
    expect(selectedA11y(false, 'web')).toEqual({ 'aria-pressed': false });
  });

  it('keeps the native selected state on iOS and Android', () => {
    expect(selectedA11y(true, 'ios')).toEqual({ 'aria-selected': true });
    expect(selectedA11y(false, 'android')).toEqual({ 'aria-selected': false });
  });
});
