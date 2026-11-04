import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SceneName } from '@/art/scenes';
import { SceneBackdrop } from './SceneBackdrop';
import { colors, CONTENT_MAX_WIDTH, spacing } from './tokens';

/** Full-bleed background (optionally a soft scene along the bottom); content stays a comfortable reading width on tablets and the web. */
export function Screen({ children, background = colors.background, scene }: { children: ReactNode; background?: string; scene?: SceneName }) {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: background }]}>
      {scene ? <SceneBackdrop scene={scene} /> : null}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md, alignItems: 'center' },
  content: { flex: 1, width: '100%', maxWidth: CONTENT_MAX_WIDTH },
});
