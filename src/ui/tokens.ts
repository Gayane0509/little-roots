export const colors = {
  background: '#FFF8EE',
  surface: '#FFFFFF',
  text: '#2B2D42',
  textMuted: '#6C6F7F',
  primary: '#FF8C42',
  primaryDark: '#E06D1F',
  success: '#3BB273',
  danger: '#E5484D',
  star: '#FFC531',
  locked: '#C9CCD6',
  border: '#F0E3D0',
  /** Text-only variants that pass WCAG 4.5:1 on background and surface (use the fills above for shapes). */
  primaryText: '#A84B0C',
  successText: '#1E7A4C',
  dangerText: '#B42318',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 12, md: 20, lg: 32, round: 999 } as const;

export const font = {
  /** Big Armenian words on cards. */
  word: 44,
  title: 30,
  heading: 22,
  body: 18,
  small: 14,
} as const;

/** Most that display text (titles, big words, kid button labels) grows with the system text size; body text is uncapped. */
export const DISPLAY_MAX_FONT_SCALE = 1.5;

/** Minimum touch target for small kids' fingers. */
export const TOUCH_MIN = 64;
/** Widest the content column grows on tablets and the web. */
export const CONTENT_MAX_WIDTH = 720;
/** Window width from which grids add a third column. */
export const WIDE_BREAKPOINT = 600;
/** Windows shorter than this (iPhone SE 375×667, phone landscape) get compact spacing on screens that should fit without scrolling. */
export const SHORT_WINDOW_BELOW = 700;
