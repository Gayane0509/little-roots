import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART } from '@/art/buddy';
import { colors, font, radius, spacing } from './tokens';
import { useReduceMotion } from './useReduceMotion';
import { useScreenFocused } from './useScreenFocused';

export const BUDDY_NAME = { hy: 'Արջուկ', translit: 'Arjuk', en: 'Little Bear' } as const;

type Mood = 'happy' | 'cheer' | 'think' | 'sleep';

interface BuddyProps {
  message?: string;
  mood?: Mood;
  size?: number;
}

/** The child's friend who guides every lesson. Text only: Buddy never speaks (AI_DECISIONS 2026-11-04 "Family voice" keeps a spoken Buddy banned). */
export function Buddy({ message, mood = 'happy', size = 72 }: BuddyProps) {
  const [bounce] = useState(() => new Animated.Value(0));
  const reduceMotion = useReduceMotion();
  const focused = useScreenFocused();

  useEffect(() => {
    // A covered screen (e.g. Home under a lesson) stops its loop: no per-frame work nobody sees.
    if (reduceMotion || !focused) { bounce.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: -3, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [bounce, reduceMotion, focused]);

  return (
    <View style={styles.row}>
      <Animated.View accessible accessibilityRole="image" accessibilityLabel={BUDDY_NAME.en} style={{ width: size, height: size, transform: [{ translateY: bounce }] }}>
        <SvgXml xml={BUDDY_ART[mood]} width={size} height={size} />
      </Animated.View>
      {message ? <View style={styles.bubble}><Text style={styles.message}>{message}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bubble: { flexShrink: 1, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, padding: spacing.md },
  message: { fontSize: font.body, color: colors.text, fontWeight: '600' },
});
