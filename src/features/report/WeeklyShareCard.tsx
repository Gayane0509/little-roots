import { Alert, Platform, Share, StyleSheet, Text, View } from 'react-native';

import { getWord } from '@/content/themes';
import type { Word } from '@/content/types';
import type { weeklyReport } from '@/lib/report';
import { BigButton } from '@/ui/BigButton';
import { colors, font, radius, spacing } from '@/ui/tokens';

import { weeklyShareText } from './shareText';

interface Props {
  childName: string;
  report: ReturnType<typeof weeklyReport>;
}

function notify(message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') window.alert(message);
  else Alert.alert(message);
}

async function shareMessage(message: string) {
  // Browsers without the Web Share API: copy instead. Never copy after the parent dismissed a share sheet.
  if (Platform.OS === 'web' && (typeof navigator === 'undefined' || typeof navigator.share !== 'function')) {
    try {
      await navigator.clipboard.writeText(message);
      notify('Copied — paste it into a message');
    } catch {
      notify('Sharing is not available on this device');
    }
    return;
  }
  try {
    await Share.share({ message });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    notify('Sharing is not available on this device');
  }
}

export function WeeklyShareCard({ childName, report }: Props) {
  const newWords = report.newWordIds.map((id) => getWord(id)).filter((w): w is Word => w !== undefined);
  const message = weeklyShareText({
    childName,
    daysActive: report.daysActive,
    newWords,
    totalWords: report.totalWords,
    streakDays: report.streakDays,
  });
  const preview = message.split('\n').slice(0, 3).join('\n');

  return (
    <View style={styles.card}>
      <Text style={styles.heading} accessibilityRole="header">
        Share this week
      </Text>
      <Text style={styles.preview} numberOfLines={5}>
        {preview}
      </Text>
      <BigButton
        label="📤 Share with family"
        color={colors.success}
        accessibilityHint="Opens the share sheet with this week's progress"
        onPress={() => void shareMessage(message)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  heading: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  preview: {
    fontSize: font.body,
    color: colors.textMuted,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});
