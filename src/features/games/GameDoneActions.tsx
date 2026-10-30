import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { goBackOrHome } from '@/lib/navigation';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { gamesPlayedToday, useProgressState } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { colors, spacing } from '@/ui/tokens';
import { canReplayGame } from './gameDone';

export function GameDoneActions({ onPlayAgain }: { onPlayAgain: () => void }) {
  const line = useBuddyLine();
  const { state } = useProgressState();
  const canReplay = canReplayGame(state.isPremium, gamesPlayedToday(state));
  return <View style={styles.actions}>
    {canReplay ? <BigButton label="Play again" color={colors.success} onPress={() => {
      // Check the current entitlement again when the button is pressed.
      if (canReplayGame(state.isPremium, gamesPlayedToday(state))) onPlayAgain();
    }} /> : <>
      <Buddy message={line('games_done_today')} />
      <BigButton label="Grown-ups: unlimited games" onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'games' } })} />
    </>}
    <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
  </View>;
}

const styles = StyleSheet.create({ actions: { gap: spacing.lg } });
