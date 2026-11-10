import { useFonts } from 'expo-font';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { isSplashReleased, releaseSplash, SPLASH_MAX_MS } from '@/lib/splash';
import { useProgress } from '@/state/progress';
import { useSettings } from '@/state/settings';
import { LETTER_FONTS } from '@/ui/letterFont';
import { colors } from '@/ui/tokens';

/**
 * Holds the screens back until settings and progress have loaded on the first launch, then hides the splash.
 * Only the first load waits: after a profile switch (which remounts this under a new progress provider) the
 * screens render straight away and Home shows its own spinner instead of a blank page.
 * The letter font (#127) is waited for too, so letters never swap shape; a font that fails to load, or takes longer
 * than the splash cap, doesn't block (it then swaps in when ready).
 */
export function StartupGate({ children }: { children: ReactNode }) {
  const settingsReady = useSettings().ready;
  const progressReady = useProgress().ready;
  const [startedAfterSplash] = useState(isSplashReleased);
  const [fontLoaded, fontError] = useFonts(LETTER_FONTS);
  const [fontTimedOut, setFontTimedOut] = useState(false);
  useEffect(() => {
    if (startedAfterSplash) return;
    const timer = setTimeout(() => setFontTimedOut(true), SPLASH_MAX_MS);
    return () => clearTimeout(timer);
  }, [startedAfterSplash]);
  const loaded = settingsReady && progressReady && (fontLoaded || fontError !== null || fontTimedOut);

  useEffect(() => { if (loaded) releaseSplash(); }, [loaded]);

  if (!startedAfterSplash && !loaded) return <View style={styles.blank} testID="startup-blank" />;
  return children;
}

const styles = StyleSheet.create({ blank: { flex: 1, backgroundColor: colors.background } });
