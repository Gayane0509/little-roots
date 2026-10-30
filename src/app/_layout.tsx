import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { configureNotificationHandler } from '@/lib/reminders';
import { LettersProvider } from '@/state/letters';
import { ProfilesProvider, useProfiles } from '@/state/profiles';
import { ProgressProvider } from '@/state/progress';
import { RecordingsProvider } from '@/state/recordings';

configureNotificationHandler();

function ProfileTree() {
  const { activeId } = useProfiles();
  return <ProgressProvider key={activeId ?? 'new'}>
        <LettersProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="lesson" options={{ gestureEnabled: false }} />
            <Stack.Screen name="parent-gate" options={{ presentation: 'modal' }} />
            <Stack.Screen name="parent/index" />
            <Stack.Screen name="parent/paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="parent/voices" />
            <Stack.Screen name="parent/children" />
            <Stack.Screen name="profiles" />
            <Stack.Screen name="parent/privacy" />
            <Stack.Screen name="theme/[id]" />
            <Stack.Screen name="letters" />
            <Stack.Screen name="stickers" />
            <Stack.Screen name="games/index" />
            <Stack.Screen name="games/memory" />
            <Stack.Screen name="games/listen" />
            <Stack.Screen name="games/read" />
            <Stack.Screen name="parent/reminders" />
          </Stack>
        </LettersProvider>
    </ProgressProvider>;
}

export default function RootLayout() {
  return <ProfilesProvider><RecordingsProvider><ProfileTree /></RecordingsProvider></ProfilesProvider>;
}
