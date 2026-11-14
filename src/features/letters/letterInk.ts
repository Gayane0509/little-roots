/**
 * Vertical ink of each alphabet character in the bundled letter font (Noto Sans Armenian Bold, 1000 units per em):
 * [top, bottom] above the baseline, from the font's glyph bounding boxes (`letterInk.test.ts` checks them against the
 * file). Lets the trace canvas centre every letter, whether it has an ascender (ե, ծ, մ), a descender (բ, ք) or both.
 */
export const LETTER_INK: Readonly<Record<string, readonly [number, number]>> = {
  'Ա': [714, -10], 'Բ': [724, 0], 'Գ': [724, 0], 'Դ': [724, 0], 'Ե': [714, -10], 'Զ': [729, 0], 'Է': [714, -146],
  'Ը': [724, 0], 'Թ': [724, 0], 'Ժ': [714, -10], 'Ի': [714, 0], 'Լ': [714, 0], 'Խ': [714, 0], 'Ծ': [724, -10],
  'Կ': [714, 0], 'Հ': [724, -120], 'Ձ': [724, -19], 'Ղ': [724, 0], 'Ճ': [724, 0], 'Մ': [714, -10], 'Յ': [724, -10],
  'Ն': [760, -10], 'Շ': [724, -10], 'Ո': [724, 0], 'Չ': [724, -1], 'Պ': [724, 0], 'Ջ': [724, 0], 'Ռ': [724, 0],
  'Ս': [714, -10], 'Վ': [714, 0], 'Տ': [724, -10], 'Ր': [724, 0], 'Ց': [724, -10], 'Փ': [714, 0], 'Ք': [724, 0],
  'Օ': [725, -10], 'Ֆ': [714, -10],
  'ա': [500, -9], 'բ': [510, -239], 'գ': [510, -239], 'դ': [510, -239], 'ե': [760, -10], 'զ': [510, -239],
  'է': [760, -85], 'ը': [510, -239], 'թ': [510, -239], 'ժ': [760, -10], 'ի': [760, -239], 'լ': [501, -239],
  'խ': [760, -239], 'ծ': [770, -9], 'կ': [760, -239], 'հ': [766, 0], 'ձ': [760, -10], 'ղ': [510, -239],
  'ճ': [766, -10], 'մ': [766, -10], 'յ': [500, -249], 'ն': [760, -10], 'շ': [510, -239], 'ո': [510, 0],
  'չ': [500, -239], 'պ': [500, -239], 'ջ': [510, -239], 'ռ': [510, 0], 'ս': [500, -10], 'վ': [760, -239],
  'տ': [510, -10], 'ր': [510, -239], 'ց': [510, -249], 'ւ': [500, 0], 'փ': [760, -239], 'ք': [510, -239],
  'օ': [510, -9], 'ֆ': [714, -239], 'և': [760, -10],
};

/**
 * Baseline y for drawing `text` at `fontSize` so its ink is centred in a `size` box. Digraphs (Ու) use the union of
 * their characters; text with an unknown character keeps the old fixed offset (capital-height or x-height letters).
 */
export function traceBaselineY(text: string, size: number, fontSize: number, upper: boolean): number {
  let top = -Infinity;
  let bottom = Infinity;
  for (const char of text) {
    const ink = LETTER_INK[char];
    if (!ink) return size / 2 + fontSize * (upper ? 0.35 : 0.15);
    top = Math.max(top, ink[0]);
    bottom = Math.min(bottom, ink[1]);
  }
  if (top === -Infinity) return size / 2;
  return size / 2 + fontSize * (top + bottom) / 2000;
}
