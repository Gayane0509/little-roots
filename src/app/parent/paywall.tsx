import { goBackOrHome } from '@/lib/navigation';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useParentGuard } from '@/features/parent/gate';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const BENEFITS = [
  '10 more themes: animals, colors, numbers, body, clothes, home, toys, nature, transport and feelings',
  'Songs and rhymes for every theme',
  'Weekly parent reports',
  'Family voice: hear words in your own voice',
];

export default function Paywall() {
  const guard = useParentGuard('/parent/paywall');
  const { state, setPremium } = useProgress();

  const buy = () => {
    if (__DEV__) {
      setPremium(true);
      goBackOrHome();
    } else {
      Alert.alert('Coming soon', 'Purchases are not available yet.');
    }
  };

  const restore = () => Alert.alert('Coming soon', 'Restoring purchases is not available yet.');

  if (guard) return guard;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>Lezu Premium</Text>

        <View style={styles.card}>
          {BENEFITS.map((b) => (
            <Text key={b} style={styles.benefit}>
              ✅ {b}
            </Text>
          ))}
        </View>

        {state.isPremium ? (
          <>
            <Text style={styles.active}>Premium is active</Text>
            {__DEV__ ? (
              <BigButton label="Turn off (test)" color={colors.danger} onPress={() => setPremium(false)} />
            ) : null}
          </>
        ) : (
          <>
            {__DEV__ ? (
              <>
                <View style={styles.plan}>
                  <Text style={styles.badge}>Best value</Text>
                  <BigButton label="Yearly $34.99" color={colors.success} onPress={buy} />
                </View>
                <BigButton label="Monthly $4.99" onPress={buy} />
                <Text style={styles.note}>Prices shown in USD; final price in your store.</Text>
              </>
            ) : (
              <>
                <BigButton label="Coming soon" disabled onPress={buy} accessibilityHint="Subscriptions are not available yet" />
                <Text style={styles.note}>Subscriptions are not available yet.</Text>
              </>
            )}
            {__DEV__ ? <BigButton label="Unlock (test)" color={colors.textMuted} onPress={buy} /> : null}
          </>
        )}

        <Pressable accessibilityRole="button" accessibilityLabel="Restore purchases" onPress={restore} style={styles.link}>
          <Text style={styles.linkText}>Restore purchases</Text>
        </Pressable>

        <BigButton label="Close" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingVertical: spacing.lg },
  emoji: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  benefit: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  plan: { gap: spacing.xs },
  badge: { fontSize: font.small, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  note: { fontSize: font.small, color: colors.textMuted, textAlign: 'center' },
  link: { minHeight: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontSize: font.body, fontWeight: '700', color: colors.primaryDark, textDecorationLine: 'underline' },
  active: { fontSize: font.heading, fontWeight: '800', color: colors.success, textAlign: 'center' },
});
