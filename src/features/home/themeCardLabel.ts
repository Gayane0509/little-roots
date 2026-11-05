/** A theme the child has finished: every word learned (#123). */
export function isThemeComplete(learned: number, total: number, unlocked: boolean): boolean {
  return unlocked && total > 0 && learned >= total;
}

/** Screen-reader label of a Home theme card. */
export function themeCardLabel(theme: { titleHy: string; titleEn: string }, learned: number, total: number, unlocked: boolean, isNext: boolean): string {
  if (!unlocked) return `${theme.titleHy}, ${theme.titleEn}, locked. Ask a grown-up to unlock`;
  if (isThemeComplete(learned, total, unlocked)) return `${theme.titleHy}, ${theme.titleEn}, all ${total} words learned. Open`;
  return `${isNext ? 'Next up: ' : ''}${theme.titleHy}, ${theme.titleEn}, ${learned} of ${total} words learned. Open`;
}
