import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useReduceMotion } from './useReduceMotion';

const COLORS = ['#F25C54', '#FF9F43', '#FFD23F', '#4CC985', '#4DA3FF', '#9B6BFF', '#FF8FB1'];
const PIECES = 22;
export const CONFETTI_MS = 1400;

/** Same layout every time (no Math.random), so the burst looks balanced and tests stay stable. */
export function confettiPieces(count = PIECES) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const reach = 90 + ((i * 37) % 60);
    return {
      color: COLORS[i % COLORS.length],
      dx: Math.cos(angle) * reach,
      dy: Math.sin(angle) * reach * 0.6 + 140,
      spin: (i % 2 ? 1 : -1) * (180 + ((i * 53) % 180)),
      round: i % 3 === 0,
    };
  });
}

/** A one-off burst of paper confetti over a celebration. Decorative; nothing under reduced motion. The pieces unmount
 * once the burst ends, so a reward screen left open doesn't keep 22 invisible animated views. */
export function Confetti() {
  const reduceMotion = useReduceMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const [pieces] = useState(() => confettiPieces());
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: CONFETTI_MS, easing: Easing.out(Easing.quad), useNativeDriver: true });
    // A stopped animation (unmount) reports finished: false, so no state update after unmount.
    animation.start(({ finished }) => { if (finished) setDone(true); });
    return () => animation.stop();
  }, [progress, reduceMotion]);
  if (reduceMotion || done) return null;
  return (
    <View style={styles.layer} pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {pieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[styles.piece, piece.round && styles.round, {
            backgroundColor: piece.color,
            opacity: progress.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, piece.dx] }) },
              { translateY: progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, piece.dy - 160, piece.dy] }) },
              { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${piece.spin}deg`] }) },
            ],
          }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center' },
  piece: { position: 'absolute', top: 140, width: 10, height: 16, borderRadius: 3 },
  round: { width: 12, height: 12, borderRadius: 6 },
});
