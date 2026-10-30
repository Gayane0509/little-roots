import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/content/types';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

interface ThemeCardProps {
  theme: Theme;
  learned: number;
  total: number;
  unlocked: boolean;
  onOpenPress: () => void;
  onLockedPress: () => void;
}

export function ThemeCard({ theme, learned, total, unlocked, onOpenPress, onLockedPress }: ThemeCardProps) {
  const label = unlocked
    ? `${theme.titleEn}, ${learned} of ${total} words learned. Open`
    : `${theme.titleEn}, locked. Ask a grown-up to unlock`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={unlocked ? onOpenPress : onLockedPress}
      style={[styles.card, { backgroundColor: unlocked ? theme.color : colors.locked }]}
    >
      <Text style={styles.emoji}>{unlocked ? theme.emoji : '🔒'}</Text>
      <View style={styles.texts}>
        <Text style={styles.titleHy} numberOfLines={1} adjustsFontSizeToFit>{theme.titleHy}</Text>
        <Text style={styles.titleEn}>{theme.titleEn}</Text>
        <Text style={styles.count}>
          {learned}/{total}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: TOUCH_MIN * 2,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  emoji: { fontSize: 40 },
  texts: { gap: 2 },
  titleHy: { fontSize: font.body, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
});
