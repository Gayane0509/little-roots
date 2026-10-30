import type { Word } from '@/content/types';

const MAX_WORDS = 5;

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

export function weeklyShareText(input: {
  childName: string;
  daysActive: number;
  newWords: Word[];
  totalWords: number;
  streakDays: number;
}): string {
  const { childName, daysActive, newWords, totalWords, streakDays } = input;
  const lines = [`${childName}'s week in Armenian with Little Roots 🌱`, `📅 ${daysActive} of 7 days`];
  if (newWords.length === 0) {
    lines.push('✨ Practising words already learned');
  } else {
    const shown = newWords.slice(0, MAX_WORDS).map((w) => `${w.hy} (${w.translit}, ${w.en})`);
    const more = newWords.length - shown.length;
    const list = more > 0 ? `${shown.join(', ')} and ${more} more` : shown.join(', ');
    lines.push(`✨ ${newWords.length} new ${plural(newWords.length, 'word', 'words')}: ${list}`);
  }
  lines.push(`📚 ${totalWords} ${plural(totalWords, 'word', 'words')} so far`);
  if (streakDays > 0) lines.push(`🔥 ${streakDays}-day streak`);
  return lines.join('\n');
}
