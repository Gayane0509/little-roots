import { Alert, Platform } from 'react-native';

/**
 * The only place that shows system dialogs. react-native-web's `Alert.alert` does nothing, so on web (the
 * preview) these fall back to the browser's `alert` / `confirm`; native keeps `Alert.alert`. `web` is a seam for
 * tests.
 */
export function notify(title: string, message?: string, web = Platform.OS === 'web'): void {
  if (web) {
    globalThis.alert?.(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

type ConfirmOptions = { title: string; message: string; confirmText: string; destructive?: boolean; onConfirm: () => void };

/** Cancel / confirm dialog; `onConfirm` runs only when the grown-up confirms. */
export function confirmAction({ title, message, confirmText, destructive = false, onConfirm }: ConfirmOptions, web = Platform.OS === 'web'): void {
  if (web) {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
