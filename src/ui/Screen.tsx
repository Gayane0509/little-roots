import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from './tokens';

export function Screen({ children, background = colors.background }: { children: ReactNode; background?: string }) {
  return <SafeAreaView style={[styles.screen, { backgroundColor: background }]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md },
});
