import { describe, expect, it } from '@jest/globals';
import { escapeHtml, PRINT_MAX_WORDS, printWordIds, weeklyPrintHtml } from './printSheet';

describe('printWordIds', () => {
  it("prints this week's new words", () => {
    expect(printWordIds({ newWordIds: ['a', 'b'], practiceWordIds: ['c'] })).toEqual(['a', 'b']);
  });

  it('falls back to practice words in a week without new words', () => {
    expect(printWordIds({ newWordIds: [], practiceWordIds: ['c', 'd'] })).toEqual(['c', 'd']);
  });

  it('caps the sheet at one page', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `w${i}`);
    expect(printWordIds({ newWordIds: ids, practiceWordIds: [] })).toHaveLength(PRINT_MAX_WORDS);
  });

  it('is empty when there is nothing to print', () => {
    expect(printWordIds({ newWordIds: [], practiceWordIds: [] })).toEqual([]);
  });
});

describe('weeklyPrintHtml', () => {
  it('escapes names and words', () => {
    expect(escapeHtml(`<b>"Ani" & 'Aram'</b>`)).toBe('&lt;b&gt;&quot;Ani&quot; &amp; &#39;Aram&#39;&lt;/b&gt;');
    const html = weeklyPrintHtml({ childName: '<script>x</script>', words: [{ hy: 'մամա', translit: 'mama', en: 'mom & me', picture: { kind: 'emoji', text: '👩' } }] });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('mom &amp; me');
  });

  it('renders every word with its Armenian spelling and picture', () => {
    const html = weeklyPrintHtml({
      childName: 'Ani',
      words: [
        { hy: 'շուն', translit: 'shun', en: 'dog', picture: { kind: 'img', src: 'data:image/png;base64,AAA=' } },
        { hy: 'կարմիր', translit: 'karmir', en: 'red', picture: { kind: 'svg', xml: '<svg viewBox="0 0 1 1"></svg>' } },
      ],
    });
    expect(html.match(/class="card"/g)).toHaveLength(2);
    expect(html).toContain('<div class="hy" lang="hy">շուն</div>');
    expect(html).toContain('<img src="data:image/png;base64,AAA=" alt="">');
    expect(html).toContain('<svg viewBox="0 0 1 1"></svg>');
    expect(html).toContain("Ani's words this week");
  });
});
