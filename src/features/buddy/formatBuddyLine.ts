import type { Phrase } from '@/content/packs';

export type BuddyVars = Record<string, string | number | undefined>;

const fill = (text: string, vars: BuddyVars) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] === undefined ? '' : String(vars[k])));

export function formatBuddyLine(phrase: Phrase, lang: 'en' | 'hy', vars: BuddyVars = {}): string {
  const en = fill(phrase.en, vars);
  return lang === 'hy' ? `${fill(phrase.hy, vars)}\n${en}` : en;
}
