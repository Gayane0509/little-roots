import { getWord } from '@/content/packs';
import { WordArt } from '@/ui/WordArt';
import type { AvatarWordId } from '@/state/profiles';
export function ProfileAvatar({ wordId, size = 64 }: { wordId: AvatarWordId; size?: number }) {
  return <WordArt wordId={wordId} emoji={getWord(wordId)?.emoji ?? '🧒'} size={size} />;
}
