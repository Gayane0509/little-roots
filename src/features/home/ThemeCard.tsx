import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { Theme } from '@/content/types';
import { themeArtWordId } from '@/content/themeArt';
import { tint } from '@/ui/contrast';
import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

interface ThemeCardProps {
  theme: Theme;
  learned: number;
  total: number;
  unlocked: boolean;
  onOpenPress: () => void;
  onLockedPress: () => void;
}

export function ThemeCard({ theme, learned, total, unlocked, onOpenPress, onLockedPress }: ThemeCardProps) {
  const wide = useWindowDimensions().width >= WIDE_BREAKPOINT;
  const label = unlocked
    ? `${theme.titleHy}, ${theme.titleEn}, ${learned} of ${total} words learned. Open`
    : `${theme.titleHy}, ${theme.titleEn}, locked. Ask a grown-up to unlock`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={unlocked ? onOpenPress : onLockedPress}
      style={[styles.card, wide && styles.cardWide, { backgroundColor: unlocked ? theme.color : tint(theme.color, 0.55) }, !unlocked && styles.lockedCard]}
    >
      <View style={styles.art} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={themeArtWordId(theme.id)} emoji={theme.emoji} size={wide ? 72 : 56} />{!unlocked ? <View style={styles.lock}><Icon name="lock" size={26} /></View> : null}</View>
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
  cardWide: { width: '31.5%' },
  art: { minWidth: 64, minHeight: 64, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' },
  lockedCard: { borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  lock: { position: 'absolute', right: -10, bottom: -6, width: 36, height: 36, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  texts: { gap: 2, flexShrink: 1 },
  titleHy: { fontSize: font.body, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
});
