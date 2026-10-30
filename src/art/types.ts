/** A word illustration: an SVG document string (see STYLE.md). */
export type ArtXml = string;

/** Illustrations for one theme, keyed by the word slug (the part after "<theme>." in Word.id). */
export type ThemeArt = Record<string, ArtXml>;
