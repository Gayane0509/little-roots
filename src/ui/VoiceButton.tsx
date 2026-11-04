import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useFamilyVoice } from '@/state/familyVoice';
import { Icon } from './Icon';
import { colors, radius, TOUCH_MIN } from './tokens';

/**
 * Plays a grown-up's recording of the word (AI_DECISIONS 2026-11-04 "Family voice"). Renders nothing when the word
 * has no recording, so those words stay text and pictures only.
 */
export function VoiceButton({ wordId, label, size = TOUCH_MIN }: { wordId: string; label: string; size?: number }) {
  const voice = useFamilyVoice();
  if (!voice.uris[wordId]) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Hear ${label} in the family voice`}
      onPress={() => { voice.play(wordId); }}
      hitSlop={8}
      style={({ pressed }) => [styles.button, { width: size, height: size, transform: [{ scale: pressed ? 0.92 : 1 }] }]}
    >
      <Icon name="voice" size={Math.round(size * 0.72)} />
    </Pressable>
  );
}

/** Plays the word's family recording once when it first shows (a new game round); stops when the screen goes. */
export function useAutoPlayWord(wordId: string | undefined): void {
  const { play, stop } = useFamilyVoice();
  useEffect(() => { if (wordId) play(wordId); }, [wordId, play]);
  useEffect(() => stop, [stop]);
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
