import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { getWordArt } from '@/art';
import '@/art/words';

interface WordArtProps {
  wordId: string;
  /** Emoji shown when no illustration exists yet. */
  emoji: string;
  size: number;
}

/** A word's illustration, falling back to its emoji. Decorative: callers own the accessibility label. */
export const WordArt = memo(function WordArt({ wordId, emoji, size }: WordArtProps) {
  const xml = getWordArt(wordId);
  if (!xml) {
    return (
      <Text style={{ fontSize: size * 0.8, lineHeight: size }} accessible={false}>
        {emoji}
      </Text>
    );
  }
  return (
    <View style={[styles.box, { width: size, height: size }]} accessible={false} pointerEvents="none">
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
});

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
