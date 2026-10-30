/** Four small, self-contained portraits of Արջուկ. */
const outline = 'stroke="#3A2E39" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const ear = (x: number) => `<circle cx="${x}" cy="36" r="17" fill="#A0582F" ${outline}/><circle cx="${x}" cy="36" r="9" fill="#D9965B"/>`;
const face = (mood: 'happy' | 'cheer' | 'think' | 'sleep') => {
  const eyes = mood === 'sleep'
    ? '<path d="M43 66 Q49 71 55 66 M73 66 Q79 71 85 66" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
    : mood === 'think'
      ? '<circle cx="50" cy="63" r="3.5" fill="#3A2E39"/><circle cx="78" cy="59" r="3.5" fill="#3A2E39"/>'
      : '<circle cx="49" cy="65" r="3.5" fill="#3A2E39"/><circle cx="79" cy="65" r="3.5" fill="#3A2E39"/>';
  const mouth = mood === 'cheer'
    ? `<ellipse cx="64" cy="86" rx="9" ry="10" fill="#F25C54" ${outline}/>`
    : mood === 'sleep'
      ? '<path d="M59 85 Q64 89 69 85" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
      : '<path d="M54 84 Q64 95 74 84" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>';
  return `<ellipse cx="64" cy="79" rx="23" ry="16" fill="#FFF3DC"/>${eyes}<circle cx="39" cy="78" r="6" fill="#FF9EAA" opacity="0.65"/><circle cx="89" cy="78" r="6" fill="#FF9EAA" opacity="0.65"/><path d="M59 76 Q64 72 69 76 Q68 82 64 82 Q60 82 59 76Z" fill="#3A2E39"/>${mouth}${mood === 'think' ? `<ellipse cx="83" cy="91" rx="8" ry="7" fill="#A0582F" ${outline}/>` : ''}`;
};
function bear(mood: 'happy' | 'cheer' | 'think' | 'sleep'): string {
  const arms = mood === 'cheer'
    ? `<path d="M41 103 Q22 96 16 78 Q12 71 20 69 Q27 66 30 76 L46 88 M87 103 Q106 96 112 78 Q116 71 108 69 Q101 66 98 76 L82 88" fill="#A0582F" ${outline}/>`
    : mood === 'think'
      ? `<path d="M39 102 Q30 100 33 91 Q36 84 48 86 M89 102 Q94 90 83 80 Q78 76 75 82 L71 89" fill="#A0582F" ${outline}/>`
      : `<path d="M40 99 Q27 100 24 92 Q22 84 29 82 Q35 80 43 87 M88 99 Q101 100 104 92 Q106 84 99 82 Q93 80 85 87" fill="#A0582F" ${outline}/>`;
  const extras = mood === 'cheer'
    ? '<path d="M14 47 l5 -6 M109 47 l5 -6" fill="none" stroke="#4DA3FF" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="59" r="3" fill="#FFD23F"/><circle cx="110" cy="60" r="3" fill="#FF8FB1"/>'
    : mood === 'think'
      ? '<path d="M106 27 Q107 17 113 18 Q121 19 118 26 Q117 29 113 31 M113 37 L113 38" fill="none" stroke="#9B6BFF" stroke-width="3" stroke-linecap="round"/>'
      : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${extras}<ellipse cx="64" cy="103" rx="28" ry="22" fill="#A0582F" ${outline}/>${arms}${ear(34)}${ear(94)}<circle cx="64" cy="65" r="43" fill="#A0582F" ${outline}/><ellipse cx="46" cy="38" rx="10" ry="5" fill="#FFFFFF" opacity="0.25" transform="rotate(-22 46 38)"/>${face(mood)}<path d="M48 105 Q64 115 80 105 L77 114 Q64 119 51 114Z" fill="#FF8C42" ${outline}/><path d="M76 111 L85 120 L78 121 L72 115" fill="#FF8C42" ${outline}/></svg>`;
}
export const BUDDY_ART: Record<'happy' | 'cheer' | 'think' | 'sleep', string> = {
  happy: bear('happy'), cheer: bear('cheer'), think: bear('think'), sleep: bear('sleep'),
};
