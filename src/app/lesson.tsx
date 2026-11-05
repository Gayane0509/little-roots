import { router } from 'expo-router';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK } from '@/content/packs';
import { themeArtWordId } from '@/content/themeArt';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { freeWordsFinished } from '@/features/paywall/offer';
import type { Word } from '@/content/types';
import { lessonArtSizes } from '@/features/lesson/artSizes';
import { gameOptions, shuffled } from '@/features/lesson/game';
import { initialLessonState, lessonReducer, type Step } from '@/features/lesson/lessonReducer';
import { keepLastWord, lineWordIds } from '@/features/lesson/rhymeWords';
import { shouldShowTapHint } from '@/features/lesson/tapHint';
import { OutfitPortrait } from '@/features/stickers/OutfitPicker';
import { buildDailyLesson, type DailyLesson } from '@/lib/lesson';
import { haptic } from '@/lib/haptics';
import { OUTFIT_LABEL, outfitUnlockedBy, wornOutfit } from '@/lib/outfits';
import { playSfx } from '@/lib/sfx';
import { useFamilyVoice } from '@/state/familyVoice';
import { useSettings } from '@/state/settings';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy, BUDDY_NAME } from '@/ui/Buddy';
import { Confetti } from '@/ui/Confetti';
import { Icon } from '@/ui/Icon';
import { HINT_AFTER_MISSES, HintPulse } from '@/ui/HintPulse';
import { Screen } from '@/ui/Screen';
import { TapHint } from '@/ui/TapHint';
import { useAutoPlayWord, VoiceButton } from '@/ui/VoiceButton';
import { Wiggle } from '@/ui/Wiggle';
import { WordArt } from '@/ui/WordArt';
import { contentWidth, wordBox, wordFontSize } from '@/ui/wordFit';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function LessonScreen() {
  const line = useBuddyLine();
  const { ready } = useProgress();
  const { ready: settingsReady } = useSettings();
  if (!ready || !settingsReady) return <Screen><Buddy message={line('lesson_loading')} /></Screen>;
  return <ReadyLesson />;
}

function ReadyLesson() {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { state, recordAnswer, completeLesson } = useProgress();
  const outfit = wornOutfit(state);
  const { width, height, fontScale } = useWindowDimensions();
  const voice = useFamilyVoice();
  const [lesson] = useState<DailyLesson | null>(() => buildDailyLesson({
    themes: ACTIVE_PACK.themes, words: state.words, isPremium: state.isPremium, now: Date.now(),
  }));
  const [showNewSticker] = useState(() => !!lesson?.newWords[0] && !state.stickers.includes(lesson.newWords[0].emoji));
  const [newOutfit] = useState(() => showNewSticker ? outfitUnlockedBy(state.stickers.length, state.stickers.length + 1) : undefined);
  const art = lessonArtSizes(width, height, !!newOutfit);
  const [rounds] = useState(() => lesson ? shuffled([...lesson.newWords, ...lesson.reviewWords]) : []);
  const [flow, dispatch] = useReducer(lessonReducer, initialLessonState);
  const { stepIndex, cardIndex, roundIndex, songLineIndex, firstTryCorrect, hadWrongTap, wrongTaps, selectedId, feedbackPending } = flow;
  const completed = useRef(false);
  const answerLocked = useRef(false);
  const wrongThisRound = useRef(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shake] = useState(() => new Animated.Value(0));
  const [successScale] = useState(() => new Animated.Value(1));
  const [cardEntrance] = useState(() => new Animated.Value(0));
  const [cardTapped, setCardTapped] = useState(false);
  const [burst] = useState(() => new Animated.Value(0));

  useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  const steps = useMemo<Step[]>(() => lesson
    ? (lesson.newWords.length ? ['hello', 'new', 'game', 'song', 'reward'] : ['hello', 'game', 'song', 'reward'])
    : [], [lesson]);
  const options = useMemo(() => rounds[roundIndex] ? gameOptions(rounds[roundIndex]) : [], [rounds, roundIndex]);
  const step = steps[stepIndex];
  const currentRound = rounds[roundIndex];
  // Family voice (AI_DECISIONS 2026-11-04): each new card and each game round says its word once, if recorded.
  useAutoPlayWord(step === 'new' ? lesson?.newWords[cardIndex]?.id : step === 'game' ? currentRound?.id : undefined);

  useEffect(() => {
    if (step !== 'new') return;
    cardEntrance.setValue(0);
    Animated.timing(cardEntrance, { toValue: 1, duration: 360, useNativeDriver: true }).start();
  }, [step, cardIndex, cardEntrance]);

  useEffect(() => {
    if (step !== 'reward') return;
    playSfx('reward', soundEffects);
    burst.setValue(0);
    Animated.spring(burst, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [step, burst, soundEffects]);

  function nextStep() {
    dispatch({ type: 'NEXT_STEP', steps: steps.length, expected: stepIndex });
  }

  function answer(word: Word) {
    if (!currentRound || answerLocked.current || feedbackPending) return;
    if (word.id !== currentRound.id) {
      playSfx('try', soundEffects);
      wrongThisRound.current = true;
      dispatch({ type: 'WRONG', round: roundIndex });
      AccessibilityInfo.announceForAccessibility('Try again. Tap another picture.');
      haptic('warning', haptics);
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
    haptic('success', haptics);
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
    const freeDone = !state.isPremium && freeWordsFinished(state);
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.centered}>
          {/* The child's button is the one orange action; the grown-up prompt is grey, below it (#97, AI_DECISIONS). */}
          {freeDone ? <Buddy mood="cheer" message={line('free_words_finished')} /> : <Buddy message={line('all_caught_up')} />}
          <BigButton label="Back home" onPress={() => router.replace('/')} />
          {freeDone ? <BigButton label="Ask a grown-up for 80 more words" color={colors.textMuted} onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'themes' } })} /> : null}
        </ScrollView>
      </Screen>
    );
  }

  const card = lesson.newWords[cardIndex];
  return (
    <Screen scene={step === 'reward' ? 'hills' : undefined}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close lesson" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} style={styles.close}>
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.dots} accessibilityLabel={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => <View key={item} style={[styles.dot, index <= stepIndex && styles.dotActive]} />)}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { gap: step === 'song' ? art.songGap : art.gap, paddingVertical: art.gap }]} showsVerticalScrollIndicator={false}>
        {step === 'hello' && <>
          <Buddy message={`${state.childName ? line('greeting', { name: state.childName }) : line('greeting_anon')}\n${lesson.newWords.length ? line(lesson.newWords.length === 1 ? 'lesson_new_word' : 'lesson_new_words', { count: lesson.newWords.length }) : line('lesson_practice')}`} outfit={outfit} />
          <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={themeArtWordId(lesson.theme.id)} emoji={lesson.theme.emoji} size={140} /></View>
          {/* The theme's Armenian name leads, English under it (#109); long names shrink to stay whole. */}
          <View accessible accessibilityRole="header" accessibilityLabel={`${lesson.theme.titleHy}, ${lesson.theme.titleEn}`} style={styles.introTitle}>
            <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.heading, { fontSize: wordFontSize(lesson.theme.titleHy, contentWidth(width), font.word, fontScale) }]}>{lesson.theme.titleHy}</Text>
            <Text style={styles.introTitleEn}>{lesson.theme.titleEn}</Text>
          </View>
          {/* One sleeping seed per new word: the words still to grow today, without giving them away. Buddy says the count. */}
          {art.introSeeds && lesson.newWords.length > 0 ? (
            <View style={styles.introSeeds} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {lesson.newWords.map((word) => <View key={word.id} style={styles.introSeed}><Icon name="seed" size={64} /></View>)}
            </View>
          ) : null}
        </>}

        {step === 'new' && card && <>
          <Buddy message={line('lesson_tap_card')} outfit={outfit} />
          <Text style={styles.counter}>Word {cardIndex + 1} of {lesson.newWords.length}</Text>
          <Animated.View style={{ width: '100%', opacity: cardEntrance, transform: [{ translateY: cardEntrance.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}><Wiggle wordId={card.id} label={`${card.hy}, ${card.translit}, ${card.en}`} onTap={() => setCardTapped(true)}><View style={styles.wordCard}>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={card.id} emoji={card.emoji} size={art.card} /></View>
            <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.armenian, { fontSize: wordFontSize(card.hy, wordBox.lessonCard(width), font.word, fontScale) }]}>{card.hy}</Text>
            <Text style={styles.translit}>{card.translit}</Text>
            <Text style={styles.english}>{card.en}</Text>
            <TapHint visible={shouldShowTapHint(state, cardIndex, cardTapped)} />
          </View></Wiggle></Animated.View>
        </>}

        {step === 'game' && currentRound && <>
          <Buddy message={line(hadWrongTap ? 'lesson_good_try' : 'lesson_find_picture')} mood={hadWrongTap ? 'cheer' : 'point'} outfit={outfit} />
          <Text style={styles.counter}>Picture {roundIndex + 1} of {rounds.length}</Text>
          <View style={styles.promptRow}>
            <View accessible accessibilityRole="text" accessibilityLabel={`Find ${currentRound.hy}, ${currentRound.translit}`} style={styles.prompt}>
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.promptWord, { fontSize: wordFontSize(currentRound.hy, wordBox.lessonPrompt(width, !!voice.uris[currentRound.id]), font.title, fontScale) }]}>{currentRound.hy}</Text>
              <Text style={styles.promptTranslit}>{currentRound.translit}</Text>
            </View>
            <VoiceButton wordId={currentRound.id} label={currentRound.translit} />
          </View>
          <Animated.View style={[styles.options, { transform: [{ translateX: shake }] }]}>
            {options.map((word, index) => (
              <Animated.View key={word.id} style={{ width: '44%', transform: [{ scale: selectedId === word.id ? successScale : 1 }] }}>
                <HintPulse active={wrongTaps >= HINT_AFTER_MISSES && word.id === currentRound.id && !feedbackPending}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Picture ${index + 1} of ${options.length}: ${word.en}${selectedId === word.id ? ', correct' : ''}`}
                  accessibilityState={{ disabled: feedbackPending, selected: selectedId === word.id }}
                  accessibilityHint="Double tap to choose this picture" disabled={feedbackPending}
                  onPress={() => answer(word)} style={[styles.option, selectedId === word.id && styles.optionCorrect]}>
                  <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={word.id} emoji={word.emoji} size={art.option} /></View>
                  {selectedId === word.id && <View style={styles.check} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.checkText}>✓</Text></View>}
                </Pressable>
                </HintPulse>
              </Animated.View>
            ))}
          </Animated.View>
        </>}

        {step === 'song' && <>
          <Buddy message={line('lesson_song')} outfit={outfit} />
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.heading} accessibilityRole="header">{lesson.song.title}</Text>
          {lesson.song.lines.map((line, index) => (
            <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Rhyme line ${index + 1}: ${line.hy}, ${line.en}`} accessibilityState={{ selected: songLineIndex === index }} onPress={() => dispatch({ type: 'SONG_LINE', index })} style={[styles.songLine, { padding: art.songLinePadding }, songLineIndex === index && styles.songLineActive]}>
              {/* The line's words as pictures, so a child who can't read yet can follow along (#112). */}
              <View style={styles.songRow}>
                {(() => {
                  const ids = lineWordIds(line.hy, lesson.song, lesson.theme.words);
                  return ids.length ? <View style={styles.songPictures} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{ids.map((id) => <WordArt key={id} wordId={id} emoji={lesson.theme.words.find((w) => w.id === id)?.emoji ?? ''} size={art.songPicture} />)}</View> : null;
                })()}
                <View style={styles.songTexts}>
                  <Text style={styles.songHy}>{keepLastWord(line.hy)}</Text>
                  <Text style={styles.songEn}>{line.en}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </>}


        {step === 'reward' && <>
          <Confetti />
          <Buddy message={line('lesson_done')} mood="proud" outfit={outfit} />
          <Animated.View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ transform: [{ scale: burst }] }}><Icon name="stickers" size={art.reward} /></Animated.View>
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.heading} accessibilityRole="header">You earned {3 + firstTryCorrect} stars!</Text>
          {showNewSticker && lesson.newWords[0] && <View style={[styles.rewardRows, art.rewardRowsSideBySide && styles.rewardRowsSideBySide]}>
          <View accessible accessibilityRole="text" accessibilityLabel={`New sticker: ${lesson.newWords[0].en}`} style={styles.stickerRow}>
            <Text style={styles.sticker}>New sticker:</Text>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><WordArt wordId={lesson.newWords[0].id} emoji={lesson.newWords[0].emoji} size={art.sticker} /></View>
          </View>
          {newOutfit && <View accessible accessibilityRole="text" accessibilityLabel={`New for ${BUDDY_NAME.en}: ${OUTFIT_LABEL[newOutfit].toLowerCase()}. Dress up ${BUDDY_NAME.en} in the sticker book.`} style={styles.stickerRow}>
            <Text style={styles.sticker}>New for {BUDDY_NAME.hy}:</Text>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.newOutfit, { width: art.sticker, height: art.sticker }]}><OutfitPortrait outfit={newOutfit} /></View>
          </View>}
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
        {step === 'reward' && <BigButton label="Back home" onPress={() => router.replace('/')} />}
      </View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  close: { width: TOUCH_MIN, height: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.text, fontSize: 38 },
  dots: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingRight: TOUCH_MIN },
  dot: { width: 12, height: 12, borderRadius: radius.round, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  content: { flexGrow: 1, alignItems: 'center' },
  centered: { flexGrow: 1, justifyContent: 'center', gap: spacing.xl },
  heading: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' },
  introTitle: { alignItems: 'center', gap: spacing.xs },
  introTitleEn: { color: colors.textMuted, fontSize: font.body, fontWeight: '700', textAlign: 'center' },
  introSeeds: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  introSeed: { width: 80, height: 80, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  counter: { color: colors.textMuted, fontSize: font.body, fontWeight: '700' },
  wordCard: { width: '100%', minHeight: 300, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  // Word sizes come from `wordFontSize` (long words shrink instead of breaking, #105).
  armenian: { color: colors.text, fontWeight: '800', textAlign: 'center' },
  translit: { color: colors.textMuted, fontSize: font.heading, textAlign: 'center' },
  english: { color: colors.text, fontSize: font.body, textAlign: 'center' },
  promptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  prompt: { minHeight: TOUCH_MIN, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface },
  promptWord: { color: colors.text, fontWeight: '800', textAlign: 'center' },
  promptTranslit: { color: colors.textMuted, fontSize: font.body, textAlign: 'center' },
  options: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: { width: '100%', minHeight: 120, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#E9F8EF' },
  check: { position: 'absolute', right: spacing.md, top: spacing.sm },
  checkText: { color: colors.successText, fontSize: 34, fontWeight: '800' },
  songLine: { width: '100%', minHeight: TOUCH_MIN, justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  songLineActive: { borderColor: colors.primary, backgroundColor: '#FFF0DF' },
  songRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  songPictures: { gap: spacing.xs, alignItems: 'center' },
  songTexts: { flex: 1 },
  songHy: { color: colors.text, fontSize: font.heading, fontWeight: '700', textAlign: 'center' },
  songEn: { color: colors.textMuted, fontSize: font.small, textAlign: 'center' },
  sticker: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  newOutfit: { alignItems: 'center', justifyContent: 'center' },
  stickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rewardRows: { alignItems: 'center', gap: spacing.lg },
  rewardRowsSideBySide: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: spacing.xl },
  footer: { paddingVertical: spacing.md },
});
