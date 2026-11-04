import { useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { playSfx } from '@/lib/sfx';
import { useFamilyVoice } from '@/state/familyVoice';
import { useSettings } from '@/state/settings';
import { Icon } from './Icon';
import { spacing } from './tokens';
import { useReduceMotion } from './useReduceMotion';

/**
 * Content that answers a touch with a playful wiggle and a soft tap sound (AI_DECISIONS design principles: every tap
 * gets feedback). With a `wordId` that has a family-voice recording, the tap plays the word in that voice instead of
 * the tap sound (AI_DECISIONS 2026-11-04). A button role is required for taps to register on the web.
 */
export function Wiggle({ children, label, style, wordId, onTap }: { children: ReactNode; label: string; style?: StyleProp<ViewStyle>; wordId?: string; onTap?: () => void }) {
  const reduceMotion = useReduceMotion();
  const { soundEffects } = useSettings();
  const voice = useFamilyVoice();
  const hasVoice = !!wordId && !!voice.uris[wordId];
  const [turn] = useState(() => new Animated.Value(0));
  const running = useRef(false);
  const wiggle = () => {
    onTap?.();
    if (!(hasVoice && wordId && voice.play(wordId))) playSfx('tap', soundEffects);
    if (reduceMotion || running.current) return;
    running.current = true;
    const step = (toValue: number) => Animated.timing(turn, { toValue, duration: 90, easing: Easing.inOut(Easing.quad), useNativeDriver: true });
    Animated.sequence([step(1), step(-1), step(0.6), step(-0.6), step(0)]).start(() => { running.current = false; });
  };
  const rotate = turn.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hasVoice ? 'Plays the word in the family voice' : 'Wiggles the picture'} onPress={wiggle} style={style}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        {children}
        {hasVoice && <View style={{ position: 'absolute', top: spacing.sm, right: spacing.sm }} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden><Icon name="voice" size={28} /></View>}
      </Animated.View>
    </Pressable>
  );
}
