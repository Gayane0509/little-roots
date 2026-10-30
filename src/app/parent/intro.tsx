import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useParentGuard } from '@/features/parent/gate';
import { INTRO_STEPS } from '@/features/parent/introSteps';
import { useSettings } from '@/state/settings';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function ParentIntroScreen() {
  const guard = useParentGuard('/parent/intro');
  const { setParentIntroSeen } = useSettings();
  const [stepIndex, setStepIndex] = useState(0);
  // Replayed from parent home (pushed on top of it) vs. first run (replaced /parent via <Redirect>).
  const replay = useLocalSearchParams<{ replay?: string }>().replay === '1';

  if (guard) return guard;

  const step = INTRO_STEPS[stepIndex];
  const isLast = stepIndex === INTRO_STEPS.length - 1;
  const finish = () => {
    setParentIntroSeen(true);
    if (replay && router.canGoBack()) router.back();
    else router.replace('/parent');
  };
  const seePremium = () => {
    finish();
    router.push('/parent/paywall');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.counter}>{stepIndex + 1} of {INTRO_STEPS.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Skip introduction" onPress={finish} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.dots} accessibilityLabel={`Step ${stepIndex + 1} of ${INTRO_STEPS.length}`}>
          {INTRO_STEPS.map((item, index) => (
            <View key={item.id} style={[styles.dot, index === stepIndex && styles.activeDot]} />
          ))}
        </View>

        <View style={styles.card}>
          {step.emoji ? <Text style={styles.emoji} accessibilityLabel={step.title}>{step.emoji}</Text> : null}
          <Text style={styles.title} accessibilityRole="header">{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
          {step.id === 'daily-reminder' && Platform.OS === 'web' ? (
            <Text style={styles.note}>Daily reminders are available in the phone app.</Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <BigButton label="Back" color={colors.textMuted} disabled={stepIndex === 0} onPress={() => setStepIndex((index) => index - 1)} style={styles.action} />
          <BigButton label={isLast ? 'Start' : 'Next'} onPress={isLast ? finish : () => setStepIndex((index) => index + 1)} style={styles.action} />
        </View>
        {isLast ? <BigButton label="See Premium" color={colors.success} onPress={seePremium} /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { color: colors.textMuted, fontSize: font.body, fontWeight: '700' },
  skip: { minHeight: TOUCH_MIN, minWidth: TOUCH_MIN, justifyContent: 'center', alignItems: 'center' },
  skipText: { color: colors.primaryDark, fontSize: font.body, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  dot: { width: spacing.sm, height: spacing.sm, borderRadius: radius.round, backgroundColor: colors.border },
  activeDot: { backgroundColor: colors.primary, width: spacing.lg },
  card: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface },
  emoji: { fontSize: font.word, textAlign: 'center' },
  title: { color: colors.text, fontSize: font.title, fontWeight: '800' },
  body: { color: colors.text, fontSize: font.body, lineHeight: 27 },
  note: { color: colors.textMuted, fontSize: font.body, lineHeight: 27 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1 },
});
