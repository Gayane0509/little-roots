import { colors } from './tokens';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** WCAG contrast ratio of two #RRGGBB colors. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** White or dark label, whichever reads better on the given #RRGGBB fill. */
export function labelColorOn(fill: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(fill)) return colors.surface;
  return contrastRatio(colors.surface, fill) >= contrastRatio(colors.text, fill) ? colors.surface : colors.text;
}
