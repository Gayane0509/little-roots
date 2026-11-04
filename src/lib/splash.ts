import * as SplashScreen from 'expo-splash-screen';

/**
 * Startup splash (see AI_DECISIONS 2026-11-03 "Startup splash"). The native splash stays up until the stored
 * settings, family and progress have loaded, so children never see a flash of default state (English buddy,
 * sound on, the onboarding redirect). A safety timeout releases it if storage hangs; a stuck splash is worse
 * than a brief flash. The web build has no native splash; `StartupGate` shows a plain background instead.
 */
export const SPLASH_MAX_MS = 4000;
export const STARTUP_MARK = 'lr:providers-ready';
export const STARTUP_MEASURE = 'lr:startup';
const HOLD_MARK = 'lr:splash-held';

let held = false;
let released = false;
let timer: ReturnType<typeof setTimeout> | null = null;

/** Call once at module scope in the root layout, before the first render. */
export function holdSplash(): void {
  if (held || released) return;
  held = true;
  mark(HOLD_MARK);
  void SplashScreen.preventAutoHideAsync().catch(() => { /* Already hidden: nothing to hold. */ });
  timer = setTimeout(releaseSplash, SPLASH_MAX_MS);
}

/** Hides the splash once; later calls do nothing. Records the startup time as a performance mark/measure. */
export function releaseSplash(): void {
  if (released) return;
  released = true;
  if (timer !== null) { clearTimeout(timer); timer = null; }
  mark(STARTUP_MARK);
  try { performance.measure(STARTUP_MEASURE, HOLD_MARK, STARTUP_MARK); } catch { /* Marks unsupported. */ }
  SplashScreen.hide();
}

export function isSplashReleased(): boolean { return released; }

function mark(name: string): void {
  try { performance.mark(name); } catch { /* Performance API missing on this runtime. */ }
}
