import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useParentGuard } from '@/features/parent/gate';
import { goBackOrHome } from '@/lib/navigation';
import { getReminder, setReminder, type ReminderSettings } from '@/lib/reminders';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { labelColorOn } from '@/ui/contrast';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const PRESETS = [8, 12, 16, 18, 19, 20];

function timeLabel(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function Reminders() {
  const guard = useParentGuard('/parent/reminders');
  const [settings, setSettings] = useState<ReminderSettings>({ enabled: false, hour: 19, minute: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getReminder()
      .then((value) => { if (active) setSettings(value); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const change = async (enabled: boolean, hour: number) => {
    if (busy) return;
    setBusy(true);
    setDenied(false);
    setUnsupported(false);
    setError(false);
    try {
      const result = await setReminder(enabled, hour, 0);
      if (result === 'ok') setSettings({ enabled, hour, minute: 0 });
      else if (result === 'denied') setDenied(true);
      else setUnsupported(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  if (guard) return guard;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">Daily reminder</Text>
        <Text style={styles.body}>A gentle daily reminder for you, the parent — never shown to your child as an ad.</Text>

        <View style={styles.card}>
          <Text style={styles.heading} accessibilityRole="header">Current state</Text>
          <Text style={styles.body} accessibilityLiveRegion="polite">
            {loading ? 'Loading…' : settings.enabled
              ? `On · Every day at ${timeLabel(settings.hour, settings.minute)}`
              : 'Off'}
          </Text>
          <BigButton
            label={settings.enabled ? 'Turn reminder off' : 'Turn reminder on'}
            color={settings.enabled ? colors.textMuted : colors.success}
            disabled={loading || busy}
            onPress={() => { void change(!settings.enabled, settings.hour); }}
          />
        </View>

        <Text style={styles.heading} accessibilityRole="header">Choose a time</Text>
        <View style={styles.presets}>
          {PRESETS.map((hour) => {
            const selected = settings.hour === hour && settings.minute === 0;
            return (
              <Pressable
                key={hour}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: loading || busy }}
                accessibilityLabel={`${timeLabel(hour, 0)} reminder time`}
                disabled={loading || busy}
                onPress={() => { void change(settings.enabled, hour); }}
                style={[styles.chip, selected && styles.selectedChip]}
              >
                <Text style={[styles.chipText, selected && styles.selectedChipText]}>{timeLabel(hour, 0)}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.note}>The reminder follows this device&apos;s local time.</Text>
        {denied && (
          <Text style={styles.warning} accessibilityRole="alert">
            Notifications are turned off for Little Roots. Allow notifications in your device settings, then try again.
          </Text>
        )}
        {unsupported && (
          <Text style={styles.warning} accessibilityRole="alert">
            Reminders aren&apos;t available on the web version.
          </Text>
        )}
        {error && (
          <Text style={styles.warning} accessibilityRole="alert">
            Couldn&apos;t update the reminder. Please try again.
          </Text>
        )}
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  heading: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  body: { fontSize: font.body, color: colors.text },
  note: { fontSize: font.small, color: colors.textMuted },
  warning: { fontSize: font.body, color: colors.dangerText },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.md },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minWidth: '30%', minHeight: TOUCH_MIN, borderRadius: radius.md,
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm,
  },
  selectedChip: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { fontSize: font.body, fontWeight: '700', color: colors.text },
  selectedChipText: { color: labelColorOn(colors.primary) },
});
