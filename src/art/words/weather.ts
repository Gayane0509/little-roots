import type { ThemeArt } from '../types';

export const art: ThemeArt = {
  rainbow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M8 96 A56 56 0 0 1 120 96 H108 A44 44 0 0 0 20 96 Z" fill="#F25C54"/>
<path d="M20 96 A44 44 0 0 1 108 96 H96 A32 32 0 0 0 32 96 Z" fill="#FFD23F"/>
<path d="M32 96 A32 32 0 0 1 96 96 H84 A20 20 0 0 0 44 96 Z" fill="#7BD389"/>
<path d="M44 96 A20 20 0 0 1 84 96 Z" fill="#7CC6FE"/>
<path d="M2 100 Q2 86 16 88 Q22 78 32 86 Q42 88 38 100 Z" fill="#FFFFFF"/>
<path d="M90 100 Q86 88 96 86 Q106 78 112 88 Q126 86 126 100 Z" fill="#FFFFFF"/>
</g>
</svg>`,
  snow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#7CC6FE" stroke-width="8" stroke-linecap="round">
<line x1="64" y1="12" x2="64" y2="116"/>
<line x1="19" y1="38" x2="109" y2="90"/>
<line x1="19" y1="90" x2="109" y2="38"/>
<path d="M52 20 L64 32 L76 20 M52 108 L64 96 L76 108" fill="none" stroke-width="6"/>
</g>
<circle cx="64" cy="64" r="10" fill="#FFFFFF" stroke="#3A2E39" stroke-width="3"/>
</svg>`,
  wind: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g fill="none" stroke="#7CC6FE" stroke-width="8" stroke-linecap="round">
<path d="M10 44 H78 Q96 44 96 28 Q96 14 82 14 Q70 14 70 26"/>
<path d="M10 68 H104 Q120 68 120 84 Q120 98 106 98 Q94 98 94 86"/>
<path d="M20 92 H62 Q76 92 76 106 Q76 118 64 118"/>
</g>
</svg>`,
  umbrella: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 64 Q12 20 64 20 Q116 20 116 64 Q103 54 90 64 Q77 54 64 64 Q51 54 38 64 Q25 54 12 64 Z" fill="#9B7ED9"/>
<path d="M64 64 V104 Q64 116 52 116 Q42 116 42 106" fill="none" stroke-width="5"/>
<line x1="64" y1="12" x2="64" y2="20"/>
<path d="M24 82 l-4 8 M100 80 l-4 8 M30 102 l-4 8 M96 100 l-4 8" stroke="#4D96FF" stroke-width="4"/>
</g>
</svg>`,
  spring: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<circle cx="64" cy="34" r="22" fill="#FF8FAB"/>
<circle cx="94" cy="56" r="22" fill="#FF8FAB"/>
<circle cx="82" cy="92" r="22" fill="#FF8FAB"/>
<circle cx="46" cy="92" r="22" fill="#FF8FAB"/>
<circle cx="34" cy="56" r="22" fill="#FF8FAB"/>
<circle cx="64" cy="66" r="14" fill="#FFD23F"/>
</g>
</svg>`,
  summer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="6" y="78" width="116" height="16" fill="#7CC6FE"/>
<rect x="6" y="94" width="116" height="26" rx="4" fill="#FFD6A5"/>
<line x1="44" y1="112" x2="80" y2="30" stroke-width="5"/>
<path d="M30 52 Q48 10 108 32 Q86 40 78 62 Q60 44 30 52 Z" fill="#F25C54"/>
<circle cx="104" cy="22" r="12" fill="#FFD23F"/>
</g>
</svg>`,
  autumn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M30 112 Q14 54 70 26 Q112 6 116 14 Q122 22 104 62 Q80 116 30 112 Z" fill="#FF9F43"/>
<path d="M30 112 Q60 72 102 26" fill="none"/>
<path d="M58 78 L44 66 M74 58 L62 44 M66 70 L86 72 M84 48 L100 50" fill="none"/>
<path d="M14 64 Q8 40 30 28 Q38 46 14 64 Z" fill="#F25C54"/>
</g>
</svg>`,
  winter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g stroke="#3A2E39" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<circle cx="64" cy="88" r="30" fill="#FFFFFF"/>
<circle cx="64" cy="42" r="20" fill="#FFFFFF"/>
<rect x="48" y="14" width="32" height="10" rx="3" fill="#3A2E39"/>
<rect x="54" y="4" width="20" height="12" rx="3" fill="#3A2E39"/>
<circle cx="57" cy="38" r="2" fill="#3A2E39"/>
<circle cx="71" cy="38" r="2" fill="#3A2E39"/>
<path d="M64 44 L80 48 L64 50 Z" fill="#FF9F43"/>
<path d="M44 58 Q64 68 84 58 L86 66 Q64 76 42 66 Z" fill="#4D96FF"/>
<circle cx="64" cy="84" r="3" fill="#3A2E39"/>
<circle cx="64" cy="98" r="3" fill="#3A2E39"/>
</g>
</svg>`,
};
