import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { themeArtWordId } from '@/content/themeArt';
import { ACTIVE_PACK } from '@/content/packs';
import type { Word } from '@/content/types';
import { isThemeUnlocked, themeProgress } from '@/lib/lesson';
import { goBackOrHome } from '@/lib/navigation';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { Wiggle } from '@/ui/Wiggle';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function ThemeDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, ready } = useProgress();
  const theme = ACTIVE_PACK.themes.find((t) => t.id === id);

  if (!theme) return <Redirect href="/" />;
  if (!ready) return <Screen><Text style={styles.sub}>Loading…</Text></Screen>;
  if (!isThemeUnlocked(theme, state.isPremium)) {
    return <Redirect href={{ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'themes' } }} />;
  }

  const { learned, total } = themeProgress(theme, state.words);

  return (
    <Screen background={theme.color}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={themeArtWordId(theme.id)} emoji={theme.emoji} size={64} /></View>
          <View style={styles.headerTexts}>
            <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.titleHy} accessibilityRole="header">
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

        {learned < total ? <BigButton label="▶ Start a lesson" onPress={() => router.push('/lesson')} /> : null}
        <View style={styles.grid}>
          {theme.words.map((word) =>
            state.words[word.id] ? (
              <SeenCard key={word.id} word={word} />
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

function SeenCard({ word }: { word: Word }) {
  return (
    <Wiggle wordId={word.id} label={`${word.hy}, ${word.translit}, ${word.en}`} style={styles.cell}>
      <View style={styles.card}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={word.id} emoji={word.emoji} size={84} /></View>
      <Text style={styles.cardHy}>
        {word.hy}
      </Text>
      <Text style={styles.cardTranslit}>{word.translit}</Text>
      <Text style={styles.cardEn}>{word.en}</Text>
      </View>
    </Wiggle>
  );
}

function UnseenCard() {
  return (
    <View style={[styles.card, styles.unseen, styles.cell]} accessible accessibilityLabel="A new word. Learn it in a lesson!">
      <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.mystery}>?</Text>
      <Text style={styles.unseenText}>Learn it in a lesson!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  sub: { fontSize: font.body, color: colors.text },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  headerTexts: { flexGrow: 1, flexShrink: 1, minWidth: '50%' },
  titleHy: { fontSize: font.title, fontWeight: '800', color: colors.text },
  titleEn: { fontSize: font.body, color: colors.text },
  count: { fontSize: font.heading, fontWeight: '800', color: colors.text, paddingRight: spacing.sm },
  bar: { height: 14, borderRadius: radius.round, backgroundColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' },
  barFill: { height: 14, borderRadius: radius.round, backgroundColor: colors.success },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  cell: { width: '48%' },
  card: {
    width: '100%',
    minHeight: TOUCH_MIN * 2.5,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  mystery: { fontSize: 56, fontWeight: '800', color: colors.textMuted },
  cardHy: { fontSize: font.heading, fontWeight: '800', color: colors.text, maxWidth: '100%' },
  cardTranslit: { fontSize: font.body, color: colors.primaryText, fontWeight: '700', textAlign: 'center' },
  cardEn: { fontSize: font.small, color: colors.textMuted },
  unseen: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 2, borderColor: colors.surface, borderStyle: 'dashed' },
  unseenText: { fontSize: font.small, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
