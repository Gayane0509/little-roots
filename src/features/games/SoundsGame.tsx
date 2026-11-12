import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK, type Letter } from '@/content/packs';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { letterExampleArtId } from '@/features/letters/exampleArt';
import { haptic } from '@/lib/haptics';
import { goBackOrHome } from '@/lib/navigation';
import { playSfx } from '@/lib/sfx';
import { useFamilyVoice } from '@/state/familyVoice';
import { useTracedLetters } from '@/state/letters';
import { useProgressActions } from '@/state/progress';
import { useSettings } from '@/state/settings';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { HINT_AFTER_MISSES, HintPulse } from '@/ui/HintPulse';
import { LETTER_FONT } from '@/ui/letterFont';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

import { CHOICE_COMPACT_BELOW } from './choiceLayout';
import { GameDoneActions } from './GameDoneActions';
import { buildSoundRounds, canPlaySounds, SOUND_OPTIONS, type SoundRound } from './letterSounds';

const NEXT_DELAY_MS = 1300;

/** Side of one answer picture: three a row inside the content column (border and padding taken off), never above `max`. */
export function soundOptionArt(windowWidth: number, contentMax = 720, padding = spacing.md, gap = spacing.sm, max = 128): number {
  const column = Math.min(windowWidth - padding * 2, contentMax);
  return Math.min(max, Math.floor((column - gap * (SOUND_OPTIONS - 1)) / SOUND_OPTIONS) - 2 * 3 - 2 * spacing.sm);
}

/** Answer row width on tablets: three cards about 190 px wide, so the pictures fill them instead of floating in 234 px tiles. */
const WIDE_OPTIONS_MAX = 600;
/** Largest answer picture on a tablet; the word pictures are 256 px. */
const WIDE_ART_MAX = 176;

export type SoundLayout = { compact: boolean; optionArt: number; optionsMaxWidth: number; letterSize: number; letterLineHeight: number };

/**
 * Sizes for the Letter sounds screen. Short windows get the compact letter so Back stays on screen (#150); tablets that
 * are not short get a bigger letter and bigger pictures in a narrower answer row so both fill the screen (#166).
 */
export function soundLayout(window: { width: number; height: number }): SoundLayout {
  const compact = window.height < CHOICE_COMPACT_BELOW;
  const big = !compact && window.width >= WIDE_BREAKPOINT;
  const optionsMaxWidth = big ? WIDE_OPTIONS_MAX : 720;
  return {
    compact,
    optionArt: soundOptionArt(window.width, optionsMaxWidth, spacing.md, spacing.sm, big ? WIDE_ART_MAX : 128),
    optionsMaxWidth,
    letterSize: compact ? 64 : big ? 128 : 88,
    letterLineHeight: compact ? 84 : big ? 168 : 116,
  };
}

/** Letter sounds game (#150): see a traced letter, tap the picture whose word starts with it; the family voice says the word. */
export function SoundsGame({ onFinishedChange }: { onFinishedChange?: (finished: boolean) => void }) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { recordGamePlayed } = useProgressActions();
  const { traced } = useTracedLetters();
  const voice = useFamilyVoice();
  const window = useWindowDimensions();
  const { compact, optionArt, optionsMaxWidth, letterSize, letterLineHeight } = soundLayout(window);
  const [rounds, setRounds] = useState<SoundRound[]>(() => buildSoundRounds(ACTIVE_PACK.alphabet, traced));
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const hadWrong = useRef(false);

  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const stopVoice = voice.stop;
  useEffect(() => () => { clearTimer(); stopVoice(); }, [clearTimer, stopVoice]);

  // Traced letters load after the screen can open (cold start, restored route): build the rounds once they arrive
  // (state adjusted while rendering, as React recommends for derived resets; it runs once, then rounds is non-empty).
  if (rounds.length === 0 && canPlaySounds(ACTIVE_PACK.alphabet, traced)) setRounds(buildSoundRounds(ACTIVE_PACK.alphabet, traced));

  const round = rounds[index] as SoundRound | undefined;
  const finished = rounds.length > 0 && !round;
  useEffect(() => { onFinishedChange?.(finished); }, [finished, onFinishedChange]);
  useEffect(() => { if (finished) playSfx('reward', soundEffects); }, [finished, soundEffects]);

  if (rounds.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <Buddy mood="think" message={line('game_sounds_locked')} />
        <BigButton label="Trace letters" onPress={() => router.replace('/letters')} />
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    );
  }

  const playAgain = () => {
    clearTimer();
    recordGamePlayed();
    setRounds(buildSoundRounds(ACTIVE_PACK.alphabet, traced));
    setIndex(0);
    locked.current = false;
    hadWrong.current = false;
    setWrong([]);
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

  const choose = (option: Letter) => {
    if (locked.current) return;
    if (option !== round.answer) {
      hadWrong.current = true;
      playSfx('try', soundEffects);
      haptic('warning', haptics);
      setWrong((ids) => (ids.includes(option.upper) ? ids : [...ids, option.upper]));
      return;
    }
    locked.current = true;
    const firstTry = !hadWrong.current;
    // The family voice says the word when a grown-up recorded it; otherwise the usual chime.
    if (!voice.play(letterExampleArtId(option, ACTIVE_PACK.themes))) playSfx('correct', soundEffects);
    haptic('success', haptics);
    if (firstTry) setScore((s) => s + 1);
    setSolved(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      locked.current = false;
      hadWrong.current = false;
      setIndex((i) => i + 1);
      setWrong([]);
      setSolved(false);
    }, NEXT_DELAY_MS);
  };

  const message = solved ? line('game_correct') : wrong.length > 0 ? line('game_try_again') : line('game_sounds_prompt');
  const { answer } = round;

  return (
    <ScrollView contentContainerStyle={[styles.root, { gap: compact ? spacing.sm : spacing.md }]}>
      <Text style={styles.round} accessibilityLabel={`Round ${index + 1} of ${rounds.length}`}>{index + 1} / {rounds.length}</Text>
      <Buddy mood={wrong.length > 0 && !solved ? 'think' : 'happy'} message={message} size={56} />

      <View style={[styles.letterCard, { paddingVertical: compact ? spacing.sm : spacing.md }]} accessible accessibilityLabel={`Letter ${answer.name}`}>
        <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.letter, { fontSize: letterSize, lineHeight: letterLineHeight }]}>
          {answer.upper === answer.lower ? answer.upper : `${answer.upper} ${answer.lower}`}
        </Text>
      </View>

      <View style={[styles.options, { maxWidth: optionsMaxWidth }]}>
        {round.options.map((option) => {
          const isAnswer = option === answer;
          const isWrong = wrong.includes(option.upper);
          const isRight = solved && isAnswer;
          const rest = option.example.hy.slice(option.lower.length);
          return (
            <HintPulse key={`${index}:${option.upper}`} style={styles.optionSlot} active={!solved && isAnswer && wrong.length >= HINT_AFTER_MISSES}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${option.example.en}${isRight ? `, ${option.example.hy}, correct` : isWrong ? ', try again' : ''}`}
                accessibilityState={{ disabled: solved || isWrong, selected: isRight }}
                disabled={solved || isWrong}
                onPress={() => choose(option)}
                style={({ pressed }) => [styles.option, isWrong && styles.wrong, isRight && styles.right, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
              >
                <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <WordArt wordId={letterExampleArtId(option, ACTIVE_PACK.themes)} emoji={option.example.emoji} size={optionArt} />
                </View>
                {/* Once found, the word appears under its picture with the asked letter coloured: letter → word. The line is
                    always there (empty until then) so the cards don't grow when it appears. */}
                <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} numberOfLines={1} adjustsFontSizeToFit style={styles.word} accessible={false}>
                  {isRight ? <><Text style={styles.wordLetter}>{option.lower}</Text>{rest}</> : ''}
                </Text>
              </Pressable>
            </HintPulse>
          );
        })}
      </View>

      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} style={styles.back} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1 },
  round: { fontSize: font.heading, fontWeight: '700', color: colors.text, textAlign: 'center' },
  letterCard: { alignSelf: 'center', minWidth: 160, paddingHorizontal: spacing.lg, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.border, backgroundColor: '#FFF4CC', alignItems: 'center' },
  letter: { fontFamily: LETTER_FONT, color: colors.text, textAlign: 'center' },
  options: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, width: '100%', alignSelf: 'center' },
  optionSlot: { flex: 1 },
  option: { minHeight: TOUCH_MIN + 40, borderRadius: radius.md, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, gap: spacing.xs },
  wrong: { borderColor: colors.danger, backgroundColor: '#FDE8E8', opacity: 0.6 },
  right: { borderColor: colors.success, backgroundColor: '#E3F7EC' },
  word: { fontSize: font.body, lineHeight: 24, minHeight: 24, fontWeight: '700', color: colors.text },
  wordLetter: { color: colors.primary, fontWeight: '800' },
  done: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  back: { marginTop: 'auto' },
});
