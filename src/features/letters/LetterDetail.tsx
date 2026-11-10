import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ACTIVE_PACK, type Letter } from '@/content/packs';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { canTraceLetter } from '@/lib/entitlements';
import { useProgressState } from '@/state/progress';
import { haptic } from '@/lib/haptics';
import { playSfx } from '@/lib/sfx';
import { useSettings } from '@/state/settings';
import { BigButton } from '@/ui/BigButton';
import { WordArt } from '@/ui/WordArt';
import { Buddy } from '@/ui/Buddy';
import { useTracedLetters } from '@/state/letters';
import { letterExampleArtId } from './exampleArt';
import { highlightLetter } from './exampleHighlight';
import { TraceCanvas } from './TraceCanvas';
import { isTraceGoodEnough } from './tracing';
import { LETTER_FONT } from '@/ui/letterFont';
import { colors, CONTENT_MAX_WIDTH, DISPLAY_MAX_FONT_SCALE, font, radius, spacing } from '@/ui/tokens';

interface LetterDetailProps {
  letter: Letter | null;
  onClose: () => void;
}

/** Bottom sheet with one letter: huge upper+lower case, name, sound and an example word. */
export function LetterDetail({ letter, onClose }: LetterDetailProps) {
  const line = useBuddyLine();
  const { soundEffects, haptics } = useSettings();
  const [tracing, setTracing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'retry' | null>(null);
  const { traced, markTraced } = useTracedLetters();
  const { state } = useProgressState();
  const close = () => { setDrawing(false); setTracing(false); setFeedback(null); onClose(); };
  const exampleArtId = letter && letterExampleArtId(letter, ACTIVE_PACK.themes);
  const exampleParts = letter && highlightLetter(letter.example.hy, letter);
  return (
    <Modal visible={letter !== null} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.dismiss} onPress={close} />
        {letter ? (
          <View style={styles.sheet}>
            <ScrollView scrollEnabled={!drawing} contentContainerStyle={styles.content}>
              {tracing ? (
                <>
                  <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.name} accessibilityRole="header">Trace {letter.name}</Text>
                  <View style={styles.feedback}>
                    {feedback === 'success' ? <Buddy mood="cheer" message={line('tracing_success')} size={48} /> : null}
                    {feedback === 'retry' ? <Text style={styles.sound}>{line('tracing_retry')}</Text> : null}
                  </View>
                  <TraceCanvas key={letter.upper} upper={letter.upper} lower={letter.lower} onDrawingChange={setDrawing} onEdit={() => setFeedback(null)} onDone={(score) => {
                    if (!canTraceLetter(state.isPremium, ACTIVE_PACK.alphabet.findIndex((item) => item.upper === letter.upper))) return;
                    if (isTraceGoodEnough(score)) { if (!traced.has(letter.upper)) { markTraced(letter.upper); haptic('success', haptics); } playSfx('star', soundEffects); setFeedback('success'); }
                    else setFeedback('retry');
                  }} />
                  <BigButton label="Back to letter" color={colors.textMuted} onPress={() => { setTracing(false); setFeedback(null); }} />
                </>
              ) : <>
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.letters} accessibilityLabel={`Letter ${letter.name}`}>
                {letter.upper} {letter.lower}
              </Text>
              <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.name} accessibilityRole="header">{letter.name}</Text>
              <Text style={styles.sound}>Sounds like: {letter.sound}</Text>

              <View style={styles.example} accessibilityLabel={`${letter.example.hy}, ${letter.example.translit}, ${letter.example.en}`}>
                <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{exampleArtId ? <WordArt wordId={exampleArtId} emoji={letter.example.emoji} size={EXAMPLE_ART} /> : null}</View>
                <View style={styles.exampleTexts}>
                  {/* The sheet's letter is coloured inside the word, so the child sees where it is (#110). */}
                  <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.exampleHy}>
                    {exampleParts ? <>{exampleParts.before}<Text style={styles.exampleLetter}>{exampleParts.letter}</Text>{exampleParts.after}</> : letter.example.hy}
                  </Text>
                  <Text style={styles.exampleSub}>
                    {letter.example.translit} · {letter.example.en}
                  </Text>
                </View>
              </View>

              <BigButton {...(canTraceLetter(state.isPremium, ACTIVE_PACK.alphabet.findIndex((item) => item.upper === letter.upper)) ? { label: 'Trace it' } : { label: 'Unlock tracing', icon: 'lock' as const })} onPress={() => {
                if (canTraceLetter(state.isPremium, ACTIVE_PACK.alphabet.findIndex((item) => item.upper === letter.upper))) { setTracing(true); setFeedback(null); }
                else { close(); router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'letters' } }); }
              }} accessibilityHint={`Practice writing ${letter.name}`} />
              <BigButton label="Close" color={colors.textMuted} onPress={close} />
              </>}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

/** Example picture: big enough to read as a picture beside the 44 px word (it was 70, the drawing looked ~44 px). */
const EXAMPLE_ART = 96;

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(43,45,66,0.45)' },
  dismiss: { flex: 1 },
  // On tablets the sheet keeps the app's content width, centred, instead of stretching buttons across the screen (#95).
  sheet: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    maxHeight: '90%',
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  content: { padding: spacing.lg, gap: spacing.md },
  feedback: { minHeight: 56, justifyContent: 'center' },
  letters: { fontSize: 104, fontFamily: LETTER_FONT, color: colors.primaryText, textAlign: 'center' },
  name: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sound: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
  example: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  exampleTexts: { flexShrink: 1 },
  exampleHy: { fontSize: font.word, fontWeight: '800', color: colors.text },
  exampleLetter: { color: colors.primaryText },
  exampleSub: { fontSize: font.body, color: colors.textMuted },
});
