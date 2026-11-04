import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import type { IconName } from '@/art/icons';
import { Icon } from './Icon';
import { DISPLAY_MAX_FONT_SCALE, spacing } from './tokens';

/** A screen title with its drawn icon; the icon is decorative and the text is the header. */
export function IconTitle({ icon, text, style }: { icon: IconName; text: string; style?: StyleProp<TextStyle> }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={44} />
      <Text style={style} accessibilityRole="header" maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
