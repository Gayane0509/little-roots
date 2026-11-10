import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK, type Letter } from '@/content/packs';
import { canTraceLetter } from '@/lib/entitlements';
import { useProgressState } from '@/state/progress';
import { useTracedLetters } from '@/state/letters';
import { LetterDetail } from '@/features/letters/LetterDetail';
import { goBackOrHome } from '@/lib/navigation';
import { BigButton } from '@/ui/BigButton';
import { Icon } from '@/ui/Icon';
import { IconTitle } from '@/ui/IconTitle';
import { Screen } from '@/ui/Screen';
import { LETTER_FONT } from '@/ui/letterFont';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

const TILE_COLORS = ['#FFD6A5', '#CDE7FF', '#CAFFBF', '#FFC8DD', '#FDFFB6', '#E0C3FC'];

export default function Letters() {
  const { traced } = useTracedLetters();
  const { state } = useProgressState();
  const [selected, setSelected] = useState<Letter | null>(null);
  // Wide windows: 6 near-square tiles a row with bigger letters instead of 4 long flat ones.
  const wide = useWindowDimensions().width >= WIDE_BREAKPOINT;
  const open = (letter: Letter) => setSelected(letter);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <IconTitle icon="letters" text="Letters" style={styles.title} />
        <Text style={styles.sub}>Tap a letter to meet it! · {traced.size} of {ACTIVE_PACK.alphabet.length} traced</Text>
        <View style={styles.grid}>
          {ACTIVE_PACK.alphabet.map((letter, i) => (
            <Pressable
              key={letter.upper}
              accessibilityRole="button"
              accessibilityLabel={`Letter ${letter.name}${traced.has(letter.upper) ? ", traced" : ""}`}
              onPress={() => open(letter)}
              style={({ pressed }) => [
                styles.tile,
                wide && styles.tileWide,
                { backgroundColor: TILE_COLORS[i % TILE_COLORS.length], transform: [{ scale: pressed ? 0.94 : 1 }] },
              ]}
            >
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.upper, wide && styles.upperWide]}>{letter.upper}</Text>
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.lower, wide && styles.lowerWide]}>{letter.lower}</Text>
              {traced.has(letter.upper) ? <View style={styles.star}><Icon name="stickers" size={24} /></View> : !canTraceLetter(state.isPremium, i) ? <View style={styles.star}><Icon name="lock" size={22} /></View> : null}
            </Pressable>
          ))}
        </View>
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
      <LetterDetail letter={selected} onClose={() => setSelected(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '22.5%',
    minHeight: TOUCH_MIN + 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileWide: { width: '15%', minHeight: TOUCH_MIN + 44 },
  upper: { fontSize: 34, fontFamily: LETTER_FONT, color: colors.text },
  upperWide: { fontSize: 46 },
  star: { position: 'absolute', right: 4, top: 4, fontSize: 16 },
  lower: { fontSize: font.heading, fontFamily: LETTER_FONT, color: colors.textMuted },
  lowerWide: { fontSize: font.title },
});
