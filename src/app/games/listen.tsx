import { ChoiceGame } from '@/features/games/ChoiceGame';
import { GameShell } from '@/features/games/GameShell';

export default function ListenScreen() {
  return <GameShell title="👂 Listen & find">{(words) => <ChoiceGame mode="listen" seenWords={words} />}</GameShell>;
}
