import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { useReduceMotion } from './useReduceMotion';

/**
 * A drawn pointing hand that bobs over something to tap (no text, so pre-readers get it). Decorative and
 * untouchable; the caller decides when to show it. Reduced motion → a still hand.
 */
export function TapHint({ visible, size = 72 }: { visible: boolean; size?: number }) {
  const reduceMotion = useReduceMotion();
  const [lift] = useState(() => new Animated.Value(0));
  useEffect(() => {
    lift.setValue(0);
    if (!visible || reduceMotion) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(lift, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [visible, reduceMotion, lift]);
  if (!visible) return null;
  const translateY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View testID="tap-hint" pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={[styles.hand, { width: size, height: size, transform: [{ translateY }] }]}>
      <Icon name="point" size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hand: { position: 'absolute', left: '50%', marginLeft: 24, top: 100 },
});
