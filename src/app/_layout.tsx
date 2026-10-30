import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProgressProvider } from '@/state/progress';

export default function RootLayout() {
  return (
    <ProgressProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="lesson" options={{ gestureEnabled: false }} />
        <Stack.Screen name="parent-gate" options={{ presentation: 'modal' }} />
        <Stack.Screen name="parent/index" />
        <Stack.Screen name="parent/paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </ProgressProvider>
  );
}
