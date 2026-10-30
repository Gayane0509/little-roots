import { describe, expect, it } from '@jest/globals';
import { ALPHABET } from './alphabet';

describe('alphabet', () => {
  it('has 39 letters starting with Ayb and ending with Fe', () => {
    expect(ALPHABET).toHaveLength(39);
    expect(ALPHABET[0].name).toBe('Ayb');
    expect(ALPHABET[38].upper).toBe('Ֆ');
  });

  it('follows the primer order exactly', () => {
    expect(ALPHABET.map((l) => l.lower).join(' ')).toBe(
      'ա բ գ դ ե զ է ը թ ժ ի լ խ ծ կ հ ձ ղ ճ մ յ ն շ ո չ պ ջ ռ ս վ տ ր ց ու փ ք և օ ֆ',
    );
  });

  it('has distinct upper and lower case and unique letters', () => {
    for (const l of ALPHABET) if (l.lower !== 'և') expect(l.upper).not.toBe(l.lower);
    expect(new Set(ALPHABET.map((l) => l.lower)).size).toBe(ALPHABET.length);
  });

  it('has complete fields', () => {
    for (const l of ALPHABET) {
      for (const v of [l.name, l.sound, l.example.hy, l.example.translit, l.example.en, l.example.emoji]) {
        expect(v.trim()).not.toBe('');
      }
    }
  });

  it('uses example words that start with the letter (և only occurs inside words)', () => {
    for (const l of ALPHABET) {
      if (l.lower === 'և') {
        expect(l.example.hy).toContain('և');
      } else {
        expect([l.lower, l.upper].some((c) => l.example.hy.startsWith(c))).toBe(true);
      }
    }
  });
});
