import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { getPurchases, type Plan } from '@/lib/purchases';
import { useProfiles } from '@/state/profiles';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useParentGuard } from '@/features/parent/gate';
import { comparison, offerHeadline } from '@/features/paywall/offer';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function Paywall() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const guard = useParentGuard('/parent/paywall', reason);
  const { state } = useProgress();
  const { setPremium } = useProfiles();
  const [plans, setPlans] = useState<Plan[]>([]);
  const purchases = useMemo(() => getPurchases(setPremium), [setPremium]);
  useEffect(() => { let active = true; void purchases.getPlans().then((items) => { if (active) setPlans(items); }); return () => { active = false; }; }, [purchases]);
  const buy = async (id: Plan['id']) => {
    try {
      const result = await purchases.purchase(id);
      if (result === 'success') router.replace('/parent');
      else if (result === 'unavailable') Alert.alert('Coming soon', 'Subscriptions are not available yet.');
    } catch { Alert.alert('Purchase failed', 'Please try again.'); }
  };
  const restore = async () => {
    try {
      const restored = await purchases.restore();
      if (restored) Alert.alert('Restored', 'Premium is active.');
      else Alert.alert('No purchase found', __DEV__ ? 'There is no test purchase to restore.' : 'Restoring purchases is not available yet.');
    } catch { Alert.alert('Restore failed', 'Please try again.'); }
  };
  if (guard) return guard;
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Buddy mood="cheer" message="More little discoveries together" size={76} />
    <Text style={styles.title}>{offerHeadline(reason)}</Text>
    <Text style={styles.sub}>Choose what fits your family. Learning stays on this device.</Text>
    <View style={styles.table}>
      <View style={styles.tableHead}><Text style={styles.feature}>Included</Text><Text style={styles.column}>Free</Text><Text style={styles.column}>Premium</Text></View>
      {comparison.map((row) => <View key={row.feature} style={styles.tableRow}><Text style={styles.feature}>{row.feature}</Text><Text style={styles.column}>{row.free}</Text><Text style={styles.column}>{row.premium}</Text></View>)}
    </View>
    {state.isPremium ? <Text style={styles.active}>Premium is active</Text> : <>
      {__DEV__ ? <Text style={styles.trial}>7-day free trial · Test mode</Text> : null}
      {plans.map((plan) => <View key={plan.id} style={styles.plan}>
        {plan.id === 'yearly' ? <Text style={styles.badge}>Best value</Text> : null}
        {__DEV__ ? <BigButton label={`${plan.title} ${plan.priceLabel}`} color={plan.id === 'yearly' ? colors.success : colors.primary} onPress={() => void buy(plan.id)} /> : <Text style={styles.planLabel}>{plan.title} · {plan.priceLabel}</Text>}
        {plan.perMonthLabel ? <Text style={styles.planNote}>≈ {plan.perMonthLabel} · Best value</Text> : null}
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
  table: { borderRadius: radius.md, backgroundColor: colors.surface, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  tableHead: { flexDirection: 'row', backgroundColor: '#FFE8D3', padding: spacing.sm }, tableRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, padding: spacing.sm, borderTopWidth: 1, borderColor: colors.border },
  feature: { flex: 1.4, color: colors.text, fontSize: font.small, fontWeight: '700' }, column: { flex: 1, color: colors.text, fontSize: font.small, textAlign: 'center' },
  trial: { color: colors.success, fontSize: font.heading, fontWeight: '800', textAlign: 'center' }, plan: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs }, badge: { color: colors.primaryDark, fontSize: font.small, fontWeight: '800', textAlign: 'center' }, planNote: { color: colors.textMuted, textAlign: 'center' },
  planLabel: { color: colors.text, fontSize: font.heading, fontWeight: '800', textAlign: 'center' },
  coming: { color: colors.textMuted, fontSize: font.body, textAlign: 'center' }, active: { color: colors.success, fontSize: font.heading, fontWeight: '800', textAlign: 'center' }, link: { minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' }, linkText: { color: colors.primaryDark, fontSize: font.body, fontWeight: '700', textDecorationLine: 'underline' },
});
