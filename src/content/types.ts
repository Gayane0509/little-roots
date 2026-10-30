export type ThemeId =
  | 'family'
  | 'food'
  | 'animals'
  | 'colors'
  | 'numbers'
  | 'body'
  | 'clothes'
  | 'home'
  | 'toys'
  | 'nature'
  | 'transport'
  | 'feelings';

export interface Word {
  /** Stable id, e.g. "family.mom". Progress is keyed by it — never rename once shipped. */
  id: string;
  themeId: ThemeId;
  /** Armenian (Eastern) spelling. */
  hy: string;
  /** Latin transliteration for parents who don't read Armenian. */
  translit: string;
  en: string;
  emoji: string;
}

export interface SongLine {
  hy: string;
  translit: string;
  en: string;
}

/** A short original rhyme or story that reuses the theme's words. */
export interface Song {
  id: string;
  themeId: ThemeId;
  title: string;
  lines: SongLine[];
}

export interface Theme {
  id: ThemeId;
  titleHy: string;
  titleEn: string;
  emoji: string;
  /** Background color of the theme on the map. */
  color: string;
  /** Free themes are playable without a subscription. */
  free: boolean;
  words: Word[];
  song: Song;
}
