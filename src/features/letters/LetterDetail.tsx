import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import type { Letter } from '@/content/alphabet';
import { THEMES } from '@/content/themes';
import { ALPHABET } from '@/content/alphabet';
import { canTraceLetter } from '@/lib/entitlements';
import { useProgressState } from '@/state/progress';
import { speakArmenian } from '@/lib/speech';
import { BigButton } from '@/ui/BigButton';
import { WordArt } from '@/ui/WordArt';
import { Buddy } from '@/ui/Buddy';
import { useTracedLetters } from '@/state/letters';
import { TraceCanvas } from './TraceCanvas';
import { isTraceGoodEnough } from './tracing';
import { colors, font, radius, spacing } from '@/ui/tokens';

interface LetterDetailProps {
  letter: Letter | null;
  onClose: () => void;
}

/** Bottom sheet with one letter: huge upper+lower case, name, sound and an example word. */
export function LetterDetail({ letter, onClose }: LetterDetailProps) {
  const [tracing, setTracing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'retry' | null>(null);
  const { traced, markTraced } = useTracedLetters();
  const { state } = useProgressState();
  const close = () => { setDrawing(false); setTracing(false); setFeedback(null); onClose(); };
  const exampleWord = letter && THEMES.flatMap((theme) => theme.words).find((word) => word.hy === letter.example.hy);
  return (
    <Modal visible={letter !== null} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.dismiss} onPress={close} />
        {letter ? (
          <View style={styles.sheet}>
            <ScrollView scrollEnabled={!drawing} contentContainerStyle={styles.content}>
              {tracing ? (
                <>
                  <Text style={styles.name}>Trace {letter.name}</Text>
                  <View style={styles.feedback}>
                    {feedback === 'success' ? <Buddy mood="cheer" message="⭐ Wonderful tracing!" size={48} /> : null}
                    {feedback === 'retry' ? <Text style={styles.sound}>Try once more! Clear and try again.</Text> : null}
                  </View>
                  <TraceCanvas key={letter.upper} upper={letter.upper} lower={letter.lower} onDrawingChange={setDrawing} onEdit={() => setFeedback(null)} onDone={(score) => {
                    if (isTraceGoodEnough(score)) { if (!traced.has(letter.upper)) { markTraced(letter.upper); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); } setFeedback('success'); }
                    else setFeedback('retry');
                  }} />
                  <BigButton label="Back to letter" color={colors.textMuted} onPress={() => { setTracing(false); setFeedback(null); }} />
                </>
              ) : <>
              <Text style={styles.letters} accessibilityLabel={`Letter ${letter.name}`}>
                {letter.upper} {letter.lower}
              </Text>
              <Text style={styles.name}>{letter.name}</Text>
              <Text style={styles.sound}>Sounds like: {letter.sound}</Text>

              <View style={styles.example} accessibilityLabel={`${letter.example.hy}, ${letter.example.translit}, ${letter.example.en}`}>
                {exampleWord ? <WordArt wordId={exampleWord.id} emoji={letter.example.emoji} size={70} /> : <Text style={styles.exampleEmoji}>{letter.example.emoji}</Text>}
                <View style={styles.exampleTexts}>
                  <Text style={styles.exampleHy}>{letter.example.hy}</Text>
                  <Text style={styles.exampleSub}>
                    {letter.example.translit} · {letter.example.en}
                  </Text>
                </View>
              </View>

              <BigButton
                label="🔊 Hear the letter"
                onPress={() => speakArmenian(letter.lower)}
                accessibilityHint={`Says the letter ${letter.name}`}
              />
              <BigButton
                label="🔊 Hear the word"
                color={colors.success}
                onPress={() => speakArmenian(letter.example.hy)}
                accessibilityHint={`Says ${letter.example.en} in Armenian`}
              />
              <BigButton label={canTraceLetter(state.isPremium, ALPHABET.findIndex((item) => item.upper === letter.upper)) ? '✏️ Trace it' : '🔒 Unlock tracing'} onPress={() => {
                if (canTraceLetter(state.isPremium, ALPHABET.findIndex((item) => item.upper === letter.upper))) { setTracing(true); setFeedback(null); }
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(43,45,66,0.45)' },
  dismiss: { flex: 1 },
  sheet: {
    maxHeight: '90%',
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  content: { padding: spacing.lg, gap: spacing.md },
  feedback: { minHeight: 56, justifyContent: 'center' },
  letters: { fontSize: 104, lineHeight: 124, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  name: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sound: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
  example: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  exampleEmoji: { fontSize: 56 },
  exampleTexts: { flexShrink: 1 },
  exampleHy: { fontSize: font.word, fontWeight: '800', color: colors.text },
  exampleSub: { fontSize: font.body, color: colors.textMuted },
});
