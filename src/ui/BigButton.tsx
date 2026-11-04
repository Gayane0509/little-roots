import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/art/icons';
import { haptic } from '@/lib/haptics';
import { useSettings } from '@/state/settings';

import { labelColorOn } from './contrast';
import { Icon } from './Icon';
import { selectedA11y } from './selectedA11y';
import { spokenLabel } from './spokenLabel';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN } from './tokens';

interface BigButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  /** For toggle-style choices (announced as selected). */
  selected?: boolean;
  /** Drawn icon before the label (decorative; the label carries the meaning). */
  icon?: IconName;
}

export function BigButton({ label, onPress, color = colors.primary, disabled, style, accessibilityHint, selected, icon }: BigButtonProps) {
  const { haptics } = useSettings();
  const fill = disabled ? colors.locked : color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={spokenLabel(label)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      {...(selected === undefined ? null : selectedA11y(selected))}
      disabled={disabled}
      onPress={() => {
        haptic('tap', haptics);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: fill, transform: [{ scale: pressed ? 0.96 : 1 }] },
        style,
      ]}
    >
      {icon ? (
        <View style={styles.row}>
          <Icon name={icon} size={28} />
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.label, styles.shrink, { color: labelColorOn(fill) }]}>{label}</Text>
        </View>
      ) : <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} style={[styles.label, { color: labelColorOn(fill) }]}>{label}</Text>}
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
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  shrink: { flexShrink: 1 },
});
