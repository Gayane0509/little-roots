import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { useReduceMotion } from './useReduceMotion';

/** Pause between neighbouring cards, so learned words hop one after another rather than all at once. */
export const BOUNCE_STAGGER_MS = 160;
/** How high a card hops, in points: a gentle hop, not a jump. */
export const BOUNCE_HEIGHT = 10;

/**
 * A single gentle hop for a word the child has just learned (#156): up, a small overshoot back, then still. Plays once
 * on mount after `delay` ms; nothing moves when the system asks for reduced motion. Native driver only.
 */
export function Bounce({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduceMotion = useReduceMotion();
  const [lift] = useState(() => new Animated.Value(0));
  useEffect(() => {
    lift.setValue(0);
    if (reduceMotion) return;
    const hop = Animated.sequence([
      Animated.delay(delay),
      Animated.timing(lift, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(lift, { toValue: -0.25, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);
    hop.start();
    return () => { hop.stop(); lift.setValue(0); };
  }, [delay, lift, reduceMotion]);
  const translateY = lift.interpolate({ inputRange: [-1, 1], outputRange: [BOUNCE_HEIGHT, -BOUNCE_HEIGHT] });
  const scale = lift.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.96, 1, 1.06] });
  return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]}>{children}</Animated.View>;
}
