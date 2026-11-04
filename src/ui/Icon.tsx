import { memo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ICONS, type IconName } from '@/art/icons';

/** A decorative UI icon from `src/art/icons.ts`; callers own the accessibility label. */
export const Icon = memo(function Icon({ name, size }: { name: IconName; size: number }) {
  return (
    <View style={{ width: size, height: size }} accessible={false} pointerEvents="none">
      <SvgXml xml={ICONS[name]} width={size} height={size} />
    </View>
  );
});
