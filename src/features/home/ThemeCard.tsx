import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART } from '@/art/buddy';
import type { Theme } from '@/content/types';
import { themeArtWordId } from '@/content/themeArt';
import { tint } from '@/ui/contrast';
import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';

import { isThemeComplete, themeCardLabel } from './themeCardLabel';
import { homeCardTitleSize } from './themeTitle';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

interface ThemeCardProps {
  theme: Theme;
  learned: number;
  total: number;
  unlocked: boolean;
  /** Where the child continues: Buddy badge + "Next" ribbon (static, no motion). */
  isNext?: boolean;
  /** Width in the Home grid; a short last row's cards stretch to fill it (#157). Defaults to the usual column width. */
  width?: `${number}%`;
  /** The card fills its row alone: picture beside the names instead of above them. */
  fullRow?: boolean;
  onOpenPress: () => void;
  onLockedPress: () => void;
}

export function ThemeCard({ theme, learned, total, unlocked, isNext = false, width, fullRow = false, onOpenPress, onLockedPress }: ThemeCardProps) {
  const window = useWindowDimensions();
  const wide = window.width >= WIDE_BREAKPOINT;
  const label = themeCardLabel(theme, learned, total, unlocked, isNext);
  const complete = isThemeComplete(learned, total, unlocked);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={unlocked ? onOpenPress : onLockedPress}
      style={[styles.card, wide && styles.cardWide, width ? { width } : null, fullRow && styles.cardFullRow, { backgroundColor: unlocked ? theme.color : tint(theme.color, 0.55) }, !unlocked && styles.lockedCard, isNext && styles.nextCard]}
    >
      {/* A finished theme gets a gold star badge (#123); it is never the "Next" theme, so the corner is free. */}
      {complete ? <View style={styles.doneBadge} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name="stickers" size={30} /></View> : null}
      {isNext ? <View style={styles.ribbon} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><SvgXml xml={BUDDY_ART.happy} width={26} height={26} /><Text style={styles.ribbonText} maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}>Next</Text></View> : null}
      <View style={styles.art} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={themeArtWordId(theme.id)} emoji={theme.emoji} size={wide ? 72 : 56} />{!unlocked ? <View style={styles.lock}><Icon name="lock" size={26} /></View> : null}</View>
      <View style={styles.texts}>
        <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.titleHy, { fontSize: homeCardTitleSize(theme.titleHy, window) }]}>{theme.titleHy}</Text>
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
  cardFullRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: spacing.lg },
  art: { minWidth: 64, minHeight: 64, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' },
  nextCard: { borderWidth: 3, borderColor: colors.primaryText },
  ribbon: { position: 'absolute', top: -spacing.sm, right: spacing.sm, zIndex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingLeft: spacing.xs, paddingRight: spacing.sm, paddingVertical: 2, borderRadius: radius.round, backgroundColor: colors.primaryText },
  ribbonText: { fontSize: font.small, fontWeight: '800', color: colors.surface },
  doneBadge: { position: 'absolute', top: -spacing.sm, right: spacing.sm, zIndex: 1, width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.star, alignItems: 'center', justifyContent: 'center' },
  lockedCard: { borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  lock: { position: 'absolute', right: -10, bottom: -6, width: 36, height: 36, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  texts: { gap: 2, flexShrink: 1 },
  // fontSize comes from `homeCardTitleSize` (long names shrink, #104).
  titleHy: { fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
});
