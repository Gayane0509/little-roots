import { Redirect, router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '@/content/themes';
import { ThemeCard } from '@/features/home/ThemeCard';
import { isThemeUnlocked, themeProgress } from '@/lib/lesson';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function Home() {
  const { state, ready } = useProgress();

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

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.stats}>
            <Text style={styles.stat} accessibilityLabel={`${state.streakDays} day streak`}>
              🔥 {state.streakDays}
            </Text>
            <Text style={styles.stat} accessibilityLabel={`${state.stars} stars`}>
              ⭐ {state.stars}
            </Text>
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

        <Buddy message={`Բարև, ${state.childName}!`} />

        <BigButton label="Start today's lesson" onPress={() => router.push('/lesson')} style={styles.start} />

        <View style={styles.grid}>
          {THEMES.map((theme) => {
            const { learned, total } = themeProgress(theme, state.words);
            return (
              <ThemeCard
                key={theme.id}
                theme={theme}
                learned={learned}
                total={total}
                unlocked={isThemeUnlocked(theme, state.isPremium)}
                onLockedPress={() =>
                  router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall' } })
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { gap: spacing.lg, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stats: { flexDirection: 'row', gap: spacing.md },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
});
