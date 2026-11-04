import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART, BUDDY_BLINK, type BuddyMood } from '@/art/buddy';
import { colors, font, radius, spacing } from './tokens';
import { useReduceMotion } from './useReduceMotion';
import { useScreenFocused } from './useScreenFocused';

export const BUDDY_NAME = { hy: 'Արջուկ', translit: 'Arjuk', en: 'Little Bear' } as const;

/** Idle blink: one quick blink every few seconds (never more than one per 4 s); none under reduce motion. */
export const BLINK_EVERY_MS = 4500;
export const BLINK_MS = 140;

interface BuddyProps {
  message?: string;
  mood?: BuddyMood;
  size?: number;
}

/** The child's friend who guides every lesson. Text only: Buddy never speaks (AI_DECISIONS 2026-11-04 "Family voice" keeps a spoken Buddy banned). */
export function Buddy({ message, mood = 'happy', size = 72 }: BuddyProps) {
  const [bounce] = useState(() => new Animated.Value(0));
  const [lids] = useState(() => new Animated.Value(0));
  const blinkXml = BUDDY_BLINK[mood];
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

  useEffect(() => {
    lids.setValue(0);
    if (reduceMotion || !focused || !blinkXml) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.delay(BLINK_EVERY_MS),
      Animated.timing(lids, { toValue: 1, duration: 0, useNativeDriver: true }),
      Animated.delay(BLINK_MS),
      Animated.timing(lids, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [lids, reduceMotion, focused, blinkXml]);

  return (
    <View style={styles.row}>
      <Animated.View accessible accessibilityRole="image" accessibilityLabel={BUDDY_NAME.en} style={{ width: size, height: size, transform: [{ translateY: bounce }] }}>
        <SvgXml xml={BUDDY_ART[mood]} width={size} height={size} />
        {blinkXml ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: lids }]}><SvgXml xml={blinkXml} width={size} height={size} /></Animated.View> : null}
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
