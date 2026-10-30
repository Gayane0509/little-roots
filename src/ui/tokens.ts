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

/** Minimum touch target for small kids' fingers. */
export const TOUCH_MIN = 64;
