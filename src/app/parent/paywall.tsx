import { goBackOrHome } from '@/lib/navigation';
import { Redirect } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { isGatePassed } from '@/features/parent/gate';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing } from '@/ui/tokens';

const BENEFITS = ['All themes unlocked', 'New content every week', 'Songs & stories', 'Parent reports'];

export default function Paywall() {
  const { state, setPremium } = useProgress();

  const buy = () => {
    if (__DEV__) {
      setPremium(true);
      goBackOrHome();
    } else {
      Alert.alert('Coming soon', 'Purchases are not available yet.');
    }
  };

  if (!isGatePassed()) {
    return <Redirect href={{ pathname: '/parent-gate', params: { next: '/parent/paywall' } }} />;
  }

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
            <View style={styles.plan}>
              <Text style={styles.badge}>Best value</Text>
              <BigButton label="Yearly $34.99" color={colors.success} onPress={buy} />
            </View>
            <BigButton label="Monthly $4.99" onPress={buy} />
            {__DEV__ ? <BigButton label="Unlock (test)" color={colors.textMuted} onPress={buy} /> : null}
          </>
        )}

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
  active: { fontSize: font.heading, fontWeight: '800', color: colors.success, textAlign: 'center' },
});
