import { Redirect, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '@/content/themes';
import type { Word } from '@/content/types';
import { isThemeUnlocked, themeProgress } from '@/lib/lesson';
import { goBackOrHome } from '@/lib/navigation';
import { useProgress } from '@/state/progress';
import { useSpeakWord } from '@/state/recordings';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function ThemeDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, ready } = useProgress();
  const speak = useSpeakWord();
  const theme = THEMES.find((t) => t.id === id);

  if (!theme) return <Redirect href="/" />;
  if (!ready) return <Screen><Text style={styles.sub}>Loading…</Text></Screen>;
  if (!isThemeUnlocked(theme, state.isPremium)) {
    return <Redirect href={{ pathname: '/parent-gate', params: { next: '/parent/paywall' } }} />;
  }

  const { learned, total } = themeProgress(theme, state.words);

  return (
    <Screen background={theme.color}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>{theme.emoji}</Text>
          <View style={styles.headerTexts}>
            <Text style={styles.titleHy} numberOfLines={1} adjustsFontSizeToFit>
              {theme.titleHy}
            </Text>
            <Text style={styles.titleEn}>{theme.titleEn}</Text>
          </View>
          <Text style={styles.count} accessibilityLabel={`${learned} of ${total} words learned`}>
            {learned}/{total}
          </Text>
        </View>

        <View style={styles.bar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={[styles.barFill, { width: `${total === 0 ? 0 : (learned / total) * 100}%` }]} />
        </View>

        <View style={styles.grid}>
          {theme.words.map((word) =>
            state.words[word.id] ? (
              <SeenCard key={word.id} word={word} onPress={() => speak(word)} />
            ) : (
              <UnseenCard key={word.id} />
            ),
          )}
        </View>

        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

function SeenCard({ word, onPress }: { word: Word; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${word.hy}, ${word.translit}, ${word.en}`}
      accessibilityHint="Plays the word"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <WordArt wordId={word.id} emoji={word.emoji} size={84} />
      <Text style={styles.cardHy} numberOfLines={1} adjustsFontSizeToFit>
        {word.hy}
      </Text>
      <Text style={styles.cardTranslit}>{word.translit}</Text>
      <Text style={styles.cardEn}>{word.en}</Text>
    </Pressable>
  );
}

function UnseenCard() {
  return (
    <View style={[styles.card, styles.unseen]} accessibilityLabel="A new word. Learn it in a lesson!">
      <Text style={styles.cardEmoji}>❓</Text>
      <Text style={styles.unseenText}>Learn it in a lesson!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  sub: { fontSize: font.body, color: colors.text },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerEmoji: { fontSize: 56 },
  headerTexts: { flex: 1 },
  titleHy: { fontSize: font.title, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.heading, fontWeight: '800', color: colors.text, paddingRight: spacing.sm },
  bar: { height: 14, borderRadius: radius.round, backgroundColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' },
  barFill: { height: 14, borderRadius: radius.round, backgroundColor: colors.success },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  card: {
    width: '48%',
    minHeight: TOUCH_MIN * 2.5,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cardEmoji: { fontSize: 48 },
  cardHy: { fontSize: font.heading, fontWeight: '800', color: colors.text, maxWidth: '100%' },
  cardTranslit: { fontSize: font.body, color: colors.primaryDark, fontWeight: '700' },
  cardEn: { fontSize: font.small, color: colors.textMuted },
  unseen: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 2, borderColor: colors.surface, borderStyle: 'dashed' },
  unseenText: { fontSize: font.small, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
