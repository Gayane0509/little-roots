import { expect, test } from '@jest/globals';
import { isTraceGoodEnough, traceScore } from './tracing';

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
