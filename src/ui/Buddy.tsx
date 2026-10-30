import { StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, spacing } from './tokens';

export const BUDDY_NAME = { hy: 'Արջուկ', translit: 'Arjuk', en: 'Little Bear' } as const;

type Mood = 'happy' | 'cheer' | 'think';

const FACE: Record<Mood, string> = { happy: '🐻', cheer: '🥳', think: '🤔' };

interface BuddyProps {
  /** What the buddy says, shown in a speech bubble. */
  message?: string;
  mood?: Mood;
  size?: number;
}

/** The child's friend who guides every lesson. */
export function Buddy({ message, mood = 'happy', size = 72 }: BuddyProps) {
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: size }} accessibilityLabel={BUDDY_NAME.en}>
        {FACE[mood]}
      </Text>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bubble: {
    flexShrink: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
  },
  message: { fontSize: font.body, color: colors.text, fontWeight: '600' },
});
