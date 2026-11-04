import type { ProgressState } from '@/state/progress.types';

/**
 * The tap hand shows only in a child's very first lesson (no finished lesson yet), on the first word card, until the
 * first tap. Progress is per child, so each child sees it once and nothing extra is stored.
 */
export function shouldShowTapHint(state: Pick<ProgressState, 'lessons'>, cardIndex: number, tapped: boolean): boolean {
  return state.lessons.length === 0 && cardIndex === 0 && !tapped;
}
