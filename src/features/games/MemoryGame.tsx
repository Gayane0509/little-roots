import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { Word } from '@/content/types';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { haptic } from '@/lib/haptics';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { useProgressActions } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Confetti } from '@/ui/Confetti';
import { Icon } from '@/ui/Icon';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing } from '@/ui/tokens';
import { wordBox, wordFits, wordFontSize } from '@/ui/wordFit';

import { buildMemoryDeck, MEMORY_PAIRS, type MemoryCard } from './logic';
import { memoryLayout } from './memoryLayout';
import { GameDoneActions } from './GameDoneActions';

const MISMATCH_DELAY_MS = 900;

function FlipCard({ card, open, matched, disabled, onPress, width, height, artSize }: {
  card: MemoryCard;
  width: number;
  height: number;
  artSize: number;
  open: boolean;
  matched: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const { fontScale } = useWindowDimensions();
  const [flip] = useState(() => new Animated.Value(open ? 1 : 0));
  useEffect(() => {
    Animated.timing(flip, { toValue: open ? 1 : 0, duration: 260, useNativeDriver: true }).start();
  }, [open, flip]);

  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const label = matched
    ? `Matched card, ${card.word.hy}, ${card.word.en}`
    : open
      ? card.kind === 'emoji' ? `Picture of ${card.word.en}` : `Word card, ${card.word.hy}, ${card.word.translit}, ${card.word.en}`
      : 'Face-down card';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || open }}
      disabled={disabled || open}
      onPress={onPress}
      style={[styles.cardWrap, { width, minHeight: height }]}
    >
      <Animated.View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.face, styles.back, { transform: [{ perspective: 800 }, { rotateY: backRotate }] }]}>
        <Icon name="sprout" size={artSize} />
      </Animated.View>
      <Animated.View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.face,
          styles.front,
          matched && styles.matched,
          { transform: [{ perspective: 800 }, { rotateY: frontRotate }] },
        ]}
      >
        {card.kind === 'emoji' ? (
          <WordArt wordId={card.word.id} emoji={card.word.emoji} size={artSize} />
        ) : (
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.hy, { fontSize: wordFontSize(card.word.hy, wordBox.memoryCard(width), font.heading, fontScale) }]}>{card.word.hy}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function MemoryGame({ seenWords, onFinishedChange }: { seenWords: Word[]; onFinishedChange?: (finished: boolean) => void }) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const { recordGamePlayed } = useProgressActions();
  const dims = useWindowDimensions();
  // Card width for a full deck; a word too long for it even at the smallest size is left for wider screens.
  const wordCard = wordBox.memoryCard(memoryLayout(dims, MEMORY_PAIRS * 2).cardWidth);
  const fitsCard = (word: Word) => wordFits(word.hy, wordCard, font.heading, dims.fontScale);
  const [deck, setDeck] = useState(() => buildMemoryDeck(seenWords, Math.random, MEMORY_PAIRS, fitsCard));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  // Synchronous turn state so rapid taps never see stale values.
  const turn = useRef<{ flipped: string[]; matched: string[]; busy: boolean }>({ flipped: [], matched: [], busy: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const pairs = deck.length / 2;
  const won = pairs > 0 && matched.length === pairs;
  useEffect(() => { if (won) playSfx('reward', soundEffects); }, [won, soundEffects]);
  useEffect(() => { onFinishedChange?.(won); }, [won, onFinishedChange]);

  const { cardWidth, cardHeight, artSize, gap, prompt } = memoryLayout(dims, deck.length);

  const flip = (card: MemoryCard) => {
    const t = turn.current;
    if (t.busy || t.flipped.length >= 2 || t.flipped.includes(card.key) || t.matched.includes(card.word.id)) return;
    playSfx('flip', soundEffects);
    if (t.flipped.length === 0) {
      t.flipped = [card.key];
      setFlipped(t.flipped);
      return;
    }
    const first = deck.find((c) => c.key === t.flipped[0]);
    if (!first) return;
    t.flipped = [first.key, card.key];
    setFlipped(t.flipped);
    setMoves((m) => m + 1);
    if (first.word.id === card.word.id) {
      haptic('success', haptics);
      t.matched = [...t.matched, card.word.id];
      t.flipped = [];
      setMatched(t.matched);
      setFlipped([]);
    } else {
      t.busy = true;
      timer.current = setTimeout(() => {
        timer.current = null;
        t.flipped = [];
        t.busy = false;
        setFlipped([]);
      }, MISMATCH_DELAY_MS);
    }
  };

  const playAgain = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    recordGamePlayed();
    turn.current = { flipped: [], matched: [], busy: false };
    setDeck(buildMemoryDeck(seenWords, Math.random, MEMORY_PAIRS, fitsCard));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  if (won) {
    return (
      <ScrollView contentContainerStyle={styles.win}>
        <Confetti />
        <GameDoneActions result={line('game_memory_done', { moves })} onPlayAgain={playAgain} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.moves} accessibilityLabel={`${moves} moves`}>Moves: {moves}</Text>
      {/* Like Find and Read, Buddy says what to do (#122); left out on short windows so the cards keep their size. */}
      {prompt ? <Buddy message={line('game_memory_prompt')} size={48} /> : null}
      <View style={[styles.grid, { gap }]}>
        {deck.map((card) => (
          <FlipCard
            key={card.key}
            card={card}
            width={cardWidth}
            height={cardHeight}
            artSize={artSize}
            open={flipped.includes(card.key) || matched.includes(card.word.id)}
            matched={matched.includes(card.word.id)}
            disabled={false}
            onPress={() => flip(card)}
          />
        ))}
      </View>
      <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1, gap: spacing.md, paddingBottom: spacing.md },
  moves: { fontSize: font.heading, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cardWrap: { flexGrow: 0 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 3,
  },
  back: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  front: { backgroundColor: colors.surface, borderColor: colors.border },
  matched: {
    borderColor: colors.success,
    backgroundColor: '#E3F7EC',
    shadowColor: colors.success,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  // fontSize comes from `wordFontSize` (long words shrink instead of breaking, #105).
  hy: { fontWeight: '800', color: colors.text },
  win: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
});
