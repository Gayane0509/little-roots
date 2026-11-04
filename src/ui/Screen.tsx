import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, CONTENT_MAX_WIDTH, spacing } from './tokens';

/** Full-bleed background; content stays a comfortable reading width on tablets and the web. */
export function Screen({ children, background = colors.background }: { children: ReactNode; background?: string }) {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: background }]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md, alignItems: 'center' },
  content: { flex: 1, width: '100%', maxWidth: CONTENT_MAX_WIDTH },
});
