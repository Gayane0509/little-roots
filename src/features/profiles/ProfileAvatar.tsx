import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { AVATAR_PORTRAITS } from '@/art/avatars';
import { getWord } from '@/content/packs';
import { WordArt } from '@/ui/WordArt';
import type { AvatarWordId } from '@/state/profiles';
export function ProfileAvatar({ wordId, size = 64 }: { wordId: AvatarWordId; size?: number }) {
  const portrait = AVATAR_PORTRAITS[wordId];
  if (portrait) return <View style={{ width: size, height: size }} accessible={false} pointerEvents="none"><SvgXml xml={portrait} width={size} height={size} /></View>;
  return <WordArt wordId={wordId} emoji={getWord(wordId)?.emoji ?? '🧒'} size={size} />;
}
