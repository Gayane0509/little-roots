import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useParentGuard } from '@/features/parent/gate';
import { PRIVACY_SECTIONS } from '@/features/parent/privacyText';
import { goBackOrHome } from '@/lib/navigation';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing } from '@/ui/tokens';

export default function Privacy() {
  const guard = useParentGuard('/parent/privacy');
  if (guard) return guard;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}><View accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden><Text style={styles.title}>🔒</Text></View><Text accessibilityRole="header" style={styles.title}>Privacy</Text></View>
        {PRIVACY_SECTIONS.map((section) => (
          <View key={section.heading} style={styles.card}>
            <Text style={styles.heading} accessibilityRole="header">
              {section.heading}
            </Text>
            {section.paragraphs.map((p) => (
              <Text key={p} style={styles.body}>
                {p}
              </Text>
            ))}
          </View>
        ))}
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  heading: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  body: { fontSize: font.body, color: colors.text },
});
