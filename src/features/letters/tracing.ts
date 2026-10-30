export interface TracePoint { x: number; y: number }
export type TraceStroke = TracePoint[];

/** Gentle coverage check in the centre 60% of the canvas. Dense scribbles are invited to retry. */
export function traceScore(strokes: TraceStroke[], canvasSize: number): number {
  if (!Number.isFinite(canvasSize) || canvasSize <= 0) return 0;
  const cells = new Set<string>();
  const rows = new Set<number>();
  const cols = new Set<number>();
  const start = canvasSize * 0.2;
  const step = canvasSize * 0.1;
  for (const stroke of strokes) {
    for (let i = 0; i < stroke.length; i++) {
      const a = stroke[Math.max(0, i - 1)];
      const b = stroke[i];
      if (![a.x, a.y, b.x, b.y].every(Number.isFinite)) continue;
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      const samples = Math.min(1000, Math.max(1, Math.ceil(distance / (step / 2))));
      for (let j = 0; j <= samples; j++) {
        const x = a.x + (b.x - a.x) * j / samples;
        const y = a.y + (b.y - a.y) * j / samples;
        const col = Math.floor((x - start) / step);
        const row = Math.floor((y - start) / step);
        if (col >= 0 && col < 6 && row >= 0 && row < 6) {
          cells.add(`${col}:${row}`); rows.add(row); cols.add(col);
        }
      }
    }
  }
  if (rows.size < 2 || cols.size < 2 || cells.size > 28) return 0;
  return Math.min(1, cells.size / 14);
}

export function isTraceGoodEnough(score: number): boolean { return score >= 0.5; }
