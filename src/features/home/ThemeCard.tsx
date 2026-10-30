import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/content/types';
import { themeArtWordId } from '@/content/themeArt';
import { WordArt } from '@/ui/WordArt';
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
    ? `${theme.titleHy}, ${theme.titleEn}, ${learned} of ${total} words learned. Open`
    : `${theme.titleHy}, ${theme.titleEn}, locked. Ask a grown-up to unlock`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={unlocked ? onOpenPress : onLockedPress}
      style={[styles.card, { backgroundColor: unlocked ? theme.color : colors.locked }]}
    >
      <View style={styles.art} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={themeArtWordId(theme.id)} emoji={theme.emoji} size={56} />{!unlocked ? <Text style={styles.lock}>🔒</Text> : null}</View>
      <View style={styles.texts}>
        <Text style={styles.titleHy}>{theme.titleHy}</Text>
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
  art: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  lock: { position: 'absolute', right: -4, bottom: -4, fontSize: 24 },
  texts: { gap: 2, flexShrink: 1 },
  titleHy: { fontSize: font.body, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
});
