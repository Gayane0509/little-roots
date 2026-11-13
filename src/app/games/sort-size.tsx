import { GameShell } from '@/features/games/GameShell';
import { SortGame } from '@/features/games/SortGame';

export default function SortSizeScreen() {
  return <GameShell title="Big or small" icon="bigBox">{(words, onFinishedChange, reviewIds) => <SortGame pair="size" seenWords={words} reviewIds={reviewIds} onFinishedChange={onFinishedChange} />}</GameShell>;
}
