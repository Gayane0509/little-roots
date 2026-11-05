import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, radius, TOUCH_MIN } from '@/ui/tokens';

import { stickerLabel } from './stickerArt';

interface StickerTileProps {
  emoji: string | null;
  index: number;
  wordId?: string;
  /** Share of the row this tile takes (see `stickerGrid`). */
  width: `${number}%`;
  artSize: number;
}

/** One slot of the sticker book: a bouncy sticker, or an empty dotted slot. */
export function StickerTile({ emoji, index, wordId, width, artSize }: StickerTileProps) {
  const [scale] = useState(() => new Animated.Value(emoji ? 0.4 : 1));

  useEffect(() => {
    if (!emoji) return;
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, delay: Math.min(index, 12) * 40, useNativeDriver: true }).start();
  }, [emoji, index, scale]);

  const bounce = () => {
    scale.setValue(0.7);
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start();
  };

  if (!emoji) {
    // A faint star says "a sticker goes here" without showing which one comes next (#107).
    return (
      <View style={[styles.tile, { width }, styles.empty]} accessibilityLabel="Empty sticker slot">
        <View style={styles.emptyHint} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name="starSlot" size={Math.round(artSize * 0.6)} /></View>
      </View>
    );
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={stickerLabel(emoji, wordId)} onPress={bounce} style={{ width }}>
      <Animated.View style={[styles.tile, styles.filled, { transform: [{ scale }] }]}>
        {wordId ? <WordArt wordId={wordId} emoji={emoji} size={artSize} /> : <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={{ fontSize: Math.round(artSize * 0.68) }}>{emoji}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 1,
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { width: '100%', backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.star },
  empty: { borderWidth: 3, borderStyle: 'dashed', borderColor: colors.locked },
  emptyHint: { opacity: 0.7 },
});
