import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { goBackOrHome } from '@/lib/navigation';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { canPlayGame } from '@/lib/entitlements';
import { gamesPlayedToday, useProgressActions, useProgressState } from '@/state/progress';
import type { Word } from '@/content/types';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, spacing } from '@/ui/tokens';

import { MIN_SEEN_WORDS, pickSeenWords } from './logic';

interface GameShellProps {
  title: string;
  /** Rendered once progress is loaded and enough words are seen. */
  children: (seenWords: Word[]) => ReactNode;
}

/** Loading + "finish a lesson first" gate shared by every game screen. */
export function GameShell({ title, children }: GameShellProps) {
  const line = useBuddyLine();
  const { state, ready } = useProgressState();
  const seen = useMemo(() => pickSeenWords(state.words, Math.random, Infinity, undefined, state.isPremium), [state.words, state.isPremium]);

  if (!ready) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Loading" />
        </View>
      </Screen>
    );
  }

  if (state.lessons.length === 0 || seen.length < MIN_SEEN_WORDS) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.locked}>
          <Buddy mood="think" message={line('games_locked')} />
          <BigButton label="Go to lesson" onPress={() => router.replace('/lesson')} />
          <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
        </ScrollView>
      </Screen>
    );
  }

  return <AdmittedGame title={title} seen={seen} isPremium={state.isPremium} played={gamesPlayedToday(state)}>{children}</AdmittedGame>;
}

function AdmittedGame({ title, seen, isPremium, played, children }: { title: string; seen: Word[]; isPremium: boolean; played: number; children: (words: Word[]) => ReactNode }) {
  const line = useBuddyLine();
  const [admitted] = useState(() => canPlayGame(isPremium, played));
  const { recordGamePlayed } = useProgressActions();
  const counted = useRef(false);
  useEffect(() => {
    if (admitted && !counted.current) { counted.current = true; recordGamePlayed(); }
  }, [admitted, recordGamePlayed]);
  if (!admitted) {
    return <Screen><ScrollView contentContainerStyle={styles.locked}>
      <Buddy mood="happy" message={line('games_done_today')} />
      <BigButton label="Grown-ups: unlimited games" onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'games' } })} />
      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
    </ScrollView></Screen>;
  }
  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {children(seen)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locked: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
});
