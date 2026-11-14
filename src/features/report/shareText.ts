import type { Word } from '@/content/types';

const MAX_WORDS = 5;

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** A week with no lesson has nothing true to share yet ("0 of 7 days" is not news for the family). */
export function canShareWeek(report: { daysActive: number }): boolean {
  return report.daysActive > 0;
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
  if (newWords.length > 0) {
    const shown = newWords.slice(0, MAX_WORDS).map((w) => `${w.hy} (${w.translit}, ${w.en})`);
    const more = newWords.length - shown.length;
    const list = more > 0 ? `${shown.join(', ')} and ${more} more` : shown.join(', ');
    lines.push(`✨ ${newWords.length} new ${plural(newWords.length, 'word', 'words')}: ${list}`);
  } else if (daysActive > 0) {
    lines.push('✨ Practising words already learned');
  }
  lines.push(`📚 ${totalWords} ${plural(totalWords, 'word', 'words')} so far`);
  if (streakDays > 0) lines.push(`🔥 ${streakDays}-day streak`);
  return lines.join('\n');
}
