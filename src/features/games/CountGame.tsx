import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK, getWord } from '@/content/packs';
import type { Word } from '@/content/types';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { haptic } from '@/lib/haptics';
import { goBackOrHome } from '@/lib/navigation';
import { playSfx } from '@/lib/sfx';
import { useFamilyVoice } from '@/state/familyVoice';
import { useProgressActions } from '@/state/progress';
import { useSettings } from '@/state/settings';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { HINT_AFTER_MISSES, HintPulse } from '@/ui/HintPulse';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

import { buildCountRounds, countItemSize, numberValue, type CountRound } from './counting';
import { GameDoneActions } from './GameDoneActions';

const NEXT_DELAY_MS = 1300;
const NUMBER_WORDS = ACTIVE_PACK.themes.find((theme) => theme.id === 'numbers')?.words ?? [];

/** Counting game (#151): tap each picture to count it (the family voice says the number, if recorded), then pick how many. */
export function CountGame({ seenWords, onFinishedChange }: { seenWords: Word[]; onFinishedChange?: (finished: boolean) => void }) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { recordAnswer, recordGamePlayed } = useProgressActions();
  const voice = useFamilyVoice();
  const itemSize = countItemSize(useWindowDimensions().width);
  const [rounds, setRounds] = useState<CountRound[]>(() => buildCountRounds(seenWords));
  const [index, setIndex] = useState(0);
  const [counted, setCounted] = useState<number[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Taps can land faster than a re-render, so the count and the answer lock live in refs (state only draws them).
  const countedRef = useRef<number[]>([]);
  const locked = useRef(false);
  const hadWrong = useRef(false);

  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const stopVoice = voice.stop;
  useEffect(() => () => { clearTimer(); stopVoice(); }, [clearTimer, stopVoice]);

  const round = rounds[index] as CountRound | undefined;
  const finished = rounds.length > 0 && !round;
  useEffect(() => { onFinishedChange?.(finished); }, [finished, onFinishedChange]);
  useEffect(() => { if (finished) playSfx('reward', soundEffects); }, [finished, soundEffects]);

  if (rounds.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <Buddy mood="think" message={line('game_count_locked')} />
        <BigButton label="Go to lesson" onPress={() => router.replace('/lesson')} />
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    );
  }

  const playAgain = () => {
    clearTimer();
    recordGamePlayed();
    setRounds(buildCountRounds(seenWords));
    setIndex(0);
    countedRef.current = [];
    locked.current = false;
    hadWrong.current = false;
    setCounted([]);
    setWrongIds([]);
    setSolved(false);
    setScore(0);
  };

  if (!round) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <GameDoneActions result={line('game_score', { score, total: rounds.length })} onPlayAgain={playAgain} />
      </ScrollView>
    );
  }

  const allCounted = counted.length === round.value;
  const object = getWord(round.objectId);

  const count = (slot: number) => {
    const done = countedRef.current;
    if (done.includes(slot) || done.length >= round.value) return;
    countedRef.current = [...done, slot];
    setCounted(countedRef.current);
    // Say the number in the family voice when a grown-up recorded it (any number, met or not); otherwise a soft tap.
    const spoken = NUMBER_WORDS.find((word) => numberValue(word) === countedRef.current.length);
    if (!(spoken && voice.play(spoken.id))) playSfx('tap', soundEffects);
    haptic('tap', haptics);
  };

  const choose = (option: Word) => {
    if (locked.current || countedRef.current.length < round.value) return;
    if (option.id !== round.answer.id) {
      hadWrong.current = true;
      playSfx('try', soundEffects);
      haptic('warning', haptics);
      setWrongIds((ids) => (ids.includes(option.id) ? ids : [...ids, option.id]));
      return;
    }
    locked.current = true;
    const firstTry = !hadWrong.current;
    playSfx('correct', soundEffects);
    haptic('success', haptics);
    recordAnswer(round.answer.id, firstTry);
    if (firstTry) setScore((s) => s + 1);
    setSolved(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      countedRef.current = [];
      locked.current = false;
      hadWrong.current = false;
      setIndex((i) => i + 1);
      setCounted([]);
      setWrongIds([]);
      setSolved(false);
    }, NEXT_DELAY_MS);
  };

  const message = solved ? line('game_correct') : wrongIds.length > 0 ? line('game_try_again') : allCounted ? line('game_count_how_many') : line('game_count_prompt');
  const objectName = object?.en ?? 'picture';

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.round} accessibilityLabel={`Round ${index + 1} of ${rounds.length}`}>{index + 1} / {rounds.length}</Text>
      <Buddy mood={wrongIds.length > 0 && !solved ? 'think' : 'happy'} message={message} size={56} />

      <View style={[styles.items, { maxWidth: itemSize * 4 + spacing.sm * 3 }]}>
        {Array.from({ length: round.value }, (_, slot) => {
          const order = counted.indexOf(slot);
          const done = order >= 0;
          return (
            <Pressable
              key={`${index}:${slot}`}
              accessibilityRole="button"
              accessibilityLabel={done ? `${objectName}, counted ${order + 1}` : `Count this ${objectName}`}
              // A counted picture stays enabled (screen readers would call it dimmed); `count` ignores a second tap.
              accessibilityState={{ disabled: allCounted }}
              disabled={allCounted}
              onPress={() => count(slot)}
              style={({ pressed }) => [styles.item, { width: itemSize, height: itemSize }, done && styles.itemCounted, { transform: [{ scale: pressed ? 0.94 : 1 }] }]}
            >
              <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <WordArt wordId={round.objectId} emoji={object?.emoji ?? '⭐'} size={Math.round(itemSize * 0.7)} />
              </View>
              {done ? <View style={styles.badge} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.badgeText}>{order + 1}</Text></View> : null}
            </Pressable>
          );
        })}
      </View>

      {allCounted ? (
        <View style={styles.options}>
          {round.options.map((option) => {
            const isAnswer = option.id === round.answer.id;
            const isWrong = wrongIds.includes(option.id);
            const isRight = solved && isAnswer;
            return (
              <HintPulse key={option.id} style={styles.optionSlot} active={!solved && isAnswer && wrongIds.length >= HINT_AFTER_MISSES}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${option.hy}, ${option.en}${isRight ? ', correct' : isWrong ? ', try again' : ''}`}
                  accessibilityState={{ disabled: solved || isWrong, selected: isRight }}
                  disabled={solved || isWrong}
                  onPress={() => choose(option)}
                  style={({ pressed }) => [styles.option, isWrong && styles.wrong, isRight && styles.right, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
                >
                  <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.optionDigit}>{option.emoji.replace(/️?⃣/g, '')}</Text>
                  <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.optionWord}>{option.hy}</Text>
                </Pressable>
              </HintPulse>
            );
          })}
        </View>
      ) : null}

      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} style={styles.back} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1, gap: spacing.md },
  round: { fontSize: font.heading, fontWeight: '700', color: colors.text, textAlign: 'center' },
  // Four a row at every width (tablets would fit five): 8 reads as 4 + 4.
  items: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, alignSelf: 'center', width: '100%' },
  item: { borderRadius: radius.md, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  itemCounted: { borderColor: colors.success, backgroundColor: '#E3F7EC' },
  // Inside the tile: a badge hanging past the edge was clipped by the scroll view on the right-hand column.
  badge: { position: 'absolute', top: spacing.xs, right: spacing.xs, minWidth: 28, height: 28, borderRadius: radius.round, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xs },
  badgeText: { fontSize: font.body, fontWeight: '800', color: '#FFFFFF' },
  options: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  // Three equal slots share the column (at 320 px each is 90 wide; 96 minimum widths overflowed it).
  optionSlot: { flex: 1 },
  option: { minWidth: TOUCH_MIN, minHeight: TOUCH_MIN + 40, borderRadius: radius.md, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  wrong: { borderColor: colors.danger, backgroundColor: '#FDE8E8', opacity: 0.6 },
  right: { borderColor: colors.success, backgroundColor: '#E3F7EC' },
  optionDigit: { fontSize: font.title, fontWeight: '800', color: colors.text },
  optionWord: { fontSize: font.body, fontWeight: '700', color: colors.text },
  done: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  back: { marginTop: 'auto' },
});
