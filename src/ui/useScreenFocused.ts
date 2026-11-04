import { useIsFocused } from 'expo-router';

/** Calls the focus hook; outside a navigator (it throws there) a component counts as focused. */
export function readScreenFocused(read: () => boolean): boolean {
  try {
    return read();
  } catch {
    return true;
  }
}

/**
 * False while another stack screen covers this one, so endless animations can pause (AI_TASKS #44).
 * `useIsFocused` reads its context before it throws, so the hook order stays the same either way.
 */
export function useScreenFocused(): boolean {
  return readScreenFocused(useIsFocused);
}
