import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Word } from '@/content/types';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { haptic } from '@/lib/haptics';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { useProgressActions } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { HINT_AFTER_MISSES, HintPulse } from '@/ui/HintPulse';
import { useAutoPlayWord, VoiceButton } from '@/ui/VoiceButton';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

import { buildChoiceRounds, type ChoiceRound } from './logic';
import { GameDoneActions } from './GameDoneActions';

/** `find`: read the word, tap its picture. `read`: see the picture, tap its word. */
type Mode = 'find' | 'read';

const NEXT_DELAY_MS = 1300;

export function ChoiceGame({ mode, seenWords }: { mode: Mode; seenWords: Word[] }) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { recordAnswer, recordGamePlayed } = useProgressActions();
  const optionCount = mode === 'find' ? Math.min(4, seenWords.length) : 3;
  const [rounds, setRounds] = useState<ChoiceRound[]>(() => buildChoiceRounds(seenWords, optionCount));
  const [index, setIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [shake] = useState(() => new Animated.Value(0));
  const [bounce] = useState(() => new Animated.Value(1));
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

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (rounds.length > 0 && index >= rounds.length) playSfx('reward', soundEffects);
  }, [index, rounds.length, soundEffects]);

  const round = rounds[index] as ChoiceRound | undefined;
  // Find the picture says the word in the family voice, if recorded (AI_DECISIONS 2026-11-04).
  useAutoPlayWord(mode === 'find' ? round?.answer.id : undefined);

  const choose = (option: Word) => {
    if (!round || locked.current || solved) return;
    if (option.id !== round.answer.id) {
      playSfx('try', soundEffects);
      hadWrong.current = true;
      haptic('warning', haptics);
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
    haptic('success', haptics);
    Animated.sequence([
      Animated.spring(bounce, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    later(() => {
      setIndex((i) => i + 1);
      setWrongIds([]);
      setSolved(false);
      locked.current = false;
      hadWrong.current = false;
    }, NEXT_DELAY_MS);
  };

  const playAgain = () => {
    clearTimers();
    recordGamePlayed();
    locked.current = false;
    hadWrong.current = false;
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
      : mode === 'find'
        ? line('game_find_prompt')
        : line('game_read_prompt');

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.round} accessibilityLabel={`Round ${index + 1} of ${rounds.length}`}>
        {index + 1} / {rounds.length}
      </Text>
      <Buddy mood={wrongIds.length > 0 && !solved ? 'think' : 'happy'} message={message} size={56} />

      {mode === 'find' ? (
        <View style={styles.promptRow}>
          <View style={styles.wordPrompt} accessible accessibilityRole="text" accessibilityLabel={`Find ${round.answer.hy}, ${round.answer.translit}`}>
            <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.promptWord}>{round.answer.hy}</Text>
            <Text style={styles.promptTranslit}>{round.answer.translit}</Text>
          </View>
          <VoiceButton wordId={round.answer.id} label={round.answer.translit} />
        </View>
      ) : (
        <View style={styles.picture} accessible accessibilityRole="image" accessibilityLabel={`Picture of ${round.answer.en}`}>
          <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={round.answer.id} emoji={round.answer.emoji} size={128} /></View>
        </View>
      )}

      <Animated.View
        style={[styles.options, mode === 'find' && styles.grid, { transform: [{ translateX: shake }] }]}
      >
        {round.options.map((option) => {
          const isAnswer = option.id === round.answer.id;
          const isWrong = wrongIds.includes(option.id);
          const isRight = solved && isAnswer;
          return (
            <Animated.View
              key={option.id}
              style={[mode === 'find' ? styles.gridItem : styles.rowItem, isRight && { transform: [{ scale: bounce }] }]}
            >
              <HintPulse active={!solved && isAnswer && wrongIds.length >= HINT_AFTER_MISSES}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${mode === 'find' ? `Picture choice: ${option.en}` : `Word choice: ${option.hy}`}${isRight ? ', correct' : isWrong ? ', try again' : ''}`}
                accessibilityState={{ disabled: solved || isWrong, selected: isRight }}
                disabled={solved || isWrong}
                onPress={() => choose(option)}
                style={({ pressed }) => [
                  styles.option,
                  isWrong && styles.wrong,
                  isRight && styles.right,
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                {mode === 'find' ? (
                  <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={option.id} emoji={option.emoji} size={80} /></View>
                ) : (
                  <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.optionWord}>{option.hy}</Text>
                )}
                {isRight ? <View style={styles.check} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Text style={styles.checkText}>✅</Text></View> : null}
              </Pressable>
              </HintPulse>
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
  promptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  wordPrompt: { flexShrink: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  promptWord: { fontSize: font.word, fontWeight: '800', color: colors.text, textAlign: 'center' },
  promptTranslit: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
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
  // Two columns: the items plus the row gap must fit in 100%, or the grid collapses to one column.
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  gridItem: { width: '46%' },
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
  optionWord: { fontSize: font.word, fontWeight: '800', color: colors.text, textAlign: 'center', flexShrink: 1 },
  check: { position: 'absolute', top: spacing.xs, right: spacing.sm },
  checkText: { fontSize: font.heading },
  done: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  back: { marginTop: 'auto' },
});
