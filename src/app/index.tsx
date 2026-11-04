
import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK } from '@/content/packs';
import { ThemeCard } from '@/features/home/ThemeCard';
import { isThemeUnlocked, nextNewTheme, themeProgress } from '@/lib/lesson';
import { wornOutfit } from '@/lib/outfits';
import { currentStreak } from '@/lib/streak';
import { useProgress } from '@/state/progress';
import { useProfiles } from '@/state/profiles';
import { ProfileAvatar } from '@/features/profiles/ProfileAvatar';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Icon } from '@/ui/Icon';
import { freeWordsFinished } from '@/features/paywall/offer';
import { Screen } from '@/ui/Screen';
import { sceneHeight } from '@/ui/SceneBackdrop';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function Home() {
  const line = useBuddyLine();
  const { state, ready } = useProgress();
  const { active } = useProfiles();
  const { width } = useWindowDimensions();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => setNow(Date.now()), []));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') setNow(Date.now());
    });
    return () => sub.remove();
  }, []);

  if (!ready) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Loading" />
        </View>
      </Screen>
    );
  }
  if (!state.childName) return <Redirect href="/onboarding" />;

  const streak = currentStreak(state, now);
  const nextThemeId = nextNewTheme(ACTIVE_PACK.themes, state.words, state.isPremium)?.id;

  const freeDone = !state.isPremium && freeWordsFinished(state);
  return (
    <Screen scene="hills">
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: sceneHeight(width) }]}>
        <View style={styles.topRow}>
          <View style={styles.stats}>
            <View style={styles.statRow} accessible accessibilityLabel={`${streak} day streak`}>
              <Icon name="flame" size={30} />
              <Text style={styles.stat}>{streak}</Text>
            </View>
            <View style={styles.statRow} accessible accessibilityLabel={`${state.stars} stars`}>
              <Icon name="stickers" size={30} />
              <Text style={styles.stat}>{state.stars}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Parents"
            onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent' } })}
            style={styles.parents}
          >
            <Text style={styles.parentsText}>Parents</Text>
          </Pressable>
        </View>

        {active ? <Pressable accessibilityRole="button" accessibilityLabel={`Switch child, current child ${active.name}`} onPress={() => router.push('/profiles')} style={styles.profile}><View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><ProfileAvatar wordId={active.avatarWordId} size={56} /></View><Text style={styles.profileName}>{active.name} ▾</Text></Pressable> : null}
        {/* One Buddy: once the free words are finished it says so instead of the greeting (#91). */}
        <Buddy mood={freeDone ? 'cheer' : 'wave'} outfit={wornOutfit(state)} message={freeDone ? line('free_words_finished') : line('greeting', { name: state.childName })} />

        {/* The child's lesson comes before the grown-up card so it stays above the fold on short phones (#86). */}
        <BigButton label="Start today's lesson" onPress={() => router.push('/lesson')} style={styles.start} />

        {freeDone ? <BigButton label="Ask a grown-up for 80 more words" color={colors.textMuted} onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'themes' } })} /> : null}

        <View style={styles.tiles}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Letters"
            onPress={() => router.push('/letters')}
            style={[styles.tile, { backgroundColor: '#CDE7FF' }]}
          >
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name="letters" size={60} /></View>
            <Text style={styles.tileLabel}>Letters</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Stickers"
            onPress={() => router.push('/stickers')}
            style={[styles.tile, { backgroundColor: '#FFE9A8' }]}
          >
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name="stickers" size={60} /></View>
            <Text style={styles.tileLabel}>Stickers</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Games"
            onPress={() => router.push('/games')}
            style={[styles.tile, { backgroundColor: '#CAFFBF' }]}
          >
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name="games" size={60} /></View>
            <Text style={styles.tileLabel}>Games</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {ACTIVE_PACK.themes.map((theme) => {
            const { learned, total } = themeProgress(theme, state.words);
            return (
              <ThemeCard
                key={theme.id}
                theme={theme}
                learned={learned}
                total={total}
                unlocked={isThemeUnlocked(theme, state.isPremium)}
                isNext={theme.id === nextThemeId}
                onOpenPress={() => router.push({ pathname: '/theme/[id]', params: { id: theme.id } })}
                onLockedPress={() =>
                  router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'themes' } })
                }
              />
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', minHeight: TOUCH_MIN, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface },
  profileName: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { gap: spacing.lg, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, flexShrink: 1 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stat: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  parents: {
    minHeight: TOUCH_MIN,
    minWidth: TOUCH_MIN,
    paddingHorizontal: spacing.md,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentsText: { fontSize: font.small, fontWeight: '700', color: colors.textMuted },
  start: { minHeight: TOUCH_MIN + 16 },
  tiles: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  tile: {
    flex: 1,
    minHeight: TOUCH_MIN + 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
  },
  tileLabel: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
});
