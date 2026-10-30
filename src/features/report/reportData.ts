import { THEMES } from '@/content/themes';
import { daysBetween, localDay } from '@/lib/date';
import type { ProgressState } from '@/state/progress.types';

export function masteryStars(box: number): number {
  return box <= 0 ? 1 : box <= 2 ? 2 : 3;
}

export function fullReport(state: ProgressState, now: number) {
  const today = localDay(now);
  const themes = THEMES.map((theme) => {
    const words = theme.words.flatMap((word) => {
      const progress = state.words[word.id];
      return progress?.seen > 0 ? [{ word, stars: masteryStars(progress.box) }] : [];
    });
    return { theme, words, seen: words.length, total: theme.words.length, mastery: words.reduce((sum, item) => sum + item.stars, 0) / (theme.words.length * 3) };
  });
  const weeks = Array.from({ length: 8 }, (_, index) => {
    const ageStart = (7 - index) * 7;
    const ids = new Set(state.lessons.filter((lesson) => {
      const age = daysBetween(lesson.day, today);
      return age >= ageStart && age < ageStart + 7;
    }).flatMap((lesson) => lesson.newWordIds));
    return { label: index === 7 ? 'Last 7 days' : `${7 - index} ${7 - index === 1 ? 'week' : 'weeks'} ago`, count: ids.size };
  });
  return { themes, weeks, seenTotal: themes.reduce((sum, theme) => sum + theme.seen, 0) };
}
