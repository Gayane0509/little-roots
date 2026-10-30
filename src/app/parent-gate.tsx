import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  cooldownRemainingMs,
  isGateAnswerCorrect,
  markGatePassed,
  newGateQuestion,
  parseGateRoute,
  recordWrongAttempt,
  resetGateAttempts,
} from '@/features/parent/gate';
import { parseOfferReason } from '@/features/paywall/offer';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function ParentGate() {
  const { next, reason } = useLocalSearchParams<{ next?: string; reason?: string }>();
  const [q, setQ] = useState(() => newGateQuestion());
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const [cooldown, setCooldown] = useState(() => cooldownRemainingMs());

  const locked = cooldown > 0;

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      const left = cooldownRemainingMs();
      setCooldown(left);
      if (left <= 0) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [locked]);

  const submit = () => {
    if (locked) return;
    if (isGateAnswerCorrect(q, answer)) {
      resetGateAttempts();
      markGatePassed();
      const route = parseGateRoute(next);
      const validReason = parseOfferReason(reason);
      if (route === '/parent/paywall' && validReason) router.replace({ pathname: route, params: { reason: validReason } });
      else router.replace(route);
    } else {
      recordWrongAttempt();
      setCooldown(cooldownRemainingMs());
      setWrong(true);
      setAnswer('');
      setQ(newGateQuestion());
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden><Text style={styles.emoji}>🔐</Text></View>
        <Text accessibilityRole="header" style={styles.title}>Grown-ups only</Text>
        <Text style={styles.hint}>Solve this to continue.</Text>
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
          returnKeyType="done"
          onSubmitEditing={submit}
          maxLength={3}
          placeholder="Answer"
          placeholderTextColor={colors.textMuted}
        />
        {locked ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            Too many tries. Please wait {Math.ceil(cooldown / 1000)} seconds.
          </Text>
        ) : wrong ? (
          <Text style={styles.error} accessibilityRole="alert">Not quite. Try this one.</Text>
        ) : null}
        <BigButton label="Continue" onPress={submit} disabled={locked || answer.length === 0} />
        <BigButton label="Cancel" color={colors.textMuted} onPress={() => router.replace('/')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, alignItems: 'stretch' },
  emoji: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  hint: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
  question: { fontSize: 48, fontWeight: '800', color: colors.primaryText, textAlign: 'center' },
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
  error: { fontSize: font.body, color: colors.dangerText, textAlign: 'center', fontWeight: '700' },
});
