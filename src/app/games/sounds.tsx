import { GameShell } from '@/features/games/GameShell';
import { SoundsGame } from '@/features/games/SoundsGame';

export default function SoundsScreen() {
  return <GameShell title="Letter sounds" icon="sounds">{(_words, onFinishedChange) => <SoundsGame onFinishedChange={onFinishedChange} />}</GameShell>;
}
