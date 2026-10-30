const VALID_MS = 5 * 60 * 1000;

let passedAt: number | null = null;

/** In-memory only (never persisted): remembers that the adult check was just passed. */
export function markGatePassed(): void {
  passedAt = Date.now();
}

export function isGatePassed(): boolean {
  return passedAt !== null && Date.now() - passedAt < VALID_MS;
}
