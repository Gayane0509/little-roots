import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { WordArt } from '@/ui/WordArt';
import { colors, radius, TOUCH_MIN } from '@/ui/tokens';

interface StickerTileProps {
  emoji: string | null;
  index: number;
  wordId?: string;
}

/** One slot of the sticker book: a bouncy sticker, or an empty dotted slot. */
export function StickerTile({ emoji, index, wordId }: StickerTileProps) {
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
    return <View style={[styles.tile, styles.empty]} accessibilityLabel="Empty sticker slot" />;
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Sticker ${emoji}`} onPress={bounce} style={styles.slot}>
      <Animated.View style={[styles.tile, styles.filled, { transform: [{ scale }] }]}>
        {wordId ? <WordArt wordId={wordId} emoji={emoji} size={76} /> : <Text style={styles.emoji}>{emoji}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { width: '30%' },
  tile: {
    width: '30%',
    aspectRatio: 1,
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { width: '100%', backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.star },
  empty: { borderWidth: 3, borderStyle: 'dashed', borderColor: colors.locked },
  emoji: { fontSize: 52 },
});
