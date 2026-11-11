import { ChoiceGame } from '@/features/games/ChoiceGame';
import { GameShell } from '@/features/games/GameShell';

export default function FindScreen() {
  return <GameShell title="Find the picture" icon="find">{(words, onFinishedChange, reviewIds) => <ChoiceGame mode="find" seenWords={words} reviewIds={reviewIds} onFinishedChange={onFinishedChange} />}</GameShell>;
}
