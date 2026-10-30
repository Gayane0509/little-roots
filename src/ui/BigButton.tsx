import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { labelColorOn } from './contrast';
import { colors, font, radius, spacing, TOUCH_MIN } from './tokens';

interface BigButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  /** For toggle-style choices (announced as selected). */
  selected?: boolean;
}

export function BigButton({ label, onPress, color = colors.primary, disabled, style, accessibilityHint, selected }: BigButtonProps) {
  const fill = disabled ? colors.locked : color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, selected }}
      disabled={disabled}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: fill, transform: [{ scale: pressed ? 0.96 : 1 }] },
        style,
      ]}
    >
      <Text style={[styles.label, { color: labelColorOn(fill) }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: font.heading, fontWeight: '800', textAlign: 'center' },
});
