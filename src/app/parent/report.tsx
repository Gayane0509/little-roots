import { router } from 'expo-router';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import { THEMES } from '@/content/themes';
import { useParentGuard } from '@/features/parent/gate';
import { fullReport } from '@/features/report/reportData';
import { canSeeFullReport } from '@/lib/entitlements';
import { useProgressState } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { WordArt } from '@/ui/WordArt';
import { colors, font, radius, spacing } from '@/ui/tokens';

export default function FullReportScreen() {
  const guard = useParentGuard('/parent/report');
  const { state } = useProgressState();
  const [now] = useState(() => Date.now());
  const report = useMemo(() => fullReport(state, now), [state, now]);
  if (guard) return guard;
  if (!canSeeFullReport(state.isPremium)) {
    return <Screen><View style={styles.center}><Text style={styles.title}>Full progress</Text><Text style={styles.sub}>See every word your child learns with Premium.</Text><BigButton label="Explore Premium" onPress={() => router.replace({ pathname: '/parent/paywall', params: { reason: 'report' } })} /></View></Screen>;
  }
  return <Screen><SectionList sections={report.themes.map((item) => ({ ...item, data: item.words.length ? item.words : [{ word: null, stars: 0 }] }))} keyExtractor={(item, index) => item.word?.id ?? `empty-${index}`} contentContainerStyle={styles.content} stickySectionHeadersEnabled={false}
    ListHeaderComponent={<>
    <Text style={styles.title}>Full progress</Text>
    <Text style={styles.sub}>{report.seenTotal} of {THEMES.reduce((sum, theme) => sum + theme.words.length, 0)} words explored</Text>
    <Text style={styles.heading}>Words learned over 8 weeks</Text>
    <View style={styles.chart}>{report.weeks.map((week) => <View key={week.label} style={styles.week} accessibilityLabel={`${week.label}: ${week.count} words`}>
      <Text style={styles.number}>{week.count}</Text><View style={[styles.bar, { height: Math.max(8, Math.min(100, week.count * 12)) }]} /><Text style={styles.weekLabel}>{week.label}</Text>
    </View>)}</View>
    </>}
    renderSectionHeader={({ section }) => <View style={styles.section}><Text style={styles.heading}>{section.theme.titleEn} · {section.seen}/{section.total}</Text><View style={styles.track}><View style={[styles.fill, { width: `${section.mastery * 100}%` }]} /></View></View>}
    renderItem={({ item }) => item.word ? <View style={styles.row} accessibilityLabel={`${item.word.hy}, ${item.word.translit}, ${item.word.en}, ${item.stars} mastery stars`}>
      <WordArt wordId={item.word.id} emoji={item.word.emoji} size={48} /><View style={styles.wordText}><Text style={styles.hy}>{item.word.hy}</Text><Text style={styles.sub}>{item.word.translit} · {item.word.en}</Text></View><Text style={styles.stars}>{'★'.repeat(item.stars)}</Text>
    </View> : <Text style={styles.sub}>No words explored yet.</Text>}
    ListFooterComponent={<BigButton label="Back to parents" color={colors.textMuted} onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/parent'); }} />}
  /></Screen>;
}
const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.xl }, center: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text }, heading: { fontSize: font.heading, fontWeight: '800', color: colors.text }, sub: { fontSize: font.small, color: colors.textMuted },
  chart: { minHeight: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xs, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md },
  week: { flex: 1, alignItems: 'center', gap: spacing.xs }, number: { color: colors.text, fontWeight: '700' }, bar: { width: '75%', backgroundColor: colors.primary, borderRadius: radius.sm }, weekLabel: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },
  section: { gap: spacing.sm }, track: { height: 12, backgroundColor: colors.border, borderRadius: radius.round, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.success },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.sm }, wordText: { flex: 1 }, hy: { color: colors.text, fontSize: font.body, fontWeight: '700' }, stars: { color: colors.star, fontSize: 18 },
});
