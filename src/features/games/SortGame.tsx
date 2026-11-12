import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { IconName } from '@/art/icons';
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
import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

import { CHOICE_COMPACT_BELOW } from './choiceLayout';
import { GameDoneActions } from './GameDoneActions';
import { buildSortRounds, type Basket, type SortRound } from './sorting';

const NEXT_DELAY_MS = 900;
/** Sorted pictures shown inside a basket; older ones drop off so the basket never grows past one row. */
const BASKET_SHOWN = 4;

const BASKETS: { id: Basket; icon: IconName; label: string; color: string }[] = [
  { id: 'food', icon: 'plate', label: 'Food', color: '#FFE8C2' },
  { id: 'other', icon: 'toybox', label: 'Not food', color: '#D9ECFF' },
];

export type SortLayout = { compact: boolean; art: number; basketIcon: number; mini: number };

/** Sizes for the sorting screen: the picture shrinks on short windows so the baskets and Back stay on screen. */
export function sortLayout(window: { width: number; height: number }): SortLayout {
  const compact = window.height < CHOICE_COMPACT_BELOW;
  const big = !compact && window.width >= WIDE_BREAKPOINT;
  return {
    compact,
    art: compact ? 120 : big ? 220 : Math.min(176, Math.floor(window.width * 0.45)),
    basketIcon: compact ? 48 : big ? 96 : 64,
    mini: big ? 40 : 28,
  };
}

type Rect = { x: number; y: number; width: number; height: number };
type Measurable = { measureInWindow(callback: (x: number, y: number, width: number, height: number) => void): void };

/** The basket under a finger at window point (x, y), if any. */
export function basketAt(rects: Partial<Record<Basket, Rect>>, x: number, y: number): Basket | undefined {
  return (['food', 'other'] as const).find((id) => {
    const rect = rects[id];
    return !!rect && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  });
}

/** Sorting game (#149): drag each picture (or tap a basket) into Food or Not food. No reading needed. */
export function SortGame({ seenWords, reviewIds, onFinishedChange }: { seenWords: Word[]; reviewIds: readonly string[]; onFinishedChange?: (finished: boolean) => void }) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { recordAnswer, recordGamePlayed } = useProgressActions();
  const voice = useFamilyVoice();
  const window = useWindowDimensions();
  const { compact, art, basketIcon, mini } = sortLayout(window);
  const [rounds, setRounds] = useState<SortRound[]>(() => buildSortRounds(seenWords, Math.random, undefined, reviewIds));
  const [index, setIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [sorted, setSorted] = useState<Record<Basket, Word[]>>({ food: [], other: [] });
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const [pan] = useState(() => new Animated.ValueXY());
  const basketRects = useRef<Partial<Record<Basket, Rect>>>({});
  const basketViews = useRef<Partial<Record<Basket, Measurable | null>>>({});

  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const stopVoice = voice.stop;
  useEffect(() => () => { clearTimer(); stopVoice(); pan.stopAnimation(); }, [clearTimer, stopVoice, pan]);

  const round = rounds[index] as SortRound | undefined;
  const finished = rounds.length > 0 && !round;
  useEffect(() => { onFinishedChange?.(finished); }, [finished, onFinishedChange]);
  useEffect(() => { if (finished) playSfx('reward', soundEffects); }, [finished, soundEffects]);

  const springBack = useCallback(() => {
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start();
  }, [pan]);

  const drop = useCallback((basket: Basket) => {
    if (locked.current || !round) return;
    if (basket !== round.basket) {
      playSfx('try', soundEffects);
      haptic('warning', haptics);
      setMisses((m) => m + 1);
      springBack();
      return;
    }
    locked.current = true;
    // The family voice says the word when a grown-up recorded it; otherwise the usual chime.
    if (!voice.play(round.word.id)) playSfx('correct', soundEffects);
    haptic('success', haptics);
    recordAnswer(round.word.id, misses === 0);
    if (misses === 0) setScore((s) => s + 1);
    setSorted((all) => ({ ...all, [basket]: [...all[basket], round.word].slice(-BASKET_SHOWN) }));
    setSolved(true);
    pan.setValue({ x: 0, y: 0 });
    timer.current = setTimeout(() => {
      timer.current = null;
      locked.current = false;
      setIndex((i) => i + 1);
      setMisses(0);
      setSolved(false);
    }, NEXT_DELAY_MS);
  }, [round, soundEffects, haptics, springBack, voice, misses, pan, recordAnswer]);

  const measureBaskets = useCallback(() => {
    for (const id of ['food', 'other'] as const) {
      basketViews.current[id]?.measureInWindow((x, y, width, height) => { basketRects.current[id] = { x, y, width, height }; });
    }
  }, []);
  // Rects are kept fresh on layout and resize too, so a quick flick right after the pick-up still finds its basket.
  useEffect(() => { measureBaskets(); }, [measureBaskets, window.width, window.height]);

  // Latest drop and spring-back for the responder, which is created once.
  const dropRef = useRef(drop);
  const springRef = useRef(springBack);
  const measureRef = useRef(measureBaskets);
  useEffect(() => { dropRef.current = drop; springRef.current = springBack; measureRef.current = measureBaskets; }, [drop, springBack, measureBaskets]);

  // eslint-disable-next-line react-hooks/refs -- the handlers read refs only during a gesture, never while rendering.
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !locked.current,
    onMoveShouldSetPanResponder: () => !locked.current,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      // Baskets can move (scrolling, rotation): measure them on every pick-up, in the same window frame as the finger.
      measureRef.current();
      // Caught mid spring-back: carry on from where the picture is instead of jumping.
      pan.stopAnimation();
      pan.extractOffset();
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_event, gesture) => {
      pan.flattenOffset();
      const target = basketAt(basketRects.current, gesture.moveX, gesture.moveY);
      if (target) dropRef.current(target);
      else springRef.current();
    },
    onPanResponderTerminate: () => { pan.flattenOffset(); springRef.current(); },
  }), [pan]);

  if (rounds.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <Buddy mood="think" message={line('games_locked')} />
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    );
  }

  const playAgain = () => {
    clearTimer();
    recordGamePlayed();
    setRounds(buildSortRounds(seenWords, Math.random, undefined, reviewIds));
    setIndex(0);
    locked.current = false;
    setMisses(0);
    setSorted({ food: [], other: [] });
    setSolved(false);
    setScore(0);
    pan.setValue({ x: 0, y: 0 });
  };

  if (!round) {
    return (
      <ScrollView contentContainerStyle={styles.done}>
        <GameDoneActions result={line('game_score', { score, total: rounds.length })} onPlayAgain={playAgain} />
      </ScrollView>
    );
  }

  const message = solved ? line('game_correct') : misses > 0 ? line('game_try_again') : line('game_sort_prompt');

  return (
    <ScrollView contentContainerStyle={[styles.root, { gap: compact ? spacing.sm : spacing.md }]}>
      <Text style={styles.round} accessibilityLabel={`Round ${index + 1} of ${rounds.length}`}>{index + 1} / {rounds.length}</Text>
      <Buddy mood={misses > 0 && !solved ? 'think' : 'happy'} message={message} size={56} />

      {/* The stage keeps the card's height (art + padding + border) while the next picture is on its way. */}
      <View style={[styles.stage, { minHeight: art + spacing.sm * 2 + 6 }]}>
        {!solved && (
          <Animated.View
            key={`${index}:${round.word.id}`}
            {...responder.panHandlers}
            accessible
            accessibilityLabel={`${round.word.en}. Is it food? Tap a basket.`}
            style={[styles.card, { transform: pan.getTranslateTransform() }]}
          >
            <WordArt wordId={round.word.id} emoji={round.word.emoji} size={art} />
          </Animated.View>
        )}
      </View>

      <View style={styles.baskets}>
        {BASKETS.map((basket) => (
          <HintPulse key={basket.id} style={styles.basketSlot} active={!solved && basket.id === round.basket && misses >= HINT_AFTER_MISSES}>
            <Pressable
              ref={(view) => { basketViews.current[basket.id] = view; }}
              onLayout={measureBaskets}
              accessibilityRole="button"
              accessibilityLabel={basket.label}
              disabled={solved}
              onPress={() => drop(basket.id)}
              style={({ pressed }) => [styles.basket, { backgroundColor: basket.color, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            >
              <Icon name={basket.icon} size={basketIcon} />
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.basketLabel} accessible={false}>{basket.label}</Text>
              <View style={[styles.minis, { minHeight: mini }]} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                {sorted[basket.id].map((word) => <WordArt key={word.id} wordId={word.id} emoji={word.emoji} size={mini} />)}
              </View>
            </Pressable>
          </HintPulse>
        ))}
      </View>

      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} style={styles.back} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1 },
  round: { fontSize: font.heading, fontWeight: '700', color: colors.text, textAlign: 'center' },
  stage: { alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  card: { padding: spacing.sm, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface },
  baskets: { flexDirection: 'row', gap: spacing.sm, width: '100%', maxWidth: 600, alignSelf: 'center' },
  basketSlot: { flex: 1 },
  basket: { minHeight: TOUCH_MIN + 72, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, gap: spacing.xs },
  basketLabel: { fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'center' },
  minis: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2 },
  done: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  back: { marginTop: 'auto' },
});
