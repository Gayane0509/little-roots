import { StyleSheet, Text, View } from 'react-native';

import { useProgressActions, useProgressState } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { colors, font, radius, spacing } from '@/ui/tokens';

export function StorageErrorBanner() {
  const { storageError } = useProgressState();
  const { retryStorage } = useProgressActions();
  if (!storageError) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.message}>We couldn&apos;t save progress on this device.</Text>
      <BigButton label="Retry" color={colors.danger} onPress={retryStorage} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
    borderWidth: 2,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  message: { color: colors.text, fontSize: font.body },
  button: { alignSelf: 'flex-start' },
});
