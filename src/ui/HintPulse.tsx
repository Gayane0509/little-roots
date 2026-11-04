import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from './tokens';
import { useReduceMotion } from './useReduceMotion';

/** Wrong taps before the right answer is hinted. Visual only: pre-readers can't read a text hint. */
export const HINT_AFTER_MISSES = 2;

/**
 * Shows the child where to tap after repeated misses: a warm outline that gently pulses (a static outline when the
 * system asks for reduced motion).
 */
export function HintPulse({ active, children, style }: { active: boolean; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduceMotion = useReduceMotion();
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    scale.setValue(1);
    if (!active || reduceMotion) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 450, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 450, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [active, reduceMotion, scale]);
  return (
    <Animated.View style={[style, active && styles.hint, { transform: [{ scale }] }]} testID={active ? 'hint' : undefined}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hint: { borderRadius: radius.md + 4, borderWidth: 4, borderColor: colors.primary, padding: 2 },
});
