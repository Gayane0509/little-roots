import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART } from '@/art/buddy';
import { speakArmenian, speakEnglish, stopSpeaking, useArmenianVoiceAvailable } from '@/lib/speech';
import { useSettings } from '@/state/settings';
import { colors, font, radius, spacing } from './tokens';

export const BUDDY_NAME = { hy: 'Արջուկ', translit: 'Arjuk', en: 'Little Bear' } as const;

type Mood = 'happy' | 'cheer' | 'think' | 'sleep';

interface BuddyProps {
  message?: string;
  mood?: Mood;
  size?: number;
  speak?: boolean;
}

/** The child's friend who guides every lesson. */
export function Buddy({ message, mood = 'happy', size = 72, speak = true }: BuddyProps) {
  const [bounce] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(true);
  const { buddyLanguage } = useSettings();
  const armenianVoiceAvailable = useArmenianVoiceAvailable();
  const lastSpoken = useRef<string | undefined>(undefined);

  const replay = useCallback(() => {
    if (!message) return;
    const lines = message.split('\n');
    if (buddyLanguage === 'hy' && lines.length > 1 && lines.length % 2 === 0) {
      const spokenLines = lines.filter((_, index) => index % 2 === (armenianVoiceAvailable ? 0 : 1));
      if (armenianVoiceAvailable) speakArmenian(spokenLines.join(' '));
      else speakEnglish(spokenLines.join(' '));
    } else speakEnglish(message);
  }, [message, buddyLanguage, armenianVoiceAvailable]);

  useEffect(() => {
    if (!message || !speak) { lastSpoken.current = undefined; return; }
    if (buddyLanguage === 'hy' && armenianVoiceAvailable === null) return;
    if (lastSpoken.current === message) return;
    lastSpoken.current = message;
    replay();
  }, [message, replay, speak, buddyLanguage, armenianVoiceAvailable]);

  useEffect(() => () => { if (speak) stopSpeaking(); }, [speak]);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduceMotion(value);
    }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; listener.remove(); };
  }, []);

  useEffect(() => {
    if (reduceMotion) { bounce.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: -3, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [bounce, reduceMotion]);

  return (
    <View style={styles.row}>
      <Animated.View accessible accessibilityRole="image" accessibilityLabel={BUDDY_NAME.en} style={{ width: size, height: size, transform: [{ translateY: bounce }] }}>
        <SvgXml xml={BUDDY_ART[mood]} width={size} height={size} />
      </Animated.View>
      {message ? <View style={styles.bubble}><Text style={styles.message}>{message}</Text>{speak ? <Pressable accessibilityRole="button" accessibilityLabel="Replay Buddy's message" onPress={replay} style={styles.replay}><Text style={styles.replayText}>🔊</Text></Pressable> : null}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bubble: { flexShrink: 1, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, padding: spacing.md },
  message: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  replay: { alignSelf: 'flex-end', minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  replayText: { fontSize: 26 },
});
