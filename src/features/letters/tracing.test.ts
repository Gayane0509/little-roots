import { expect, test } from '@jest/globals';
import { isTraceGoodEnough, TRACE_MARK_BUTTON_CHROME, TRACE_MIN_SIZE, TRACE_SHEET_CHROME, traceCanvasSize, traceScore } from './tracing';

const point = (x: number, y: number) => ({ x, y });
test('empty, one dot, invalid size, and off-canvas ink score zero', () => {
  expect(traceScore([], 200)).toBe(0);
  expect(traceScore([[point(100, 100)]], 200)).toBe(0);
  expect(traceScore([[point(100, 100)]], 0)).toBe(0);
  expect(traceScore([[point(-30, -30), point(-10, -10)]], 200)).toBe(0);
});
test('a single straight line does not count as a complete letter', () => {
  expect(isTraceGoodEnough(traceScore([[point(45, 100), point(155, 100)]], 200))).toBe(false);
});
test('a reasonable central letter-shaped trace is enough', () => {
  const a = [point(55, 145), point(70, 70), point(100, 50), point(130, 70), point(145, 145)];
  expect(isTraceGoodEnough(traceScore([a, [point(68, 110), point(132, 110)]], 200))).toBe(true);
});
test('filling nearly every cell is a scribble, not a trace', () => {
  const scribble = Array.from({ length: 6 }, (_, row) => [point(42, 42 + row * 20), point(158, 42 + row * 20)]);
  expect(traceScore(scribble, 200)).toBe(0);
});

test('the trace canvas keeps its width-based size on tall phones and shrinks on short ones so Done stays in the sheet', () => {
  expect(traceCanvasSize(375, 812)).toBe(323);
  expect(traceCanvasSize(375, 667)).toBe(244);
  expect(traceCanvasSize(1024, 1366)).toBe(356);
  expect(traceCanvasSize(1024, 768)).toBe(335);
  expect(traceCanvasSize(375, 400)).toBe(TRACE_MIN_SIZE);
  expect(traceCanvasSize(320, 568)).toBe(TRACE_MIN_SIZE);
});

test('screen-reader Mark as traced button: canvas shrinks so Clear/Done stay in the sheet (#94)', () => {
  // 1024×768 iPad: 691 − 356 − 80 = 255 (was 335, which put Clear/Done at 776–840, below the window).
  expect(traceCanvasSize(1024, 768, true)).toBe(255);
  expect(traceCanvasSize(375, 812, true)).toBe(294);
  expect(traceCanvasSize(1024, 1366, true)).toBe(356);
  expect(traceCanvasSize(375, 667, true)).toBe(TRACE_MIN_SIZE);
  for (const [w, h] of [[375, 812], [1024, 768], [430, 932]] as const) {
    const size = traceCanvasSize(w, h, true);
    if (size > TRACE_MIN_SIZE) expect(size + TRACE_SHEET_CHROME + TRACE_MARK_BUTTON_CHROME).toBeLessThanOrEqual(Math.floor(h * 0.9));
  }
});
