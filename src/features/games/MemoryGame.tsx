import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import type { Word } from '@/content/types';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { stopSpeaking } from '@/lib/speech';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { stopWordAudio, useSpeakWord } from '@/state/recordings';
import { useProgressActions } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

import { buildMemoryDeck, type MemoryCard } from './logic';
import { GameDoneActions } from './GameDoneActions';

const MISMATCH_DELAY_MS = 900;

function FlipCard({ card, open, matched, disabled, onPress, width, height }: {
  card: MemoryCard;
  width: number;
  height: number;
  open: boolean;
  matched: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
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
        <Text style={styles.backMark}>❓</Text>
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
          <WordArt wordId={card.word.id} emoji={card.word.emoji} size={Math.min(72, width - spacing.sm * 2 - 6, height - spacing.sm * 2 - 6)} />
        ) : (
          <Text style={styles.hy}>{card.word.hy}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function MemoryGame({ seenWords }: { seenWords: Word[] }) {
  const line = useBuddyLine();
  const { soundEffects } = useSettings();
  const speak = useSpeakWord();
  const { recordGamePlayed } = useProgressActions();
  const { width, height, fontScale } = useWindowDimensions();
  const [deck, setDeck] = useState(() => buildMemoryDeck(seenWords));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  // Synchronous turn state so rapid taps never see stale values.
  const turn = useRef<{ flipped: string[]; matched: string[]; busy: boolean }>({ flipped: [], matched: [], busy: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    stopWordAudio();
    stopSpeaking();
  }, []);

  const pairs = deck.length / 2;
  const won = pairs > 0 && matched.length === pairs;
  useEffect(() => { if (won) playSfx('reward', soundEffects); }, [won, soundEffects]);

  const gap = spacing.sm;
  const cardW = Math.max(TOUCH_MIN, Math.floor((width - spacing.md * 2 - gap * 2) / 3) - 1);
  // Height budget: title, moves, back button and padding take roughly 300px.
  const rows = Math.ceil(deck.length / 3) || 1;
  const cardH = Math.ceil(Math.max(TOUCH_MIN + 16, Math.min(Math.round(cardW * 1.1), Math.floor((height - 300) / rows) - gap)) * Math.max(1, fontScale));

  const flip = (card: MemoryCard) => {
    const t = turn.current;
    if (t.busy || t.flipped.length >= 2 || t.flipped.includes(card.key) || t.matched.includes(card.word.id)) return;
    playSfx('flip', soundEffects);
    speak(card.word);
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
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    stopWordAudio();
    stopSpeaking();
    recordGamePlayed();
    turn.current = { flipped: [], matched: [], busy: false };
    setDeck(buildMemoryDeck(seenWords));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  if (won) {
    return (
      <ScrollView contentContainerStyle={styles.win}>
        <Buddy mood="cheer" message={line('game_memory_done', { moves })} />
        <GameDoneActions onPlayAgain={playAgain} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.moves} accessibilityLabel={`${moves} moves`}>Moves: {moves}</Text>
      <View style={[styles.grid, { gap }]}>
        {deck.map((card) => (
          <FlipCard
            key={card.key}
            card={card}
            width={cardW}
            height={cardH}
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
  backMark: { fontSize: 36 },
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
  hy: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  win: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
});
