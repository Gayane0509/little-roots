import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Letter } from '@/content/alphabet';
import { speakArmenian } from '@/lib/speech';
import { BigButton } from '@/ui/BigButton';
import { colors, font, radius, spacing } from '@/ui/tokens';

interface LetterDetailProps {
  letter: Letter | null;
  onClose: () => void;
}

/** Bottom sheet with one letter: huge upper+lower case, name, sound and an example word. */
export function LetterDetail({ letter, onClose }: LetterDetailProps) {
  return (
    <Modal visible={letter !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.dismiss} onPress={onClose} />
        {letter ? (
          <View style={styles.sheet}>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.letters} accessibilityLabel={`Letter ${letter.name}`}>
                {letter.upper} {letter.lower}
              </Text>
              <Text style={styles.name}>{letter.name}</Text>
              <Text style={styles.sound}>Sounds like: {letter.sound}</Text>

              <View style={styles.example} accessibilityLabel={`${letter.example.hy}, ${letter.example.translit}, ${letter.example.en}`}>
                <Text style={styles.exampleEmoji}>{letter.example.emoji}</Text>
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
              <BigButton label="Close" color={colors.textMuted} onPress={onClose} />
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
