import { router } from 'expo-router';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { THEMES } from '@/content/themes';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { freeWordsFinished } from '@/features/paywall/offer';
import type { Word } from '@/content/types';
import { gameOptions, shuffled } from '@/features/lesson/game';
import { initialLessonState, lessonReducer, type Step } from '@/features/lesson/lessonReducer';
import { buildDailyLesson, type DailyLesson } from '@/lib/lesson';
import { speakArmenian, stopSpeaking } from '@/lib/speech';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { stopWordAudio, useRecordings, useSpeakWord } from '@/state/recordings';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function LessonScreen() {
  const line = useBuddyLine();
  const { ready } = useProgress();
  const { ready: recordingsReady, loadError, retryLoad } = useRecordings();
  const { ready: settingsReady } = useSettings();
  if (!ready || !settingsReady || !recordingsReady) return <Screen><Buddy speak={false} message={line('lesson_loading')} />{loadError ? <BigButton label="Retry recordings" onPress={() => void retryLoad()} /> : null}</Screen>;
  return <ReadyLesson />;
}

function ReadyLesson() {
  const line = useBuddyLine();
  const { soundEffects } = useSettings();
  const { state, recordAnswer, completeLesson } = useProgress();
  const [lesson] = useState<DailyLesson | null>(() => buildDailyLesson({
    themes: THEMES, words: state.words, isPremium: state.isPremium, now: Date.now(),
  }));
  const [showNewSticker] = useState(() => !!lesson?.newWords[0] && !state.stickers.includes(lesson.newWords[0].emoji));
  const [rounds] = useState(() => lesson ? shuffled([...lesson.newWords, ...lesson.reviewWords]) : []);
  const [flow, dispatch] = useReducer(lessonReducer, initialLessonState);
  const { stepIndex, cardIndex, roundIndex, speakIndex, songLineIndex, firstTryCorrect, hadWrongTap, selectedId, feedbackPending } = flow;
  const speakWordAudio = useSpeakWord();
  const completed = useRef(false);
  const answerLocked = useRef(false);
  const wrongThisRound = useRef(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shake] = useState(() => new Animated.Value(0));
  const [successScale] = useState(() => new Animated.Value(1));
  const [cardEntrance] = useState(() => new Animated.Value(0));
  const [burst] = useState(() => new Animated.Value(0));

  useEffect(() => () => { stopSpeaking(); stopWordAudio(); if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  const steps = useMemo<Step[]>(() => lesson
    ? (lesson.newWords.length ? ['hello', 'new', 'game', 'song', 'speak', 'reward'] : ['hello', 'game', 'song', 'reward'])
    : [], [lesson]);
  const options = useMemo(() => rounds[roundIndex] ? gameOptions(rounds[roundIndex]) : [], [rounds, roundIndex]);
  const step = steps[stepIndex];
  const currentRound = rounds[roundIndex];

  useEffect(() => {
    if (step === 'game' && currentRound) speakWordAudio(currentRound);
  }, [step, currentRound, speakWordAudio]);

  useEffect(() => {
    if (step === 'speak' && lesson?.newWords[speakIndex]) speakWordAudio(lesson.newWords[speakIndex]);
  }, [step, lesson, speakIndex, speakWordAudio]);

  useEffect(() => {
    if (step !== 'new' && step !== 'speak') return;
    cardEntrance.setValue(0);
    Animated.timing(cardEntrance, { toValue: 1, duration: 360, useNativeDriver: true }).start();
  }, [step, cardIndex, speakIndex, cardEntrance]);

  useEffect(() => {
    if (step !== 'reward') return;
    playSfx('reward', soundEffects);
    burst.setValue(0);
    Animated.spring(burst, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [step, burst, soundEffects]);

  function nextStep() {
    stopSpeaking();
    stopWordAudio();
    dispatch({ type: 'NEXT_STEP', steps: steps.length, expected: stepIndex });
  }

  function answer(word: Word) {
    if (!currentRound || answerLocked.current || feedbackPending) return;
    if (word.id !== currentRound.id) {
      playSfx('try', soundEffects);
      wrongThisRound.current = true;
      dispatch({ type: 'WRONG', round: roundIndex });
      AccessibilityInfo.announceForAccessibility('Try again. Tap another picture.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    answerLocked.current = true;
    playSfx('correct', soundEffects);
    const firstTry = !wrongThisRound.current;
    dispatch({ type: 'CORRECT', round: roundIndex, selectedId: word.id });
    recordAnswer(currentRound.id, firstTry);
    if (roundIndex + 1 === rounds.length && !completed.current) {
      completed.current = true;
      completeLesson({
        newWordIds: lesson!.newWords.map((item) => item.id),
        reviewedCount: lesson!.reviewWords.length,
        starsEarned: 3 + firstTryCorrect + (firstTry ? 1 : 0),
        sticker: lesson!.newWords[0]?.emoji,
      });
    }
    AccessibilityInfo.announceForAccessibility('Correct!');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    successScale.setValue(1);
    Animated.sequence([
      Animated.spring(successScale, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.timing(successScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    feedbackTimer.current = setTimeout(() => {
      wrongThisRound.current = false;
      answerLocked.current = false;
      dispatch({ type: 'FINISH_FEEDBACK', round: roundIndex, count: rounds.length, steps: steps.length });
    }, 700);
  }

  if (lesson === null) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.centered}>
          {!state.isPremium && freeWordsFinished(state) ? <><Buddy mood="cheer" message={line('free_words_finished')} /><BigButton label="Ask a grown-up for 80 more words" onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'themes' } })} /></> : <Buddy message={line('all_caught_up')} />}
          <BigButton label="Back home" onPress={() => router.replace('/')} />
        </ScrollView>
      </Screen>
    );
  }

  const card = lesson.newWords[cardIndex];
  const speakWord = lesson.newWords[speakIndex];
  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close lesson" onPress={() => { stopSpeaking(); stopWordAudio(); if (router.canGoBack()) router.back(); else router.replace('/'); }} style={styles.close}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.dots} accessibilityLabel={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => <View key={item} style={[styles.dot, index <= stepIndex && styles.dotActive]} />)}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'hello' && <>
          <Buddy message={`${state.childName ? line('greeting', { name: state.childName }) : line('greeting_anon')}\n${lesson.newWords.length ? line('lesson_new_words', { count: lesson.newWords.length }) : line('lesson_practice')}`} />
          <Text style={styles.heroEmoji}>{lesson.theme.emoji}</Text>
          <Text style={styles.heading}>{lesson.theme.titleEn}</Text>
        </>}

        {step === 'new' && card && <>
          <Buddy message={line('lesson_tap_card')} />
          <Text style={styles.counter}>Word {cardIndex + 1} of {lesson.newWords.length}</Text>
          <Animated.View style={{ width: '100%', opacity: cardEntrance, transform: [{ translateY: cardEntrance.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}><Pressable accessibilityRole="button" accessibilityLabel={`Hear ${card.en} in Armenian`} onPress={() => speakWordAudio(card)} style={styles.wordCard}>
            <WordArt wordId={card.id} emoji={card.emoji} size={160} />
            <Text style={styles.armenian}>{card.hy}</Text>
            <Text style={styles.translit}>{card.translit}</Text>
            <Text style={styles.english}>{card.en}</Text>
          </Pressable></Animated.View>
        </>}

        {step === 'game' && currentRound && <>
          <Buddy speak={false} message={line(hadWrongTap ? 'lesson_good_try' : 'lesson_find_picture')} mood={hadWrongTap ? 'cheer' : 'happy'} />
          <Text style={styles.counter}>Picture {roundIndex + 1} of {rounds.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${currentRound.hy} again`} style={styles.prompt} onPress={() => speakWordAudio(currentRound)}>
            <Text style={styles.promptWord}>🔊 {currentRound.hy}</Text>
          </Pressable>
          <Animated.View style={[styles.options, { transform: [{ translateX: shake }] }]}>
            {options.map((word, index) => (
              <Animated.View key={word.id} style={{ width: '44%', transform: [{ scale: selectedId === word.id ? successScale : 1 }] }}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Picture ${index + 1} of ${options.length}`}
                  accessibilityHint="Double tap to choose this picture" disabled={feedbackPending}
                  onPress={() => answer(word)} style={[styles.option, selectedId === word.id && styles.optionCorrect]}>
                  <WordArt wordId={word.id} emoji={word.emoji} size={88} />
                  {selectedId === word.id && <Text style={styles.check}>✓</Text>}
                </Pressable>
              </Animated.View>
            ))}
          </Animated.View>
        </>}

        {step === 'song' && <>
          <Buddy message={line('lesson_song')} />
          <Text style={styles.heading}>{lesson.song.title}</Text>
          {lesson.song.lines.map((line, index) => (
            <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Hear song line ${index + 1}: ${line.hy}`} onPress={() => { dispatch({ type: 'SONG_LINE', index }); stopWordAudio(); speakArmenian(line.hy); }} style={[styles.songLine, songLineIndex === index && styles.songLineActive]}>
              <Text style={styles.songHy}>{line.hy}</Text>
              <Text style={styles.songEn}>{line.en}</Text>
            </Pressable>
          ))}
        </>}

        {step === 'speak' && speakWord && <>
          <Buddy speak={false} message={line('lesson_say_it')} />
          <Text style={styles.counter}>Say it {speakIndex + 1} of {lesson.newWords.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${speakWord.en} again`} onPress={() => speakWordAudio(speakWord)} style={styles.wordCard}>
            <WordArt wordId={speakWord.id} emoji={speakWord.emoji} size={160} />
            <Text style={styles.armenian}>{speakWord.hy}</Text>
            <Text style={styles.translit}>{speakWord.translit}</Text>
          </Pressable>
        </>}

        {step === 'reward' && <>
          <Buddy message={line('lesson_done')} mood="cheer" />
          <Animated.View style={{ transform: [{ scale: burst }] }}><Text style={styles.heroEmoji}>⭐</Text></Animated.View>
          <View style={styles.burst}>{['✨', '🌟', '✨', '⭐', '✨'].map((item, index) =>
            <Animated.Text key={index} style={[styles.burstStar, { opacity: burst, transform: [{ translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [12, index % 2 ? -16 : 16] }) }] }]}>{item}</Animated.Text>)}</View>
          <Text style={styles.heading}>You earned {3 + firstTryCorrect} stars!</Text>
          {showNewSticker && lesson.newWords[0] && <View style={styles.stickerRow}>
            <Text style={styles.sticker}>New sticker:</Text>
            <WordArt wordId={lesson.newWords[0].id} emoji={lesson.newWords[0].emoji} size={96} />
          </View>}
        </>}
      </ScrollView>

      {step !== 'game' && <View style={styles.footer}>
        {step === 'hello' && <BigButton label="Let's go!" onPress={nextStep} />}
        {step === 'new' && <BigButton label="Next" onPress={() => {
          playSfx('tap', soundEffects);
          dispatch({ type: 'NEXT_CARD', count: lesson.newWords.length, expected: cardIndex, expectedStep: stepIndex, steps: steps.length });
        }} />}
        {step === 'song' && <BigButton label="Next" onPress={() => { playSfx('tap', soundEffects); nextStep(); }} />}
        {step === 'speak' && <BigButton label="I said it!" onPress={() => {
          dispatch({ type: 'NEXT_SPEAK', count: lesson.newWords.length, expected: speakIndex, expectedStep: stepIndex, steps: steps.length });
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
  centered: { flexGrow: 1, justifyContent: 'center', gap: spacing.xl },
  heading: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' },
  heroEmoji: { fontSize: 112, textAlign: 'center' },
  counter: { color: colors.textMuted, fontSize: font.body, fontWeight: '700' },
  wordCard: { width: '100%', minHeight: 300, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  armenian: { color: colors.text, fontSize: font.word, fontWeight: '800', textAlign: 'center' },
  translit: { color: colors.textMuted, fontSize: font.heading, textAlign: 'center' },
  english: { color: colors.text, fontSize: font.body, textAlign: 'center' },
  prompt: { minHeight: TOUCH_MIN, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface },
  promptWord: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' },
  options: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: { width: '100%', minHeight: 120, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#E9F8EF' },
  check: { position: 'absolute', right: spacing.md, top: spacing.sm, color: colors.success, fontSize: 34, fontWeight: '800' },
  burst: { flexDirection: 'row', gap: spacing.sm },
  burstStar: { fontSize: 28 },
  songLine: { width: '100%', minHeight: TOUCH_MIN, justifyContent: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  songLineActive: { borderColor: colors.primary, backgroundColor: '#FFF0DF' },
  songHy: { color: colors.text, fontSize: font.heading, fontWeight: '700', textAlign: 'center' },
  songEn: { color: colors.textMuted, fontSize: font.small, textAlign: 'center' },
  sticker: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  stickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  footer: { paddingVertical: spacing.md },
});
