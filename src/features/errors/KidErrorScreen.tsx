import { router, type ErrorBoundaryProps } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { releaseSplash } from '@/lib/splash';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, spacing } from '@/ui/tokens';

interface KidErrorScreenProps {
  onRetry: () => void;
  onHome: () => void;
}

/** Context-free on purpose: must render even if an app provider is what threw. */
export function KidErrorScreen({ onRetry, onHome }: KidErrorScreenProps) {
  useEffect(releaseSplash, []);
  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.message} accessibilityRole="alert">
          Oops! Let&apos;s try that again.
        </Text>
        <BigButton label="Try again" onPress={onRetry} style={styles.button} />
        <BigButton label="Go home" color={colors.success} onPress={onHome} style={styles.button} />
      </View>
    </Screen>
  );
}

/** Root `ErrorBoundary` (re-exported by `src/app/_layout.tsx`). The error is logged in development only, never shown. */
export function KidErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  if (__DEV__) console.error(error);
  return <KidErrorScreen onRetry={() => void retry()} onHome={() => { router.replace('/'); void retry(); }} />;
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.md },
  message: { color: colors.text, fontSize: font.heading, fontWeight: '800', textAlign: 'center' },
  button: { alignSelf: 'stretch' },
});
