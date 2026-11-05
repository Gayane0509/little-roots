import type { AvatarWordId } from '@/state/profiles';

import type { ArtXml } from './types';

/**
 * Profile pictures that differ from the word illustration. The "child" word picture is a small full-body figure (right for
 * the word), but as an avatar its face came out half the size of the brother and sister portraits, so the first,
 * preselected choice looked weakest (#111). Avatars without an entry use their word picture.
 */
export const AVATAR_PORTRAITS: Partial<Record<AvatarWordId, ArtXml>> = {
  'family.child': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M28 122 Q28 90 64 90 Q100 90 100 122 Z" fill="#4CC985" stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M52 90 Q64 100 76 90" fill="#F6C9A0" stroke="#3A2E39" stroke-width="3" stroke-linejoin="round"/>
<path d="M52 104 L58 98 L64 104 L70 98 L76 104" fill="none" stroke="#2F9E57" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="38" cy="60" r="6" fill="#F6C9A0" stroke="#3A2E39" stroke-width="3"/><circle cx="90" cy="60" r="6" fill="#F6C9A0" stroke="#3A2E39" stroke-width="3"/>
<circle cx="64" cy="58" r="26" fill="#F6C9A0" stroke="#3A2E39" stroke-width="3" stroke-linejoin="round"/>
<path d="M38 54 Q38 26 64 26 Q90 26 90 54 Q80 46 70 38 Q58 48 38 54 Z" fill="#5A3A2A" stroke="#3A2E39" stroke-width="3" stroke-linejoin="round"/>
<circle cx="54" cy="60" r="3.5" fill="#3A2E39"/><circle cx="74" cy="60" r="3.5" fill="#3A2E39"/>
<circle cx="48" cy="69" r="4.5" fill="#FF9EAA" opacity="0.6"/><circle cx="80" cy="69" r="4.5" fill="#FF9EAA" opacity="0.6"/>
<path d="M56 69 Q64 77 72 69" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>
<path d="M50 34 Q56 30 62 30" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
</svg>`,
};
