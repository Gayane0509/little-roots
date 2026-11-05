import { router } from 'expo-router';

import { BigButton } from '@/ui/BigButton';

/**
 * What a child can still do when today's free games are used up: Letters and the sticker book have no daily limit (#116,
 * #124). Shown before Back and the grey grown-up prompt on every out-of-games screen.
 */
export function FreeActivities() {
  return <>
    <BigButton label="Trace letters" icon="letters" onPress={() => router.push('/letters')} />
    <BigButton label="My stickers" icon="stickers" onPress={() => router.push('/stickers')} />
  </>;
}
