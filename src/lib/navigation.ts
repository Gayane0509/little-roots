import { router } from 'expo-router';

/** Goes back, or home when the screen was opened directly (deep link / cold start). */
export function goBackOrHome(): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
