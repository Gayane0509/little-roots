import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { goBackOrHome } from '@/lib/navigation';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { gamesPlayedToday, useProgressState } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { colors, spacing } from '@/ui/tokens';
import { FreeActivities } from './FreeActivities';
import { canReplayGame } from './gameDone';

/** The finished-game buttons, under one Buddy bubble: the game's result, plus "that's all for today" once the free games are used up (#125). */
export function GameDoneActions({ result, onPlayAgain }: { result: string; onPlayAgain: () => void }) {
  const line = useBuddyLine();
  const { state } = useProgressState();
  const canReplay = canReplayGame(state.isPremium, gamesPlayedToday(state));
  return <View style={styles.actions}>
    <Buddy mood="cheer" message={canReplay ? result : `${result}\n${line('games_done_today')}`} />
    {canReplay ? <BigButton label="Play again" color={colors.success} onPress={() => {
      // Check the current entitlement again when the button is pressed.
      if (canReplayGame(state.isPremium, gamesPlayedToday(state))) onPlayAgain();
    }} /> : <FreeActivities />}
    {/* Out of games, the free activities are the child's orange choices (#124); Back and the grown-up prompt are grey (#97). */}
    <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
    {canReplay ? null : <BigButton label="Grown-ups: unlimited games" color={colors.textMuted} onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'games' } })} />}
  </View>;
}

const styles = StyleSheet.create({ actions: { gap: spacing.lg } });
