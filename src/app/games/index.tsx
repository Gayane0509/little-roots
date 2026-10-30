
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { gamesLeftToday } from '@/lib/entitlements';
import { gamesPlayedToday, useProgressState } from '@/state/progress';
import { Buddy } from '@/ui/Buddy';
import { AppState, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const GAMES: { href: Href; emoji: string; title: string; sub: string; color: string }[] = [
  { href: '/games/memory', emoji: '🧠', title: 'Memory match', sub: 'Find the pairs', color: '#FFD6A5' },
  { href: '/games/listen', emoji: '👂', title: 'Listen & find', sub: 'Hear it, tap the picture', color: '#CDE7FF' },
  { href: '/games/read', emoji: '📖', title: 'Read it', sub: 'For readers: pick the word', color: '#CAFFBF' },
];

export default function Games() {
  const line = useBuddyLine();
  const { state } = useProgressState();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => { setNow(Date.now()); const sub = AppState.addEventListener('change', (status) => { if (status === 'active') setNow(Date.now()); }); return () => sub.remove(); }, []));
  const left = gamesLeftToday(state.isPremium, gamesPlayedToday(state, now));
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">🎮 Games</Text>
        {left !== null ? <Text style={styles.count}>3 games a day · {left} left today</Text> : <Text style={styles.count}>Unlimited games</Text>}
        {left === 0 ? <><Buddy message={line('games_done_today')} /><BigButton label="Grown-ups: unlimited games" onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'games' } })} /></> : null}
        {GAMES.map((game) => (
          <Pressable
            key={game.title}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            accessibilityHint={game.sub}
            onPress={() => { if (left !== 0) router.push(game.href); }}
            accessibilityState={{ disabled: left === 0 }}
            disabled={left === 0}
            style={({ pressed }) => [styles.card, { backgroundColor: game.color, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <Text style={styles.emoji}>{game.emoji}</Text>
            <Text style={styles.cardTitle}>{game.title}</Text>
            <Text style={styles.cardSub}>{game.sub}</Text>
          </Pressable>
        ))}
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  count: { fontSize: font.body, color: colors.textMuted, textAlign: 'center', fontWeight: '700' },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  card: {
    minHeight: TOUCH_MIN + 70,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  emoji: { fontSize: 48 },
  cardTitle: { fontSize: font.title, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: font.body, fontWeight: '600', color: colors.textMuted },
});
