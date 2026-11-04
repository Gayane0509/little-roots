import * as Haptics from 'expo-haptics';

type HapticName = 'tap' | 'success' | 'warning';

/**
 * The only place that calls expo-haptics. Fire and forget: a device without a vibrator, a browser that blocks
 * `navigator.vibrate`, or a native error never becomes an unhandled rejection. `enabled` is the parent's
 * Vibration setting.
 */
export function haptic(name: HapticName, enabled = true): void {
  if (!enabled) return;
  try {
    const result = name === 'tap'
      ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      : Haptics.notificationAsync(name === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    void Promise.resolve(result).catch(() => {});
  } catch {
    // Feedback is optional; never break a tap over it.
  }
}
