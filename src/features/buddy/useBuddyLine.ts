import { useCallback } from 'react';

import { PHRASES, type PhraseKey } from '@/content/phrases';
import { useSettings } from '@/state/settings';
import { formatBuddyLine, type BuddyVars } from './formatBuddyLine';

export function useBuddyLine() {
  const { buddyLanguage } = useSettings();
  return useCallback((key: PhraseKey, vars?: BuddyVars) => formatBuddyLine(PHRASES[key], buddyLanguage, vars), [buddyLanguage]);
}
