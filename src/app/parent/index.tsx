import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getWord, THEMES } from '@/content/themes';
import { canSeeFullReport } from '@/lib/entitlements';
import { WordArt } from '@/ui/WordArt';
import type { Word } from '@/content/types';
import { useParentGuard } from '@/features/parent/gate';
import { PracticeRow } from '@/features/parent/PracticeRow';
import { weeklyReport } from '@/lib/report';
import { currentStreak } from '@/lib/streak';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';
import { StorageErrorBanner } from '@/features/storage/StorageErrorBanner';

function toWords(ids: string[]): Word[] {
  return ids.map(getWord).filter((w): w is Word => w !== undefined);
}

export default function ParentArea() {
  const guard = useParentGuard('/parent');
  const { state, setChildName, reset } = useProgress();
  const [name, setName] = useState(state.childName);
  const [saved, setSaved] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => setNow(Date.now()), []));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') setNow(Date.now());
    });
    return () => sub.remove();
  }, []);
  const report = weeklyReport(state, now);

  const practice = toWords(report.practiceWordIds.length > 0 ? report.practiceWordIds : report.newWordIds);
  const teaserWords = practice.length >= 3 ? practice.slice(0, 3) : THEMES[0].words.slice(0, 3);

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

  if (guard) return guard;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Parents</Text>
        <StorageErrorBanner />

        <Text style={styles.heading}>This week</Text>
        <View style={styles.stats}>
          <Stat label="Days active" value={`${report.daysActive}/7`} />
          <Stat label="New words" value={String(report.newWordIds.length)} />
          <Stat label="Total words" value={String(report.totalWords)} />
          <Stat label="Streak" value={`🔥 ${currentStreak(state, now)}`} />
        </View>

        <Text style={styles.heading}>Practice at home</Text>
        {practice.length === 0 ? (
          <Text style={styles.muted}>Nothing yet. Finish a lesson to see words here.</Text>
        ) : (
          practice.map((w) => <PracticeRow key={w.id} word={w} />)
        )}

        <Text style={styles.heading}>Full progress</Text>
        {!canSeeFullReport(state.isPremium) ? <View style={styles.teaser}>
          <Text style={styles.body}>See every word your child learns, by theme and week.</Text>
          {teaserWords.map((word) => <View key={word.id} style={styles.teaserRow}><WordArt wordId={word.id} emoji={word.emoji} size={32} /><Text style={styles.body}>{word.hy} · {word.en}</Text></View>)}
          <Text style={styles.muted}>Sample preview · more words and mastery details with Premium…</Text>
        </View> : null}
        <BigButton label="📈 Full progress" onPress={() => router.push(canSeeFullReport(state.isPremium) ? '/parent/report' : { pathname: '/parent/paywall', params: { reason: 'report' } })} />

        <Text style={styles.heading}>{"Child's name"}</Text>
        <TextInput
          accessibilityLabel="Child's name"
          style={styles.input}
          value={name}
          onChangeText={(v) => {
            setName(v);
            setSaved(false);
          }}
          maxLength={20}
          autoCorrect={false}
        />
        <BigButton
          label={saved ? 'Saved ✓' : 'Save name'}
          color={saved ? colors.success : colors.primary}
          onPress={() => {
            setChildName(name.trim() || 'Friend');
            setSaved(true);
          }}
          disabled={saved || name.trim() === state.childName}
        />

        <Text style={styles.heading}>Subscription</Text>
        <Text style={styles.body}>{state.isPremium ? 'Premium is active.' : 'Free plan: Family and Food.'}</Text>
        <BigButton
          label={state.isPremium ? 'Manage Premium' : 'See Premium'}
          color={colors.success}
          onPress={() => router.push('/parent/paywall')}
        />

        <Text style={styles.heading}>Family voice</Text>
        <Text style={styles.body}>Record words in your own voice so your child hears family.</Text>
        <BigButton label="🎙️ Family voice" color={colors.success} onPress={() => router.push('/parent/voices')} />

        {Platform.OS !== 'web' ? (
          <>
            <Text style={styles.heading}>Daily reminder</Text>
            <Text style={styles.body}>A gentle reminder for you to do the daily lesson together.</Text>
            <BigButton label="⏰ Reminder" color={colors.primary} onPress={() => router.push('/parent/reminders')} />
          </>
        ) : null}

        <Text style={styles.heading}>Privacy</Text>
        <Text style={styles.body}>All progress is stored only on this device. No accounts, no ads, no tracking.</Text>
        <BigButton label="🔒 Privacy" color={colors.textMuted} onPress={() => router.push('/parent/privacy')} />

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
  teaser: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  teaserRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, opacity: 0.72 },
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
