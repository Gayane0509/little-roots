import { GameShell } from '@/features/games/GameShell';
import { SortGame } from '@/features/games/SortGame';

export default function SortScreen() {
  return <GameShell title="Sort it" icon="sort">{(words, onFinishedChange, reviewIds) => <SortGame seenWords={words} reviewIds={reviewIds} onFinishedChange={onFinishedChange} />}</GameShell>;
}
