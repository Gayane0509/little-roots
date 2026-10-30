import { describe, expect, it } from '@jest/globals';
import { PHRASES } from './phrases';

describe('PHRASES', () => {
  it('has hy, translit and en for every key', () => {
    for (const p of Object.values(PHRASES) as { hy: string; translit: string; en: string }[]) {
      expect(p.hy.length).toBeGreaterThan(0);
      expect(p.translit.length).toBeGreaterThan(0);
      expect(p.en.length).toBeGreaterThan(0);
    }
  });
  it('uses the same placeholders in every language', () => {
    for (const p of Object.values(PHRASES) as { hy: string; translit: string; en: string }[]) {
      const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
      expect(ph(p.hy)).toBe(ph(p.en));
      expect(ph(p.translit)).toBe(ph(p.en));
    }
  });
});
