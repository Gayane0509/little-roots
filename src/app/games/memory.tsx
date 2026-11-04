import { GameShell } from '@/features/games/GameShell';
import { MemoryGame } from '@/features/games/MemoryGame';

export default function MemoryScreen() {
  return <GameShell title="Memory match" icon="memory">{(words) => <MemoryGame seenWords={words} />}</GameShell>;
}
