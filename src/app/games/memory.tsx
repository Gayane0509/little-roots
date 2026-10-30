import { GameShell } from '@/features/games/GameShell';
import { MemoryGame } from '@/features/games/MemoryGame';

export default function MemoryScreen() {
  return <GameShell title="🧠 Memory match">{(words) => <MemoryGame seenWords={words} />}</GameShell>;
}
