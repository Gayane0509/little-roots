/** A word's picture on the printed sheet: a bundled PNG (data URI or URL), a drawn SVG, or the emoji fallback. */
export type PrintPicture = { kind: 'img'; src: string } | { kind: 'svg'; xml: string } | { kind: 'emoji'; text: string };

export interface PrintWord {
  hy: string;
  translit: string;
  en: string;
  picture: PrintPicture;
}

/** Twelve cards (2 × 6) fill one A4 / Letter page at a size a child can point at. */
export const PRINT_MAX_WORDS = 12;

/** This week's new words; a week without new words prints the words to practise instead (#154). */
export function printWordIds(report: { newWordIds: string[]; practiceWordIds: string[] }): string[] {
  const ids = report.newWordIds.length > 0 ? report.newWordIds : report.practiceWordIds;
  return ids.slice(0, PRINT_MAX_WORDS);
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}

function pictureHtml(picture: PrintPicture): string {
  // SVG xml is the app's own bundled art (src/art/words), never user input, so it is inlined as is.
  if (picture.kind === 'svg') return picture.xml;
  if (picture.kind === 'img') return `<img src="${escapeHtml(picture.src)}" alt="">`;
  return `<span class="emoji">${escapeHtml(picture.text)}</span>`;
}

/** A self-contained, offline HTML page for the system print sheet (print or save as PDF). */
export function weeklyPrintHtml({ childName, words }: { childName: string; words: PrintWord[] }): string {
  const cards = words.map((word) => `<div class="card"><div class="pic">${pictureHtml(word.picture)}</div><div class="hy" lang="hy">${escapeHtml(word.hy)}</div><div class="tr">${escapeHtml(word.translit)} · ${escapeHtml(word.en)}</div></div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(childName)}'s words this week</title><style>
@page { size: auto; margin: 12mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Noto Sans Armenian", "Noto Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #2d2a32; }
h1 { font-size: 22pt; margin: 0 0 4mm; }
p { font-size: 11pt; margin: 0 0 6mm; color: #6b6672; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.card { border: 0.6mm solid #e4ddd3; border-radius: 4mm; padding: 4mm; text-align: center; break-inside: avoid; page-break-inside: avoid; }
.pic { height: 28mm; display: flex; align-items: center; justify-content: center; }
.pic img, .pic svg { width: 28mm; height: 28mm; object-fit: contain; }
.emoji { font-size: 60pt; line-height: 1; }
.hy { font-size: 22pt; font-weight: 700; margin-top: 2mm; }
.tr { font-size: 11pt; color: #6b6672; margin-top: 1mm; }
</style></head><body><h1>${escapeHtml(childName)}'s words this week</h1><p>Point at a picture, say the word, and let your child say it back.</p><div class="grid">${cards}</div></body></html>`;
}
