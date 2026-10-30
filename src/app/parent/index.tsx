import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getWord } from '@/content/themes';
import type { Word } from '@/content/types';
import { isGatePassed } from '@/features/parent/gate';
import { PracticeRow } from '@/features/parent/PracticeRow';
import { weeklyReport } from '@/lib/report';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

function toWords(ids: string[]): Word[] {
  return ids.map(getWord).filter((w): w is Word => w !== undefined);
}

export default function ParentArea() {
  const { state, setChildName, reset } = useProgress();
  const [name, setName] = useState(state.childName);
  const [now] = useState(() => Date.now());
  const report = weeklyReport(state, now);

  const practice = toWords(report.practiceWordIds.length > 0 ? report.practiceWordIds : report.newWordIds);

  const confirmReset = () =>
    Alert.alert('Reset progress?', 'This deletes all words, stars and stickers on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          reset();
          router.replace('/');
        },
      },
    ]);

  if (!isGatePassed()) return <Redirect href={{ pathname: '/parent-gate', params: { next: '/parent' } }} />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Parents</Text>

        <Text style={styles.heading}>This week</Text>
        <View style={styles.stats}>
          <Stat label="Days active" value={`${report.daysActive}/7`} />
          <Stat label="New words" value={String(report.newWordIds.length)} />
          <Stat label="Total words" value={String(report.totalWords)} />
          <Stat label="Streak" value={`🔥 ${report.streakDays}`} />
        </View>

        <Text style={styles.heading}>Practice at home</Text>
        {practice.length === 0 ? (
          <Text style={styles.muted}>Nothing yet. Finish a lesson to see words here.</Text>
        ) : (
          practice.map((w) => <PracticeRow key={w.id} word={w} />)
        )}

        <Text style={styles.heading}>{"Child's name"}</Text>
        <TextInput
          accessibilityLabel="Child's name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          maxLength={20}
          autoCorrect={false}
        />
        <BigButton
          label="Save name"
          onPress={() => setChildName(name.trim() || 'Friend')}
          disabled={name.trim() === state.childName}
        />

        <Text style={styles.heading}>Subscription</Text>
        <Text style={styles.body}>{state.isPremium ? 'Premium is active.' : 'Free plan: Family and Food.'}</Text>
        <BigButton
          label={state.isPremium ? 'Manage Premium' : 'See Premium'}
          color={colors.success}
          onPress={() => router.push('/parent/paywall')}
        />

        <Text style={styles.heading}>Privacy</Text>
        <Text style={styles.body}>All progress is stored only on this device. No accounts, no ads, no tracking.</Text>

        <BigButton label="Reset progress" color={colors.danger} onPress={confirmReset} />
        <BigButton label="Back to home" color={colors.textMuted} onPress={() => router.replace('/')} />
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  heading: { fontSize: font.heading, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  body: { fontSize: font.body, color: colors.text },
  muted: { fontSize: font.body, color: colors.textMuted },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm },
  stat: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: { fontSize: font.title, fontWeight: '800', color: colors.primaryDark },
  statLabel: { fontSize: font.small, color: colors.textMuted },
  input: {
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: font.heading,
    color: colors.text,
  },
});
