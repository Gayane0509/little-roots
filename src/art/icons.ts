import type { ArtXml } from './types';

/** UI icons drawn in the word-art style (STYLE.md), so they look the same on every platform. */
export type IconName = 'letters' | 'stickers' | 'games' | 'lock' | 'flame' | 'memory' | 'find' | 'read' | 'sprout' | 'voice';

export const ICONS: Record<IconName, ArtXml> = {
  // Two alphabet blocks; the yellow one carries the first Armenian letter's shape (Ա).
  letters: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="56" width="56" height="56" rx="10" fill="#4DA3FF"/>
<rect x="60" y="18" width="56" height="56" rx="10" fill="#FFD23F"/>
</g>
<path d="M27 98 L40 68 L53 98 M32 88 H48" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M76 32 V50 A12 12 0 0 0 100 50 V32 M100 50 V62" fill="none" stroke="#3A2E39" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M68 26 Q74 22 82 22" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
</svg>`,
  // A smiling star sticker with a peeled corner.
  stickers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<polygon points="64,10 79,44 116,47 88,71 97,108 64,89 31,108 40,71 12,47 49,44" fill="#FFD23F"/>
</g>
<circle cx="53" cy="62" r="3.5" fill="#3A2E39"/>
<circle cx="75" cy="62" r="3.5" fill="#3A2E39"/>
<path d="M56 72 Q64 79 72 72" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>
<circle cx="47" cy="71" r="4" fill="#FF9EAA" opacity="0.6"/>
<circle cx="81" cy="71" r="4" fill="#FF9EAA" opacity="0.6"/>
<path d="M50 40 Q56 30 62 26" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
</svg>`,
  // A friendly game controller.
  games: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M30 40 H98 A24 24 0 0 1 120 66 L114 92 A14 14 0 0 1 90 98 L80 86 H48 L38 98 A14 14 0 0 1 14 92 L8 66 A24 24 0 0 1 30 40 Z" fill="#9B6BFF"/>
<rect x="30" y="56" width="8" height="24" rx="2" fill="#FFFFFF"/>
<rect x="22" y="64" width="24" height="8" rx="2" fill="#FFFFFF"/>
<circle cx="88" cy="60" r="7" fill="#F25C54"/>
<circle cx="100" cy="74" r="7" fill="#4CC985"/>
</g>
<path d="M30 48 Q40 44 54 44" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
</svg>`,
  // A soft padlock for locked themes.
  lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M40 58 V42 A24 24 0 0 1 88 42 V58" fill="none" stroke-width="12"/>
<path d="M40 58 V42 A24 24 0 0 1 88 42 V58" fill="none" stroke="#B8BCC6" stroke-width="6"/>
<rect x="24" y="56" width="80" height="60" rx="14" fill="#FF9F43"/>
<circle cx="64" cy="80" r="8" fill="#3A2E39"/>
<rect x="60" y="82" width="8" height="18" rx="4" fill="#3A2E39"/>
</g>
<path d="M34 68 Q38 62 46 62" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
</svg>`,
  // Streak flame with a warm inner flame.
  flame: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M64 10 C70 34 98 46 98 80 A34 34 0 0 1 30 80 C30 62 40 54 46 44 C48 56 54 60 58 62 C56 44 58 26 64 10 Z" fill="#FF9F43"/>
<path d="M64 62 C68 74 82 80 82 94 A18 18 0 0 1 46 94 C46 84 54 78 58 70 C60 76 62 78 64 62 Z" fill="#FFD23F"/>
</g>
<path d="M44 74 Q42 86 48 96" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
</svg>`,
  // Two memory cards, one face down, one showing a heart.
  memory: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="26" width="54" height="76" rx="10" fill="#4DA3FF" transform="rotate(-10 41 64)"/>
<rect x="60" y="22" width="54" height="76" rx="10" fill="#FFFFFF" transform="rotate(8 87 60)"/>
<path d="M87 76 C70 64 72 50 80 48 C84 47 87 50 87 53 C87 50 90 47 94 48 C102 50 104 64 87 76 Z" fill="#F25C54"/>
</g>
<circle cx="41" cy="64" r="10" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.6"/>
</svg>`,
  // A magnifying glass.
  find: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="78" y="76" width="16" height="44" rx="8" fill="#A0582F" transform="rotate(-45 86 98)"/>
<circle cx="54" cy="54" r="38" fill="#FF9F43"/>
<circle cx="54" cy="54" r="26" fill="#CFE8FF"/>
</g>
<path d="M38 46 Q42 34 54 32" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
</svg>`,
  // An open book.
  read: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M64 34 C50 24 28 24 12 30 V100 C28 94 50 94 64 104 Z" fill="#4CC985"/>
<path d="M64 34 C78 24 100 24 116 30 V100 C100 94 78 94 64 104 Z" fill="#4CC985"/>
<path d="M64 38 C52 30 34 30 20 34 V94 C34 90 52 90 64 98 Z" fill="#FFFFFF"/>
<path d="M64 38 C76 30 94 30 108 34 V94 C94 90 76 90 64 98 Z" fill="#FFFFFF"/>
<line x1="64" y1="38" x2="64" y2="98"/>
</g>
<g stroke="#B8BCC6" stroke-width="4" stroke-linecap="round">
<line x1="30" y1="50" x2="54" y2="48"/><line x1="30" y1="62" x2="54" y2="60"/><line x1="30" y1="74" x2="48" y2="73"/>
<line x1="74" y1="48" x2="98" y2="50"/><line x1="74" y1="60" x2="98" y2="62"/><line x1="74" y1="73" x2="92" y2="74"/>
</g>
</svg>`,
  // A little sprout (the app's "roots" mark): the back of a memory card.
  sprout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M64 108 V62" fill="none" stroke-width="5"/>
<path d="M64 74 C44 76 28 64 26 42 C46 40 62 52 64 74 Z" fill="#4CC985"/>
<path d="M64 62 C66 40 82 26 104 28 C104 50 88 62 64 62 Z" fill="#7BDDA3"/>
<path d="M36 108 Q64 96 92 108 Z" fill="#C98B5A"/>
</g>
<path d="M36 48 Q44 52 52 62" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
<path d="M94 36 Q84 42 76 52" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
</svg>`,
  // Family voice: a heart with two sound waves (plays a grown-up's recording of the word).
  voice: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M52 104 C20 82 10 64 14 46 C18 30 38 24 52 40 C66 24 86 30 90 46 C94 64 84 82 52 104 Z" fill="#FF7A8A"/>
</g>
<path d="M98 44 Q108 62 98 80" fill="none" stroke="#4DA3FF" stroke-width="7" stroke-linecap="round"/>
<path d="M108 30 Q126 62 108 94" fill="none" stroke="#4DA3FF" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
<path d="M28 42 Q34 36 42 38" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
</svg>`,
};
