
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { gamesLeftToday } from '@/lib/entitlements';
import { gamesPlayedToday, useProgressState } from '@/state/progress';
import type { IconName } from '@/art/icons';
import { Buddy } from '@/ui/Buddy';
import { Icon } from '@/ui/Icon';
import { IconTitle } from '@/ui/IconTitle';
import { AppState, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';

import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { gameCardIconSize } from '@/features/games/gameListLayout';
import { goBackOrHome } from '@/lib/navigation';
import { FreeActivities } from '@/features/games/FreeActivities';
import { canPlayCounting } from '@/features/games/counting';
import { canPlaySounds } from '@/features/games/letterSounds';
import { ACTIVE_PACK } from '@/content/packs';
import { useTracedLetters } from '@/state/letters';
import { pickSeenWords } from '@/features/games/logic';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const GAMES: { href: Href; icon: IconName; title: string; sub: string; color: string }[] = [
  { href: '/games/memory', icon: 'memory', title: 'Memory match', sub: 'Find the pairs', color: '#FFD6A5' },
  { href: '/games/find', icon: 'find', title: 'Find the picture', sub: 'Read the word, tap its picture', color: '#CDE7FF' },
  { href: '/games/read', icon: 'read', title: 'Read it', sub: 'For readers: pick the word', color: '#CAFFBF' },
];
// Shown once the child has met three Numbers words (#151), so free children never meet a locked game.
const COUNT_GAME = { href: '/games/count', icon: 'count', title: 'Count with me', sub: 'Tap and count the pictures', color: '#FFE5EC' } as const;
// Shown once the child has traced three letters (#150): the game only asks letters the child has met.
const SOUNDS_GAME = { href: '/games/sounds', icon: 'sounds', title: 'Letter sounds', sub: 'Which picture starts with it?', color: '#FFF4CC' } as const;

export default function Games() {
  const line = useBuddyLine();
  const { state } = useProgressState();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => { setNow(Date.now()); const sub = AppState.addEventListener('change', (status) => { if (status === 'active') setNow(Date.now()); }); return () => sub.remove(); }, []));
  const iconSize = gameCardIconSize(useWindowDimensions().width);
  const left = gamesLeftToday(state.isPremium, gamesPlayedToday(state, now));
  const { traced } = useTracedLetters();
  const games = useMemo(() => [
    ...GAMES,
    ...(canPlayCounting(pickSeenWords(state.words, Math.random, Infinity, undefined, state.isPremium)) ? [COUNT_GAME] : []),
    ...(canPlaySounds(ACTIVE_PACK.alphabet, traced) ? [SOUNDS_GAME] : []),
  ], [state.words, state.isPremium, traced]);
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <IconTitle icon="games" text="Games" style={styles.title} />
        {left !== null ? <Text style={styles.count}>3 games a day · {left} left today</Text> : <Text style={styles.count}>Unlimited games</Text>}
        {/* Out of games is not a dead end: Letters and the sticker book have no daily limit (#116). Grown-up prompt stays last and grey. */}
        {left === 0 ? <><Buddy message={line('games_done_today')} /><FreeActivities /><BigButton label="Grown-ups: unlimited games" color={colors.textMuted} onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'games' } })} /></> : null}
        {games.map((game) => (
          <Pressable
            key={game.title}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            accessibilityHint={game.sub}
            onPress={() => { if (left !== 0) router.push(game.href); }}
            accessibilityState={{ disabled: left === 0 }}
            disabled={left === 0}
            style={({ pressed }) => [styles.card, { backgroundColor: game.color, transform: [{ scale: pressed ? 0.97 : 1 }] }, left === 0 && styles.cardResting]}
          >
            <Icon name={game.icon} size={iconSize} />
            <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.cardTitle}>{game.title}</Text>
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
  // Out of games for today: the cards can't be opened, so they look resting rather than tappable (#98).
  cardResting: { opacity: 0.5 },
  cardTitle: { fontSize: font.title, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: font.body, fontWeight: '600', color: colors.textMuted },
});
