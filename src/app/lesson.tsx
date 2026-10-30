import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '@/content/themes';
import type { Word } from '@/content/types';
import { gameOptions, shuffled } from '@/features/lesson/game';
import { buildDailyLesson, type DailyLesson } from '@/lib/lesson';
import { speakArmenian, stopSpeaking } from '@/lib/speech';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

type Step = 'hello' | 'new' | 'game' | 'song' | 'speak' | 'reward';

export default function LessonScreen() {
  const { ready } = useProgress();
  if (!ready) return <Screen><Buddy message="Getting your lesson ready…" /></Screen>;
  return <ReadyLesson />;
}

function ReadyLesson() {
  const { state, recordAnswer, completeLesson } = useProgress();
  const [lesson] = useState<DailyLesson | null>(() => buildDailyLesson({
    themes: THEMES, words: state.words, isPremium: state.isPremium, now: Date.now(),
  }));
  const [showNewSticker] = useState(() => !!lesson?.newWords[0] && !state.stickers.includes(lesson.newWords[0].emoji));
  const [rounds] = useState(() => lesson ? shuffled([...lesson.newWords, ...lesson.reviewWords]) : []);
  const [stepIndex, setStepIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [speakIndex, setSpeakIndex] = useState(0);
  const [songLineIndex, setSongLineIndex] = useState<number | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [hadWrongTap, setHadWrongTap] = useState(false);
  const [encouragement, setEncouragement] = useState('Find the picture!');
  const completed = useRef(false);
  const answeredRound = useRef(-1);
  const firstTryEligible = useRef(true);
  const [shake] = useState(() => new Animated.Value(0));

  useEffect(() => () => { stopSpeaking(); }, []);

  const steps = useMemo<Step[]>(() => lesson
    ? (lesson.newWords.length ? ['hello', 'new', 'game', 'song', 'speak', 'reward'] : ['hello', 'game', 'song', 'reward'])
    : [], [lesson]);
  const options = useMemo(() => rounds[roundIndex] ? gameOptions(rounds[roundIndex]) : [], [rounds, roundIndex]);
  const step = steps[stepIndex];
  const currentRound = rounds[roundIndex];

  useEffect(() => {
    if (step === 'game' && currentRound) speakArmenian(currentRound.hy);
  }, [step, currentRound]);

  useEffect(() => {
    if (step === 'speak' && lesson?.newWords[speakIndex]) speakArmenian(lesson.newWords[speakIndex].hy);
  }, [step, lesson, speakIndex]);

  useEffect(() => {
    if (step !== 'reward' || !lesson || completed.current) return;
    completed.current = true;
    completeLesson({
      newWordIds: lesson.newWords.map((word) => word.id),
      reviewedCount: lesson.reviewWords.length,
      starsEarned: 3 + firstTryCorrect,
      sticker: lesson.newWords[0]?.emoji,
    });
  }, [step, lesson, firstTryCorrect, completeLesson]);

  function nextStep() {
    stopSpeaking();
    setStepIndex((index) => index === stepIndex ? Math.min(index + 1, steps.length - 1) : index);
  }

  function answer(word: Word) {
    if (!currentRound || answeredRound.current === roundIndex) return;
    if (word.id !== currentRound.id) {
      firstTryEligible.current = false;
      setHadWrongTap(true);
      setEncouragement('Good try! Tap another picture.');
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    answeredRound.current = roundIndex;
    recordAnswer(currentRound.id, firstTryEligible.current);
    if (firstTryEligible.current) setFirstTryCorrect((count) => count + 1);
    firstTryEligible.current = true;
    setHadWrongTap(false);
    setEncouragement('Find the picture!');
    if (roundIndex + 1 < rounds.length) setRoundIndex((index) => index === roundIndex ? index + 1 : index);
    else nextStep();
  }

  if (lesson === null) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Buddy message="All caught up! Come back tomorrow." />
          <BigButton label="Back home" onPress={() => router.replace('/')} />
        </View>
      </Screen>
    );
  }

  const card = lesson.newWords[cardIndex];
  const speakWord = lesson.newWords[speakIndex];
  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close lesson" onPress={() => { stopSpeaking(); if (router.canGoBack()) router.back(); else router.replace('/'); }} style={styles.close}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.dots} accessibilityLabel={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => <View key={item} style={[styles.dot, index <= stepIndex && styles.dotActive]} />)}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'hello' && <>
          <Buddy message={`Hello${state.childName ? `, ${state.childName}` : ''}! ${lesson.newWords.length ? `Let's learn ${lesson.newWords.length} new words!` : "Let's practice our words!"}`} />
          <Text style={styles.heroEmoji}>{lesson.theme.emoji}</Text>
          <Text style={styles.heading}>{lesson.theme.titleEn}</Text>
        </>}

        {step === 'new' && card && <>
          <Buddy message="Tap the card to hear the word!" />
          <Text style={styles.counter}>Word {cardIndex + 1} of {lesson.newWords.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${card.en} in Armenian`} onPress={() => speakArmenian(card.hy)} style={styles.wordCard}>
            <Text style={styles.cardEmoji}>{card.emoji}</Text>
            <Text style={styles.armenian}>{card.hy}</Text>
            <Text style={styles.translit}>{card.translit}</Text>
            <Text style={styles.english}>{card.en}</Text>
          </Pressable>
        </>}

        {step === 'game' && currentRound && <>
          <Buddy message={encouragement} mood={hadWrongTap ? 'cheer' : 'happy'} />
          <Text style={styles.counter}>Picture {roundIndex + 1} of {rounds.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${currentRound.hy} again`} style={styles.prompt} onPress={() => speakArmenian(currentRound.hy)}>
            <Text style={styles.promptWord}>🔊 {currentRound.hy}</Text>
          </Pressable>
          <Animated.View style={[styles.options, { transform: [{ translateX: shake }] }]}>
            {options.map((word) => (
              <Pressable key={word.id} accessibilityRole="button" accessibilityLabel={`${word.en} picture`} onPress={() => answer(word)} style={styles.option}>
                <Text style={styles.optionEmoji}>{word.emoji}</Text>
              </Pressable>
            ))}
          </Animated.View>
        </>}

        {step === 'song' && <>
          <Buddy message="Let's hear our little song! Tap a line." />
          <Text style={styles.heading}>{lesson.song.title}</Text>
          {lesson.song.lines.map((line, index) => (
            <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Hear song line ${index + 1}: ${line.hy}`} onPress={() => { setSongLineIndex(index); speakArmenian(line.hy); }} style={[styles.songLine, songLineIndex === index && styles.songLineActive]}>
              <Text style={styles.songHy}>{line.hy}</Text>
              <Text style={styles.songEn}>{line.en}</Text>
            </Pressable>
          ))}
        </>}

        {step === 'speak' && speakWord && <>
          <Buddy message="My turn, then your turn! Say the word aloud." />
          <Text style={styles.counter}>Say it {speakIndex + 1} of {lesson.newWords.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${speakWord.en} again`} onPress={() => speakArmenian(speakWord.hy)} style={styles.wordCard}>
            <Text style={styles.cardEmoji}>{speakWord.emoji}</Text>
            <Text style={styles.armenian}>{speakWord.hy}</Text>
            <Text style={styles.translit}>{speakWord.translit}</Text>
          </Pressable>
        </>}

        {step === 'reward' && <>
          <Buddy message="Amazing work! You did it!" mood="cheer" />
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heading}>You earned {3 + firstTryCorrect} stars!</Text>
          {showNewSticker && lesson.newWords[0] && <Text style={styles.sticker}>New sticker: {lesson.newWords[0].emoji}</Text>}
        </>}
      </ScrollView>

      {step !== 'game' && <View style={styles.footer}>
        {step === 'hello' && <BigButton label="Let's go!" onPress={nextStep} />}
        {step === 'new' && <BigButton label="Next" onPress={() => {
          if (cardIndex + 1 < lesson.newWords.length) setCardIndex((index) => index === cardIndex ? index + 1 : index);
          else nextStep();
        }} />}
        {step === 'song' && <BigButton label="Next" onPress={nextStep} />}
        {step === 'speak' && <BigButton label="I said it!" onPress={() => {
          if (speakIndex + 1 < lesson.newWords.length) setSpeakIndex((index) => index === speakIndex ? index + 1 : index);
          else nextStep();
        }} />}
        {step === 'reward' && <BigButton label="Back home" onPress={() => router.replace('/')} />}
      </View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  close: { width: TOUCH_MIN, height: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.text, fontSize: 38, lineHeight: 44 },
  dots: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingRight: TOUCH_MIN },
  dot: { width: 12, height: 12, borderRadius: radius.round, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  content: { flexGrow: 1, alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  centered: { flex: 1, justifyContent: 'center', gap: spacing.xl },
  heading: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' },
  heroEmoji: { fontSize: 112, textAlign: 'center' },
  counter: { color: colors.textMuted, fontSize: font.body, fontWeight: '700' },
  wordCard: { width: '100%', minHeight: 300, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  cardEmoji: { fontSize: 88 },
  armenian: { color: colors.text, fontSize: font.word, fontWeight: '800', textAlign: 'center' },
  translit: { color: colors.textMuted, fontSize: font.heading, textAlign: 'center' },
  english: { color: colors.text, fontSize: font.body, textAlign: 'center' },
  prompt: { minHeight: TOUCH_MIN, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface },
  promptWord: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' },
  options: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: { width: '44%', minHeight: 120, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  optionEmoji: { fontSize: 72 },
  songLine: { width: '100%', minHeight: TOUCH_MIN, justifyContent: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  songLineActive: { borderColor: colors.primary, backgroundColor: '#FFF0DF' },
  songHy: { color: colors.text, fontSize: font.heading, fontWeight: '700', textAlign: 'center' },
  songEn: { color: colors.textMuted, fontSize: font.small, textAlign: 'center' },
  sticker: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  footer: { paddingVertical: spacing.md },
});
