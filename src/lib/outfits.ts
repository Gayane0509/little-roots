import { BUDDY_OUTFITS, type BuddyOutfit } from '@/art/buddy';

/** Stickers a child needs before Buddy can wear each item (#58). */
export const OUTFIT_UNLOCK: Record<BuddyOutfit, number> = { hat: 3, glasses: 6, crown: 10 };

export const OUTFIT_LABEL: Record<BuddyOutfit, string> = { hat: 'Party hat', glasses: 'Glasses', crown: 'Crown' };

export function isBuddyOutfit(value: unknown): value is BuddyOutfit {
  return typeof value === 'string' && (BUDDY_OUTFITS as readonly string[]).includes(value);
}

/** How many more stickers until `outfit` unlocks (0 = unlocked). */
export function stickersNeeded(outfit: BuddyOutfit, stickerCount: number): number {
  return Math.max(0, OUTFIT_UNLOCK[outfit] - stickerCount);
}

export function unlockedOutfits(stickerCount: number): BuddyOutfit[] {
  return BUDDY_OUTFITS.filter((outfit) => stickersNeeded(outfit, stickerCount) === 0);
}

/** The outfit Buddy shows: the saved pick, only while it is still unlocked (e.g. not after a progress reset). */
export function wornOutfit(state: { buddyOutfit?: BuddyOutfit; stickers: readonly string[] }): BuddyOutfit | undefined {
  return state.buddyOutfit && stickersNeeded(state.buddyOutfit, state.stickers.length) === 0 ? state.buddyOutfit : undefined;
}

/** The outfit a lesson's new sticker unlocks, if the count crosses a threshold (for the reward screen). */
export function outfitUnlockedBy(stickersBefore: number, stickersAfter: number): BuddyOutfit | undefined {
  return BUDDY_OUTFITS.find((outfit) => stickersNeeded(outfit, stickersBefore) > 0 && stickersNeeded(outfit, stickersAfter) === 0);
}
