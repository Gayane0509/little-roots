import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { isSplashReleased, releaseSplash } from '@/lib/splash';
import { useProgress } from '@/state/progress';
import { useSettings } from '@/state/settings';
import { colors } from '@/ui/tokens';

/**
 * Holds the screens back until settings and progress have loaded on the first launch, then hides the splash.
 * Only the first load waits: after a profile switch (which remounts this under a new progress provider) the
 * screens render straight away and Home shows its own spinner instead of a blank page.
 */
export function StartupGate({ children }: { children: ReactNode }) {
  const settingsReady = useSettings().ready;
  const progressReady = useProgress().ready;
  const [startedAfterSplash] = useState(isSplashReleased);
  const loaded = settingsReady && progressReady;

  useEffect(() => { if (loaded) releaseSplash(); }, [loaded]);

  if (!startedAfterSplash && !loaded) return <View style={styles.blank} testID="startup-blank" />;
  return children;
}

const styles = StyleSheet.create({ blank: { flex: 1, backgroundColor: colors.background } });
