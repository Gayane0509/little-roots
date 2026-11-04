import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART } from '@/art/buddy';
import type { Theme } from '@/content/types';
import { themeArtWordId } from '@/content/themeArt';
import { tint } from '@/ui/contrast';
import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

interface ThemeCardProps {
  theme: Theme;
  learned: number;
  total: number;
  unlocked: boolean;
  /** Where the child continues: Buddy badge + "Next" ribbon (static, no motion). */
  isNext?: boolean;
  onOpenPress: () => void;
  onLockedPress: () => void;
}

export function ThemeCard({ theme, learned, total, unlocked, isNext = false, onOpenPress, onLockedPress }: ThemeCardProps) {
  const wide = useWindowDimensions().width >= WIDE_BREAKPOINT;
  const label = unlocked
    ? `${isNext ? 'Next up: ' : ''}${theme.titleHy}, ${theme.titleEn}, ${learned} of ${total} words learned. Open`
    : `${theme.titleHy}, ${theme.titleEn}, locked. Ask a grown-up to unlock`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={unlocked ? onOpenPress : onLockedPress}
      style={[styles.card, wide && styles.cardWide, { backgroundColor: unlocked ? theme.color : tint(theme.color, 0.55) }, !unlocked && styles.lockedCard, isNext && styles.nextCard]}
    >
      {isNext ? <View style={styles.ribbon} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><SvgXml xml={BUDDY_ART.happy} width={26} height={26} /><Text style={styles.ribbonText} maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}>Next</Text></View> : null}
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
  nextCard: { borderWidth: 3, borderColor: colors.primaryText },
  ribbon: { position: 'absolute', top: -spacing.sm, right: spacing.sm, zIndex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingLeft: spacing.xs, paddingRight: spacing.sm, paddingVertical: 2, borderRadius: radius.round, backgroundColor: colors.primaryText },
  ribbonText: { fontSize: font.small, fontWeight: '800', color: colors.surface },
  lockedCard: { borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  lock: { position: 'absolute', right: -10, bottom: -6, width: 36, height: 36, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  texts: { gap: 2, flexShrink: 1 },
  titleHy: { fontSize: font.body, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
});
