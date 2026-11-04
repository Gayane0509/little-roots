import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { SCENES, type SceneName } from '@/art/scenes';

/** Top of the scene art in viewBox units (see `SCENES`): the crop of `xMidYMax slice` must stay above it. */
export const SCENE_ART_TOP = 22;
const VIEWBOX = { width: 400, height: 120 };

/**
 * Backdrop height for a window width: about a third of the width, at most 240 — except on screens wider than ~980,
 * where 240 would crop the clouds; there it grows just enough to keep the crop above `SCENE_ART_TOP`.
 */
export function sceneHeight(width: number): number {
  const noClip = Math.ceil((width * (VIEWBOX.height - SCENE_ART_TOP)) / VIEWBOX.width);
  return Math.max(Math.min(240, Math.round(width * 0.3)), noClip);
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
