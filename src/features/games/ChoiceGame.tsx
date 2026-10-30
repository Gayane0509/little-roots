import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Word } from '@/content/types';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { stopSpeaking } from '@/lib/speech';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { useProgressActions } from '@/state/progress';
import { stopWordAudio, useSpeakWord } from '@/state/recordings';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

import { buildChoiceRounds, type ChoiceRound } from './logic';
import { GameDoneActions } from './GameDoneActions';

type Mode = 'listen' | 'read';

const NEXT_DELAY_MS = 1300;
const PLAY_DELAY_MS = 450;

export function ChoiceGame({ mode, seenWords }: { mode: Mode; seenWords: Word[] }) {
  const line = useBuddyLine();
  const { soundEffects } = useSettings();
  const { recordAnswer, recordGamePlayed } = useProgressActions();
  const speak = useSpeakWord();
  const optionCount = mode === 'listen' ? 4 : 3;
  const [rounds, setRounds] = useState<ChoiceRound[]>(() => buildChoiceRounds(seenWords, optionCount));
  const [index, setIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [shake] = useState(() => new Animated.Value(0));
  const [bounce] = useState(() => new Animated.Value(1));
  const counted = useRef(false);
  const locked = useRef(false);
  const hadWrong = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      fn();
    }, ms);
    timers.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => {
    clearTimers();
    stopWordAudio();
    stopSpeaking();
  }, [clearTimers]);

  useEffect(() => {
    if (rounds.length > 0 && index >= rounds.length && !counted.current) { counted.current = true; recordGamePlayed(); playSfx('reward', soundEffects); }
  }, [index, rounds.length, recordGamePlayed, soundEffects]);

  const round = rounds[index] as ChoiceRound | undefined;
  const answerId = round?.answer.id;

  // Listening rounds start by playing the word.
  useEffect(() => {
    if (mode !== 'listen' || !round) return;
    later(() => speak(round.answer), PLAY_DELAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on a new round
  }, [mode, answerId, index]);

  const choose = (option: Word) => {
    if (!round || locked.current || solved) return;
    if (option.id !== round.answer.id) {
      playSfx('try', soundEffects);
      hadWrong.current = true;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setWrongIds((ids) => (ids.includes(option.id) ? ids : [...ids, option.id]));
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    locked.current = true;
    playSfx('correct', soundEffects);
    const firstTry = !hadWrong.current;
    recordAnswer(round.answer.id, firstTry);
    if (firstTry) setScore((s) => s + 1);
    setSolved(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(bounce, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    // Read mode keeps the audio back until the child has answered.
    if (mode === 'read') speak(round.answer);
    later(() => {
      if (index + 1 === rounds.length && !counted.current) { counted.current = true; recordGamePlayed(); playSfx('reward', soundEffects); }
      setIndex((i) => i + 1);
      setWrongIds([]);
      setSolved(false);
      locked.current = false;
      hadWrong.current = false;
    }, NEXT_DELAY_MS);
  };

  const playAgain = () => {
    clearTimers();
    stopWordAudio();
    counted.current = false;
    locked.current = false;
    hadWrong.current = false;
    stopSpeaking();
    setRounds(buildChoiceRounds(seenWords, optionCount));
    setIndex(0);
    setWrongIds([]);
    setSolved(false);
    setScore(0);
  };

  if (!round) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <Buddy mood="cheer" message={line('game_score', { score, total: rounds.length })} />
        <GameDoneActions onPlayAgain={playAgain} />
      </ScrollView>
    );
  }

  const message = solved
    ? line('game_correct')
    : wrongIds.length > 0
      ? line('game_try_again')
      : mode === 'listen'
        ? line('game_listen_prompt')
        : line('game_read_prompt');

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.round} accessibilityLabel={`Round ${index + 1} of ${rounds.length}`}>
        {index + 1} / {rounds.length}
      </Text>
      <Buddy mood={wrongIds.length > 0 && !solved ? 'think' : 'happy'} message={message} size={56} />

      {mode === 'listen' ? (
        <BigButton label="🔊 Hear it again" onPress={() => speak(round.answer)} disabled={solved} />
      ) : (
        <View style={styles.picture} accessibilityLabel="Picture to read">
          <WordArt wordId={round.answer.id} emoji={round.answer.emoji} size={128} />
        </View>
      )}

      <Animated.View
        style={[styles.options, mode === 'listen' && styles.grid, { transform: [{ translateX: shake }] }]}
      >
        {round.options.map((option) => {
          const isAnswer = option.id === round.answer.id;
          const isWrong = wrongIds.includes(option.id);
          const isRight = solved && isAnswer;
          return (
            <Animated.View
              key={option.id}
              style={[mode === 'listen' ? styles.gridItem : styles.rowItem, isRight && { transform: [{ scale: bounce }] }]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={mode === 'listen' ? 'Picture choice' : 'Word choice'}
                accessibilityState={{ disabled: solved }}
                disabled={solved || isWrong}
                onPress={() => choose(option)}
                style={({ pressed }) => [
                  styles.option,
                  isWrong && styles.wrong,
                  isRight && styles.right,
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                {mode === 'listen' ? (
                  <WordArt wordId={option.id} emoji={option.emoji} size={80} />
                ) : (
                  <Text style={styles.optionWord} adjustsFontSizeToFit numberOfLines={1}>{option.hy}</Text>
                )}
                {isRight ? <Text style={styles.check}>✅</Text> : null}
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>

      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} style={styles.back} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1, gap: spacing.md },
  round: { fontSize: font.heading, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  picture: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  options: { gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: spacing.md },
  rowItem: { width: '100%' },
  option: {
    minHeight: TOUCH_MIN + 40,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  wrong: { borderColor: colors.danger, backgroundColor: '#FDE8E8', opacity: 0.6 },
  right: { borderColor: colors.success, backgroundColor: '#E3F7EC' },
  optionWord: { fontSize: font.word, fontWeight: '800', color: colors.text },
  check: { position: 'absolute', top: spacing.xs, right: spacing.sm, fontSize: font.heading },
  done: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  back: { marginTop: 'auto' },
});
