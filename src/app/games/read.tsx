import { ChoiceGame } from '@/features/games/ChoiceGame';
import { GameShell } from '@/features/games/GameShell';

export default function ReadScreen() {
  return <GameShell title="Read it" icon="read">{(words, onFinishedChange, reviewIds) => <ChoiceGame mode="read" seenWords={words} reviewIds={reviewIds} onFinishedChange={onFinishedChange} />}</GameShell>;
}
