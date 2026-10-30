import { goBackOrHome } from '@/lib/navigation';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { markGatePassed } from '@/features/parent/gate';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

function newQuestion() {
  return { a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) };
}

export default function ParentGate() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [q, setQ] = useState(newQuestion);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (Number(answer.trim()) === q.a * q.b) {
      markGatePassed();
      const target: Href = next === '/parent/paywall' ? '/parent/paywall' : '/parent';
      router.replace(target);
    } else {
      setWrong(true);
      setAnswer('');
      setQ(newQuestion());
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Ask a grown-up</Text>
        <Text style={styles.question} accessibilityLabel={`${q.a} times ${q.b}`}>
          {q.a} × {q.b} = ?
        </Text>
        <TextInput
          accessibilityLabel="Answer"
          style={styles.input}
          value={answer}
          onChangeText={(v) => {
            setAnswer(v.replace(/[^0-9]/g, ''));
            setWrong(false);
          }}
          keyboardType="number-pad"
          maxLength={3}
          placeholder="Answer"
          placeholderTextColor={colors.textMuted}
        />
        {wrong ? <Text style={styles.error}>Not quite. Try this one.</Text> : null}
        <BigButton label="Continue" onPress={submit} disabled={answer.length === 0} />
        <BigButton label="Cancel" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, alignItems: 'stretch' },
  emoji: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  question: { fontSize: 48, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  input: {
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: font.title,
    textAlign: 'center',
    color: colors.text,
  },
  error: { fontSize: font.body, color: colors.danger, textAlign: 'center', fontWeight: '700' },
});
