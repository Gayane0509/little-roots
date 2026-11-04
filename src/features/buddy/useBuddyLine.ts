import { useCallback } from 'react';

import { ACTIVE_PACK, type PhraseKey } from '@/content/packs';
import { useSettings } from '@/state/settings';
import { formatBuddyLine, type BuddyVars } from './formatBuddyLine';

export function useBuddyLine() {
  const { buddyLanguage } = useSettings();
  return useCallback((key: PhraseKey, vars?: BuddyVars) => formatBuddyLine(ACTIVE_PACK.phrases[key], buddyLanguage, vars), [buddyLanguage]);
}
