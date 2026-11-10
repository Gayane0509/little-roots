/** Tag on the Children row of the child whose progress Home shows. */
export const PLAYING_NOW = 'Playing now';

/** Only worth saying with two or more children; with one, it's always that child. */
export function isPlayingNow(id: string, activeId: string | null, childCount: number): boolean {
  return childCount > 1 && id === activeId;
}
