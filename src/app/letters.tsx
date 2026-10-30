import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ALPHABET, type Letter } from '@/content/alphabet';
import { LetterDetail } from '@/features/letters/LetterDetail';
import { goBackOrHome } from '@/lib/navigation';
import { speakArmenian } from '@/lib/speech';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const TILE_COLORS = ['#FFD6A5', '#CDE7FF', '#CAFFBF', '#FFC8DD', '#FDFFB6', '#E0C3FC'];

export default function Letters() {
  const [selected, setSelected] = useState<Letter | null>(null);

  const open = (letter: Letter) => {
    setSelected(letter);
    speakArmenian(letter.lower);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔤 Letters</Text>
        <Text style={styles.sub}>Tap a letter to meet it!</Text>
        <View style={styles.grid}>
          {ALPHABET.map((letter, i) => (
            <Pressable
              key={letter.upper}
              accessibilityRole="button"
              accessibilityLabel={`Letter ${letter.name}`}
              onPress={() => open(letter)}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: TILE_COLORS[i % TILE_COLORS.length], transform: [{ scale: pressed ? 0.94 : 1 }] },
              ]}
            >
              <Text style={styles.upper}>{letter.upper}</Text>
              <Text style={styles.lower}>{letter.lower}</Text>
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
  upper: { fontSize: 34, fontWeight: '800', color: colors.text },
  lower: { fontSize: font.heading, fontWeight: '700', color: colors.textMuted },
});
