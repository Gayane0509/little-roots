import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { startAudioSession } from '@/lib/audioSession';
import { configureNotificationHandler } from '@/lib/reminders';
import { screenTitle } from '@/lib/screenTitle';
import { holdSplash } from '@/lib/splash';
import { StartupGate } from '@/features/startup/StartupGate';
import { FamilyVoiceProvider } from '@/state/familyVoice';
import { LettersProvider } from '@/state/letters';
import { ProfilesProvider, useProfiles } from '@/state/profiles';
import { ProgressProvider } from '@/state/progress';
import { SettingsProvider } from '@/state/settings';

holdSplash();
configureNotificationHandler();

/** Rendered outside the providers by expo-router, so it must not use app context. */
export { KidErrorBoundary as ErrorBoundary } from '@/features/errors/KidErrorScreen';

/** Web preview only: a browser tab title per screen (native screen readers announce screens themselves). */
function WebTitle() {
  const pathname = usePathname();
  return <Head><title>{screenTitle(pathname)}</title></Head>;
}

function ProfileTree() {
  const { activeId } = useProfiles();
  return <ProgressProvider key={activeId ?? 'new'}>
        <LettersProvider>
        <FamilyVoiceProvider childId={activeId}>
          <StatusBar style="dark" />
          <StartupGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="lesson" options={{ gestureEnabled: false }} />
            <Stack.Screen name="parent-gate" options={{ presentation: 'modal' }} />
            <Stack.Screen name="parent/index" />
            <Stack.Screen name="parent/paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="parent/children" />
            <Stack.Screen name="profiles" />
            <Stack.Screen name="parent/privacy" />
            <Stack.Screen name="theme/[id]" />
            <Stack.Screen name="letters" />
            <Stack.Screen name="stickers" />
            <Stack.Screen name="games/index" />
            <Stack.Screen name="games/memory" />
            <Stack.Screen name="games/find" />
            <Stack.Screen name="games/count" />
            <Stack.Screen name="games/read" />
            <Stack.Screen name="parent/reminders" />
            <Stack.Screen name="parent/settings" />
            <Stack.Screen name="parent/intro" />
            <Stack.Screen name="parent/voice" />
          </Stack>
          </StartupGate>
        </FamilyVoiceProvider>
        </LettersProvider>
    </ProgressProvider>;
}

export default function RootLayout() {
  useEffect(startAudioSession, []);
  return (
    <SettingsProvider>
      {Platform.OS === 'web' && <WebTitle />}
      <ProfilesProvider>
        <ProfileTree />
      </ProfilesProvider>
    </SettingsProvider>
  );
}
