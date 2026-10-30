import { StyleSheet, Text, View } from 'react-native';

import type { Word } from '@/content/types';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing } from '@/ui/tokens';

export function PracticeRow({ word }: { word: Word }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${word.hy}, ${word.translit}, ${word.en}`}>
      <WordArt wordId={word.id} emoji={word.emoji} size={45} />
      <View style={styles.texts}>
        <Text style={styles.hy}>{word.hy}</Text>
        <Text style={styles.sub}>
          {word.translit} · {word.en}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  texts: { flexShrink: 1 },
  hy: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted },
});
