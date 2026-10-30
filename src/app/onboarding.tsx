import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy, BUDDY_NAME } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function Onboarding() {
  const { setChildName } = useProgress();
  const [name, setName] = useState('');

  const finish = (value: string) => {
    setChildName(value.trim() || 'Friend');
    router.replace('/');
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Buddy mood="cheer" message={`Բարև։ Ես ${BUDDY_NAME.hy}ն եմ։ Hi! I am ${BUDDY_NAME.en}.`} />
          <Text style={styles.question}>What is your name?</Text>
          <TextInput
            accessibilityLabel="Child's first name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={colors.textMuted}
            maxLength={20}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => finish(name)}
          />
          <Text style={styles.note}>Stays on this device only.</Text>
          <BigButton label="Let's go!" onPress={() => finish(name)} />
          <BigButton label="Skip" color={colors.textMuted} onPress={() => finish('')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: spacing.lg, paddingVertical: spacing.lg },
  question: { fontSize: font.title, fontWeight: '800', color: colors.text },
  input: {
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: font.heading,
    color: colors.text,
  },
  note: { fontSize: font.small, color: colors.textMuted },
});
