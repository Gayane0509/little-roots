import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useParentGuard } from '@/features/parent/gate';
import { goBackOrHome } from '@/lib/navigation';
import { useSettings } from '@/state/settings';
import { BigButton } from '@/ui/BigButton';
import { labelColorOn } from '@/ui/contrast';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function ParentSettingsScreen() {
  const guard = useParentGuard('/parent/settings');
  const { ready, soundEffects, buddyLanguage, setSoundEffects, setBuddyLanguage } = useSettings();
  if (guard) return guard;
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title} accessibilityRole="header">Sound & language</Text>
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>Sound effects</Text>
      <Text style={styles.body}>Gentle sounds celebrate answers, games, and tracing.</Text>
      <View style={styles.options}>
        {([true, false] as const).map(value => <Pressable key={String(value)} accessibilityRole="button" accessibilityState={{ selected: soundEffects === value, disabled: !ready }} disabled={!ready} onPress={() => setSoundEffects(value)} style={[styles.option, soundEffects === value && styles.selected]}>
          <Text style={[styles.optionText, soundEffects === value && styles.selectedText]}>{value ? 'On' : 'Off'}</Text>
        </Pressable>)}
      </View>
    </View>
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>Buddy&apos;s language</Text>
      <Text style={styles.body}>Choose how Buddy gives everyday directions.</Text>
      <View style={styles.options}>
        {([['en', 'English'], ['hy', 'Armenian + English']] as const).map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: buddyLanguage === value, disabled: !ready }} disabled={!ready} onPress={() => setBuddyLanguage(value)} style={[styles.option, buddyLanguage === value && styles.selected]}>
          <Text style={[styles.optionText, buddyLanguage === value && styles.selectedText]}>{label}</Text>
        </Pressable>)}
      </View>
      <Text style={styles.note}>Spoken Armenian needs an Armenian voice installed on this device or recordings. Otherwise Buddy reads the English line aloud.</Text>
    </View>
    <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg },
  title: { color: colors.text, fontSize: font.title, fontWeight: '800' },
  card: { gap: spacing.md, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface },
  heading: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  body: { color: colors.text, fontSize: font.body },
  note: { color: colors.textMuted, fontSize: font.body },
  options: { flexDirection: 'row', gap: spacing.sm },
  option: { flex: 1, minHeight: TOUCH_MIN, padding: spacing.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  selected: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  optionText: { textAlign: 'center', color: colors.text, fontSize: font.body, fontWeight: '700' },
  selectedText: { color: labelColorOn(colors.primary) },
});
