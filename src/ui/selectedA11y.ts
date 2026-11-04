import { Platform, type PressableProps } from 'react-native';

/**
 * Selected state for an option button (one of several choices). Native: `aria-selected`, which React Native maps to
 * `accessibilityState.selected` (unchanged behaviour). Web: react-native-web ignores `accessibilityState`, and
 * `aria-selected` is not valid on `role=button`, so screen readers would skip it — `aria-pressed` makes it a toggle
 * button that is announced as pressed / not pressed.
 */
export function selectedA11y(selected: boolean, os: string = Platform.OS): Partial<PressableProps> {
  // `aria-pressed` is not in React Native's prop types; react-native-web forwards it to the DOM.
  return os === 'web' ? ({ 'aria-pressed': selected } as Partial<PressableProps>) : { 'aria-selected': selected };
}
