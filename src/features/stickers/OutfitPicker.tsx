import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BUDDY_ART, BUDDY_OUTFIT_ART, BUDDY_OUTFITS, type BuddyOutfit } from '@/art/buddy';
import { OUTFIT_LABEL, stickersNeeded } from '@/lib/outfits';
import { Icon } from '@/ui/Icon';
import { selectedA11y } from '@/ui/selectedA11y';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

interface OutfitPickerProps {
  stickerCount: number;
  worn: BuddyOutfit | undefined;
  onPick(outfit: BuddyOutfit | null): void;
}

/** Below this window width four tiles would be narrower than TOUCH_MIN, so the row becomes a 2×2 grid. */
export const OUTFIT_TWO_COLUMNS_BELOW = 360;

/** Buddy portrait wearing `outfit` (or nothing), drawn without motion. */
function Portrait({ outfit }: { outfit: BuddyOutfit | null }) {
  return (
    <View style={styles.portrait} accessible={false} pointerEvents="none">
      <SvgXml xml={BUDDY_ART.happy} width="100%" height="100%" />
      {outfit ? <View style={StyleSheet.absoluteFill}><SvgXml xml={BUDDY_OUTFIT_ART[outfit].happy} width="100%" height="100%" /></View> : null}
    </View>
  );
}

/** Dress-up row (#58): stickers unlock items; a locked tile shows a lock and how many stickers are still needed. */
export function OutfitPicker({ stickerCount, worn, onPick }: OutfitPickerProps) {
  const options: (BuddyOutfit | null)[] = [null, ...BUDDY_OUTFITS];
  const twoColumns = useWindowDimensions().width < OUTFIT_TWO_COLUMNS_BELOW;
  const column = twoColumns ? styles.half : styles.quarter;
  return (
    <View style={styles.row}>
      {options.map((outfit) => {
        const needed = outfit ? stickersNeeded(outfit, stickerCount) : 0;
        const selected = (worn ?? null) === outfit;
        const name = outfit ? OUTFIT_LABEL[outfit] : 'No dress-up';
        if (needed > 0) {
          return (
            <View key={outfit} style={[styles.tile, column, styles.locked]} accessible accessibilityLabel={`${name}, locked: ${needed} more ${needed === 1 ? 'sticker' : 'stickers'}`}>
              <View style={styles.dim}><Portrait outfit={outfit} /></View>
              <View style={styles.lockBadge} accessible={false}><Icon name="lock" size={26} /></View>
              <View style={styles.need} accessible={false}>
                <Icon name="stickers" size={18} />
                <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.needText}>{needed}</Text>
              </View>
            </View>
          );
        }
        return (
          <Pressable
            key={outfit ?? 'none'}
            accessibilityRole="button"
            accessibilityLabel={name}
            {...selectedA11y(selected)}
            onPress={() => onPick(outfit)}
            style={[styles.tile, column, selected && styles.selected]}
          >
            <Portrait outfit={outfit} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm },
  tile: {
    minWidth: TOUCH_MIN, minHeight: TOUCH_MIN, aspectRatio: 1, maxWidth: 140, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primary, backgroundColor: '#FFF1E4' },
  locked: { borderStyle: 'dashed', borderColor: colors.locked, backgroundColor: colors.background },
  dim: { width: '100%', alignItems: 'center', opacity: 0.35 },
  quarter: { width: '22%' },
  half: { width: '46%' },
  portrait: { width: '82%', aspectRatio: 1 },
  lockBadge: { position: 'absolute', top: spacing.xs, right: spacing.xs },
  need: { position: 'absolute', bottom: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 2 },
  needText: { fontSize: font.small, fontWeight: '800', color: colors.text },
});
