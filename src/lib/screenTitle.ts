const APP = 'Little Roots';

const titles: Record<string, string> = {
  '/': 'Home',
  '/onboarding': 'Welcome',
  '/profiles': "Who's playing?",
  '/lesson': 'Lesson',
  '/letters': 'Letters',
  '/stickers': 'Stickers',
  '/games': 'Games',
  '/games/memory': 'Memory game',
  '/games/find': 'Find game',
  '/games/count': 'Counting game',
  '/games/read': 'Read game',
  '/games/sounds': 'Letter sounds game',
  '/parent-gate': 'Grown-ups check',
  '/parent': 'Grown-ups',
  '/parent/intro': 'Grown-ups guide',
  '/parent/children': 'Children',
  '/parent/report': 'Weekly report',
  '/parent/reminders': 'Reminders',
  '/parent/settings': 'Settings',
  '/parent/voice': 'Family voice',
  '/parent/privacy': 'Privacy',
  '/parent/paywall': 'Full version',
};

/** Browser tab title for a route (web preview only), e.g. "Letters · Little Roots". Unknown routes get the app name. */
export function screenTitle(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const title = titles[path] ?? (path.startsWith('/theme/') ? 'Theme' : undefined);
  return title ? `${title} · ${APP}` : APP;
}
