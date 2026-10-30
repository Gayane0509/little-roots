import { router, useLocalSearchParams } from 'expo-router';
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
  const { state, setPremium } = useProgress();
  if (guard) return guard;
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Buddy mood="cheer" message="More little discoveries together" size={76} />
    <Text style={styles.title}>{offerHeadline(reason)}</Text>
    <Text style={styles.sub}>Choose what fits your family. Learning stays on this device.</Text>
    <View style={styles.table}>
      <View style={styles.tableHead}><Text style={styles.feature}>Included</Text><Text style={styles.column}>Free</Text><Text style={styles.column}>Premium</Text></View>
      {comparison.map((row) => <View key={row.feature} style={styles.tableRow}><Text style={styles.feature}>{row.feature}</Text><Text style={styles.column}>{row.free}</Text><Text style={styles.column}>{row.premium}</Text></View>)}
    </View>
    {state.isPremium ? <Text style={styles.active}>Premium is active</Text> : __DEV__ ? <>
      <Text style={styles.trial}>7-day free trial · Test mode</Text>
      <View style={styles.plan}><Text style={styles.badge}>Best value</Text><BigButton label="Yearly $34.99" color={colors.success} onPress={() => { setPremium(true); router.replace('/parent'); }} /><Text style={styles.planNote}>≈ $2.92/month · Best value</Text></View>
      <View style={styles.plan}><BigButton label="Monthly $4.99" onPress={() => { setPremium(true); router.replace('/parent'); }} /></View>
      <BigButton label="Unlock for testing" color={colors.textMuted} onPress={() => { setPremium(true); router.replace('/parent'); }} />
    </> : <><Text style={styles.coming}>Subscriptions are coming soon.</Text><BigButton label="Coming soon" disabled onPress={() => {}} accessibilityHint="Purchases are not available yet" /></>}
    {__DEV__ && state.isPremium ? <BigButton label="Turn off test Premium" color={colors.textMuted} onPress={() => setPremium(false)} /> : null}
    <Pressable accessibilityRole="button" accessibilityLabel="Restore purchases" style={styles.link} onPress={() => Alert.alert('Coming soon', 'Restoring purchases is not available yet.')}><Text style={styles.linkText}>Restore purchases</Text></Pressable>
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
  coming: { color: colors.textMuted, fontSize: font.body, textAlign: 'center' }, active: { color: colors.success, fontSize: font.heading, fontWeight: '800', textAlign: 'center' }, link: { minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' }, linkText: { color: colors.primaryDark, fontSize: font.body, fontWeight: '700', textDecorationLine: 'underline' },
});
