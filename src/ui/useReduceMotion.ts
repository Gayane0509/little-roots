import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** True while the system asks for reduced motion. Starts true so nothing animates before the setting is known. */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduceMotion(value);
    }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; listener.remove(); };
  }, []);
  return reduceMotion;
}
