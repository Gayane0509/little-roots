import { CountGame } from '@/features/games/CountGame';
import { GameShell } from '@/features/games/GameShell';

export default function CountScreen() {
  return <GameShell title="Count with me" icon="count">{(words, onFinishedChange) => <CountGame seenWords={words} onFinishedChange={onFinishedChange} />}</GameShell>;
}
