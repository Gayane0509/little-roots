import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { SCENES, type SceneName } from '@/art/scenes';

/** Backdrop height for a window width: about a third of the width, never taller than 240. */
export function sceneHeight(width: number): number {
  return Math.min(240, Math.round(width * 0.3));
}

/** Static scene along the bottom edge, behind everything; decorative, never touchable or read aloud. */
export function SceneBackdrop({ scene }: { scene: SceneName }) {
  const { width } = useWindowDimensions();
  const height = sceneHeight(width);
  return (
    <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.backdrop, { height }]}>
      <SvgXml xml={SCENES[scene]} width="100%" height={height} preserveAspectRatio="xMidYMax slice" />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
