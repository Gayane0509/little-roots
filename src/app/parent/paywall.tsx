import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { getPurchases, type Plan } from '@/lib/purchases';
import { useProfiles } from '@/state/profiles';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { themeArtWordId } from '@/content/themeArt';
import { useParentGuard } from '@/features/parent/gate';
import { comparison, offerHeadline, PREMIUM_THEMES, PREMIUM_WORDS, premiumStripLayout } from '@/features/paywall/offer';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';
import { notify } from '@/lib/dialog';

export default function Paywall() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const guard = useParentGuard('/parent/paywall', reason);
  const { state } = useProgress();
  const { setPremium } = useProfiles();
  const strip = premiumStripLayout(useWindowDimensions().width);
  const [plans, setPlans] = useState<Plan[]>([]);
  const purchases = useMemo(() => getPurchases(setPremium), [setPremium]);
  useEffect(() => { let active = true; void purchases.getPlans().then((items) => { if (active) setPlans(items); }); return () => { active = false; }; }, [purchases]);
  const buy = async (id: Plan['id']) => {
    try {
      const result = await purchases.purchase(id);
      if (result === 'success') router.replace('/parent');
      else if (result === 'unavailable') notify('Coming soon', 'Subscriptions are not available yet.');
    } catch { notify('Purchase failed', 'Please try again.'); }
  };
  const restore = async () => {
    try {
      const restored = await purchases.restore();
      if (restored) notify('Restored', 'Premium is active.');
      else notify('No purchase found', __DEV__ ? 'There is no test purchase to restore.' : 'Restoring purchases is not available yet.');
    } catch { notify('Restore failed', 'Please try again.'); }
  };
  if (guard) return guard;
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Buddy mood="cheer" message="More little discoveries together" size={76} />
    <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} accessibilityRole="header" style={styles.title}>{offerHeadline(reason)}</Text>
    <Text style={styles.sub}>Choose what fits your family. Learning stays on this device.</Text>
    {/* What Premium adds, as pictures (#121): one drawing per locked theme. */}
    <View style={styles.premiumThemes} accessible accessibilityLabel={`Premium themes: ${PREMIUM_THEMES.map((theme) => theme.titleEn).join(', ')}`}>
      <View style={[styles.premiumArt, { maxWidth: strip.rowWidth }]} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {PREMIUM_THEMES.map((theme) => <View key={theme.id} style={[styles.premiumTile, { width: strip.tile, height: strip.tile, backgroundColor: theme.color }]}><WordArt wordId={themeArtWordId(theme.id)} emoji={theme.emoji} size={strip.art} /></View>)}
      </View>
      <Text style={styles.premiumCaption}>{PREMIUM_WORDS} more words in {PREMIUM_THEMES.length} themes</Text>
    </View>
    {/* Free and Premium as aligned columns (#180); each row still reads as one sentence to screen readers. */}
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.headRow]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><View style={styles.feature} /><Text style={[styles.column, styles.head]}>Free</Text><Text style={[styles.column, styles.head, styles.premium]}>Premium</Text></View>
      {comparison.map((row) => <View key={row.feature} style={[styles.tableRow, styles.bodyRow]} accessible accessibilityLabel={`${row.feature}. Free: ${row.free}. Premium: ${row.premium}`}><Text style={[styles.feature, styles.featureText]}>{row.feature}</Text><Text style={styles.column}>{row.free}</Text><Text style={[styles.column, styles.premium]}>{row.premium}</Text></View>)}
    </View>
    {state.isPremium ? <Text style={styles.active}>Premium is active</Text> : <>
      {__DEV__ ? <Text style={styles.trial}>7-day free trial · Test mode</Text> : null}
      {plans.map((plan) => <View key={plan.id} style={styles.plan}>
        {plan.id === 'yearly' ? <Text style={styles.badge}>Best value</Text> : null}
        {__DEV__ ? <BigButton label={`${plan.title} ${plan.priceLabel}`} color={plan.id === 'yearly' ? colors.success : colors.primary} onPress={() => void buy(plan.id)} /> : <Text style={styles.planLabel}>{plan.title} · {plan.priceLabel}</Text>}
        {plan.perMonthLabel ? <Text style={styles.planNote}>≈ {plan.perMonthLabel}</Text> : null}
      </View>)}
      {!__DEV__ ? <><Text style={styles.coming}>Subscriptions are coming soon.</Text><BigButton label="Coming soon" disabled onPress={() => {}} accessibilityHint="Purchases are not available yet" /></> : null}
    </>}
    <Pressable accessibilityRole="button" accessibilityLabel="Restore purchases" style={styles.link} onPress={() => void restore()}><Text style={styles.linkText}>Restore purchases</Text></Pressable>
    <Pressable accessibilityRole="link" accessibilityLabel="Privacy policy" style={styles.link} onPress={() => router.push('/parent/privacy')}><Text style={styles.linkText}>Privacy policy</Text></Pressable>
    <BigButton label="Back to parents" color={colors.textMuted} onPress={() => router.replace('/parent')} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingVertical: spacing.lg }, title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' }, sub: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
  premiumThemes: { alignItems: 'center', gap: spacing.sm },
  premiumArt: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  premiumTile: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  premiumCaption: { fontSize: font.body, fontWeight: '700', color: colors.text, textAlign: 'center' },
  table: { borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm }, headRow: { paddingBottom: spacing.xs }, bodyRow: { minHeight: 54, borderTopWidth: 1, borderColor: colors.border },
  feature: { flex: 1.3 }, featureText: { color: colors.text, fontSize: font.small, fontWeight: '700' },
  column: { flex: 1, color: colors.text, fontSize: font.small, textAlign: 'center' }, head: { fontWeight: '800' }, premium: { color: colors.primaryText, fontWeight: '700' },
  trial: { color: colors.successText, fontSize: font.heading, fontWeight: '800', textAlign: 'center' }, plan: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs }, badge: { color: colors.primaryText, fontSize: font.small, fontWeight: '800', textAlign: 'center' }, planNote: { color: colors.textMuted, textAlign: 'center' },
  planLabel: { color: colors.text, fontSize: font.heading, fontWeight: '800', textAlign: 'center' },
  coming: { color: colors.textMuted, fontSize: font.body, textAlign: 'center' }, active: { color: colors.successText, fontSize: font.heading, fontWeight: '800', textAlign: 'center' }, link: { minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' }, linkText: { color: colors.primaryText, fontSize: font.body, fontWeight: '700', textDecorationLine: 'underline' },
});
