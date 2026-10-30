import { ChoiceGame } from '@/features/games/ChoiceGame';
import { GameShell } from '@/features/games/GameShell';

export default function ReadScreen() {
  return <GameShell title="📖 Read it">{(words) => <ChoiceGame mode="read" seenWords={words} />}</GameShell>;
}
