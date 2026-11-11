import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { Word } from '@/content/types';
import { WordArt } from '@/ui/WordArt';
import { Wiggle } from '@/ui/Wiggle';
import { useFamilyVoice } from '@/state/familyVoice';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing } from '@/ui/tokens';
import { WORD_OF_DAY_VOICE_ICON, wordOfDayPicture, wordOfDayText } from '@/ui/wordFit';

/**
 * Home's word of the day (#147): one big picture and the word. A tap plays the family-voice recording when there is one,
 * else wiggles (`Wiggle`). Calm by design: no streak, no score, nothing to get wrong.
 */
export function WordOfTheDay({ word }: { word: Word }) {
  const { width, fontScale } = useWindowDimensions();
  const hasVoice = !!useFamilyVoice().uris[word.id];
  const picture = wordOfDayPicture(width);
  const { stacked, size: wordSize } = wordOfDayText(word.hy, width, hasVoice, fontScale);
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.label} maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}>Word of the day</Text>
      <Wiggle wordId={word.id} label={`Word of the day: ${word.hy}, ${word.en}`}>
        <View style={[styles.body, stacked && styles.stacked]}>
          <WordArt wordId={word.id} emoji={word.emoji} size={picture} />
          <View style={[styles.text, stacked ? styles.textStacked : hasVoice && { paddingRight: WORD_OF_DAY_VOICE_ICON }]}>
            <Text style={[styles.hy, { fontSize: wordSize }]} maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}>{word.hy}</Text>
            <Text style={styles.translit}>{word.translit}</Text>
            <Text style={styles.en}>{word.en}</Text>
          </View>
        </View>
      </Wiggle>
    </View>
  );
}

const styles = StyleSheet.create({
  // Padding and border mirror `wordBox.wordOfDay`; keep them in step.
  card: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  label: { fontSize: font.small, fontWeight: '800', color: colors.primaryText, textTransform: 'uppercase', letterSpacing: 1 },
  body: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stacked: { flexDirection: 'column' },
  text: { flex: 1, gap: spacing.xs },
  textStacked: { flex: 0, alignSelf: 'stretch', alignItems: 'center' },
  // fontSize comes from `wordFontSize` (long words shrink instead of breaking, #105).
  hy: { fontWeight: '800', color: colors.text },
  translit: { fontSize: font.body, color: colors.textMuted },
  en: { fontSize: font.body, fontWeight: '700', color: colors.text },
});
