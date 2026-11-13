import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK, getWord } from '@/content/packs';
import { confirmAction, notify } from '@/lib/dialog';
import { canSeeFullReport } from '@/lib/entitlements';
import { WordArt } from '@/ui/WordArt';
import type { Word } from '@/content/types';
import { useParentGuard } from '@/features/parent/gate';
import { PracticeRow } from '@/features/parent/PracticeRow';
import { weeklyReport, weeklySummary } from '@/lib/report';
import { currentStreak } from '@/lib/streak';
import { useProgress } from '@/state/progress';
import { useTracedLetters } from '@/state/letters';
import { useProfiles } from '@/state/profiles';
import { useSettings } from '@/state/settings';
import type { IconName } from '@/art/icons';
import { BigButton } from '@/ui/BigButton';
import { Icon } from '@/ui/Icon';
import { Screen } from '@/ui/Screen';
import { wordBox, wordFontSize } from '@/ui/wordFit';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing } from '@/ui/tokens';
import { StorageErrorBanner } from '@/features/storage/StorageErrorBanner';
import { WeeklyShareCard } from '@/features/report/WeeklyShareCard';
import { talkTogetherCards } from '@/features/report/talkTogether';
import { printWordIds } from '@/features/report/printSheet';
import { printWeekWords } from '@/features/report/printWeek';

const LEARNED_SHOWN = 8;

function toWords(ids: string[]): Word[] {
  return ids.map(getWord).filter((w): w is Word => w !== undefined);
}

export default function ParentArea() {
  const guard = useParentGuard('/parent');
  const { fontScale } = useWindowDimensions();
  const { state, reset } = useProgress();
  const { resetTraced } = useTracedLetters();
  const { active } = useProfiles();
  const { ready: settingsReady, parentIntroSeen } = useSettings();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => setNow(Date.now()), []));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') setNow(Date.now());
    });
    return () => sub.remove();
  }, []);
  const report = weeklyReport(state, now);

  const childName = active?.name ?? 'Your child';
  const practice = toWords(report.practiceWordIds);
  const learned = toWords(report.newWordIds);
  const talkCards = talkTogetherCards(learned, practice, ACTIVE_PACK.phrases);
  const printWords = toWords(printWordIds(report));
  const [printing, setPrinting] = useState(false);
  const printSheet = () => {
    setPrinting(true);
    printWeekWords(childName === 'Your child' ? 'My child' : childName, printWords)
      .catch(() => notify('Printing is not available on this device'))
      .finally(() => setPrinting(false));
  };
  const teaserWords = practice.length >= 3 ? practice.slice(0, 3) : ACTIVE_PACK.themes[0].words.slice(0, 3);

  const confirmReset = () =>
    confirmAction({
      title: 'Reset progress?',
      message: `This resets ${active?.name ?? 'your child'}'s words, stars, stickers and traced letters on this device. Family voice recordings and other children are kept.`,
      confirmText: 'Reset',
      destructive: true,
      onConfirm: () => {
        reset();
        resetTraced();
        router.replace('/');
      },
    });

  if (guard) return guard;
  if (!settingsReady) return null;
  if (!parentIntroSeen) return <Redirect href="/parent/intro" />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} accessibilityRole="header" style={styles.title}>Parents</Text>
        <StorageErrorBanner />

        <Text accessibilityRole="header" style={styles.heading}>This week</Text>
        <Text style={styles.body}>{weeklySummary(childName, report)}</Text>
        <View style={styles.stats}>
          <Stat label="Days active" value={`${report.daysActive}/7`} />
          <Stat label="New words" value={String(report.newWordIds.length)} />
          <Stat label="Total words" value={String(report.totalWords)} />
          <Stat label="Streak" value={String(currentStreak(state, now))} icon="flame" />
        </View>

        <WeeklyShareCard childName={active?.name ?? 'My child'} report={report} />

        <Text accessibilityRole="header" style={styles.heading}>New this week</Text>
        {learned.length === 0 ? (
          <Text style={styles.muted}>No new words this week yet.</Text>
        ) : (
          <View style={styles.learned}>
            {learned.slice(0, LEARNED_SHOWN).map((w) => (
              <View key={w.id} style={styles.learnedItem} accessible accessibilityLabel={`${w.hy}, ${w.translit}, ${w.en}`}>
                <WordArt wordId={w.id} emoji={w.emoji} size={48} />
                <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.learnedHy, { fontSize: wordFontSize(w.hy, wordBox.parentLearned(), font.small, fontScale) }]} numberOfLines={1}>{w.hy}</Text>
                <Text style={styles.learnedEn} numberOfLines={1}>{w.en}</Text>
              </View>
            ))}
          </View>
        )}
        {learned.length > LEARNED_SHOWN ? <Text style={styles.muted}>and {learned.length - LEARNED_SHOWN} more</Text> : null}

        <Text accessibilityRole="header" style={styles.heading}>Practice together</Text>
        {practice.length === 0 ? (
          <Text style={styles.muted}>Nothing yet. Finish a lesson to see words here.</Text>
        ) : (
          <>
            <Text style={styles.body}>Point at the picture and say the word, then let {childName === 'Your child' ? 'your child' : childName} say it back.</Text>
            {practice.map((w) => <PracticeRow key={w.id} word={w} />)}
          </>
        )}
        {printWords.length > 0 ? (
          <BigButton
            label="Print this week's words"
            color={colors.primary}
            disabled={printing}
            accessibilityHint="Opens the print sheet with picture cards you can print or save as a PDF"
            onPress={printSheet}
          />
        ) : null}

        {talkCards.length > 0 ? (
          <>
            <Text accessibilityRole="header" style={styles.heading}>Talk together</Text>
            <Text style={styles.body}>Ask these in {ACTIVE_PACK.name.en} while you play or eat together. Any answer is a good answer.</Text>
            {talkCards.map(({ word, question }) => (
              <View key={word.id} style={styles.talkCard} accessible accessibilityLabel={`${question.hy}, ${question.translit}, ${question.en}`}>
                <WordArt wordId={word.id} emoji={word.emoji} size={45} />
                <View style={styles.talkTexts}>
                  <Text style={styles.talkHy}>{question.hy}</Text>
                  <Text style={styles.muted}>{question.translit} · {question.en}</Text>
                </View>
              </View>
            ))}
          </>
        ) : null}
        <Text accessibilityRole="header" style={styles.heading}>Full progress</Text>
        {!canSeeFullReport(state.isPremium) ? <View style={styles.teaser}>
          <Text style={styles.body}>See every word your child learns, by theme and week.</Text>
          {teaserWords.map((word) => <View key={word.id} style={styles.teaserRow}><WordArt wordId={word.id} emoji={word.emoji} size={32} /><Text style={styles.body}>{word.hy} · {word.en}</Text></View>)}
          <Text style={styles.muted}>Sample preview · more words and mastery details with Premium…</Text>
        </View> : null}
        <BigButton label="Full progress" icon="chart" onPress={() => router.push(canSeeFullReport(state.isPremium) ? '/parent/report' : { pathname: '/parent/paywall', params: { reason: 'report' } })} />

        <Text accessibilityRole="header" style={styles.heading}>Family voice</Text>
        <Text style={styles.body}>Record the words in your own voice so {active?.name ?? 'your child'} hears them in the app. Recordings stay on this device.</Text>
        <BigButton label="Record words" icon="voice" color={colors.primary} onPress={() => router.push('/parent/voice')} />

        <Text accessibilityRole="header" style={styles.heading}>Children</Text>
        <BigButton label="Manage children" onPress={() => router.push('/parent/children')} />
        <Text accessibilityRole="header" style={styles.heading}>Subscription</Text>
        <Text style={styles.body}>{state.isPremium ? 'Premium is active.' : 'Free plan: Family and Food.'}</Text>
        <BigButton
          label={state.isPremium ? 'Manage Premium' : 'See Premium'}
          color={colors.success}
          onPress={() => router.push('/parent/paywall')}
        />

        {Platform.OS !== 'web' ? (
          <>
            <Text accessibilityRole="header" style={styles.heading}>Daily reminder</Text>
            <Text style={styles.body}>A gentle reminder for you to do the daily lesson together.</Text>
            <BigButton label="Reminder" icon="clock" color={colors.primary} onPress={() => router.push('/parent/reminders')} />
          </>
        ) : null}

        <Text accessibilityRole="header" style={styles.heading}>Getting started</Text>
        <BigButton label="How Little Roots works" icon="bulb" color={colors.primary} onPress={() => router.push({ pathname: '/parent/intro', params: { replay: '1' } })} />

        <Text accessibilityRole="header" style={styles.heading}>Settings</Text>
        <BigButton label="Sound & Buddy language" icon="gear" color={colors.primary} onPress={() => router.push('/parent/settings')} />

        <Text accessibilityRole="header" style={styles.heading}>Privacy</Text>
        <Text style={styles.body}>All progress is stored only on this device. No accounts, no ads, no tracking.</Text>
        <BigButton label="Privacy" icon="lock" color={colors.textMuted} onPress={() => router.push('/parent/privacy')} />

        <BigButton label="Reset progress" color={colors.danger} onPress={confirmReset} />
        <BigButton label="Back to home" color={colors.textMuted} onPress={() => router.replace('/')} />
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: IconName }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      {/* Drawn icon instead of an emoji (AI_DECISIONS "No emoji pictures", #99). */}
      <View style={styles.statValueRow}>
        {icon ? <Icon name={icon} size={28} /> : null}
        <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={styles.statValue}>{value}</Text>
      </View>
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
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: font.title, fontWeight: '800', color: colors.primaryText },
  statLabel: { fontSize: font.small, color: colors.textMuted },
  learned: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  talkCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md },
  talkTexts: { flexShrink: 1 },
  talkHy: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  learnedItem: { width: 96, alignItems: 'center', gap: spacing.xs, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md },
  // fontSize comes from `wordFontSize` (long words shrink instead of being cut off, #105).
  learnedHy: { fontWeight: '700', color: colors.text },
  learnedEn: { fontSize: font.small, color: colors.textMuted },
  teaser: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  teaserRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, opacity: 0.72 },
});
