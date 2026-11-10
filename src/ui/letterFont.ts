import { NotoSansArmenian_700Bold } from '@expo-google-fonts/noto-sans-armenian/700Bold';

/**
 * The one bundled font (AI_DECISIONS 2026-11-10, #127): Noto Sans Armenian Bold for big alphabet letters, so a child sees
 * the same letter shape on iOS, Android and web. Deep import: the package index would bundle all nine weights.
 * Use with no `fontWeight` — the weight is in the file, and Android falls back to the system font for a bold variant.
 */
export const LETTER_FONT = 'NotoSansArmenian_700Bold';
export const LETTER_FONTS = { [LETTER_FONT]: NotoSansArmenian_700Bold as number };
