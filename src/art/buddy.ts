/** Small, self-contained portraits of Արջուկ, one per mood. */
export type BuddyMood = 'happy' | 'cheer' | 'think' | 'sleep' | 'wave' | 'point' | 'proud';

const outline = 'stroke="#3A2E39" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

/**
 * 3D look (#155) from stacked flat tones, not gradients: gradient ids would clash between the many Buddy
 * instances on one web page. Shade rim → fur → lit face; the lit circle covers every open eye, so the blink
 * lids use that same tone and match exactly.
 */
const FUR_SHADE = '#874621';
const FUR = '#A0582F';
export const BUDDY_FUR_LIT = '#B06637';
const furOutline = 'stroke="#5C3018" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const ear = (x: number) => `<circle cx="${x}" cy="36" r="17" fill="${FUR_SHADE}" ${furOutline}/><circle cx="${x - 1}" cy="35" r="13" fill="${FUR}"/><circle cx="${x}" cy="37" r="9" fill="#C27B45"/><circle cx="${x - 1}" cy="35.5" r="6.5" fill="#D9965B"/>`;

/** Where the open eyes sit; moods missing here have closed or uneven eyes and never blink. */
const OPEN_EYES: Partial<Record<BuddyMood, readonly [number, number]>> = {
  happy: [49, 79], cheer: [49, 79], wave: [49, 79], point: [52, 82],
};
const EYE_Y = 65;

function star(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `<polygon points="${points.join(' ')}" fill="#FFD23F" stroke="#3A2E39" stroke-width="2" stroke-linejoin="round"/>`;
}

const face = (mood: BuddyMood) => {
  const open = OPEN_EYES[mood];
  const eye = (x: number) => `<circle cx="${x}" cy="${EYE_Y}" r="3.5" fill="#3A2E39"/><circle cx="${x + 1.2}" cy="${EYE_Y - 1.3}" r="1.2" fill="#FFFFFF"/>`;
  const eyes = open
    ? `${eye(open[0])}${eye(open[1])}`
    : mood === 'sleep'
      ? '<path d="M43 66 Q49 71 55 66 M73 66 Q79 71 85 66" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
      : mood === 'proud'
        ? '<path d="M43 67 Q49 60 55 67 M73 67 Q79 60 85 67" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
        : '<circle cx="50" cy="63" r="3.5" fill="#3A2E39"/><circle cx="78" cy="59" r="3.5" fill="#3A2E39"/>';
  const mouth = mood === 'cheer' || mood === 'wave'
    ? `<ellipse cx="64" cy="86" rx="9" ry="10" fill="#F25C54" ${outline}/>`
    : mood === 'sleep'
      ? '<path d="M59 85 Q64 89 69 85" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
      : mood === 'proud'
        ? '<path d="M52 83 Q64 98 76 83" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>'
        : '<path d="M54 84 Q64 95 74 84" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>';
  return `<ellipse cx="64" cy="79" rx="23" ry="16" fill="#EBD3AE"/><ellipse cx="64" cy="77" rx="21" ry="13.5" fill="#FFF3DC"/>${eyes}<circle cx="39" cy="78" r="6" fill="#FF9EAA" opacity="0.65"/><circle cx="89" cy="78" r="6" fill="#FF9EAA" opacity="0.65"/><path d="M59 76 Q64 72 69 76 Q68 82 64 82 Q60 82 59 76Z" fill="#3A2E39"/><ellipse cx="62.5" cy="75.8" rx="2.2" ry="1.1" fill="#FFFFFF" opacity="0.55"/>${mouth}${mood === 'think' ? `<ellipse cx="83" cy="91" rx="8" ry="7" fill="${FUR}" ${furOutline}/><ellipse cx="81.5" cy="89.5" rx="4" ry="3" fill="${BUDDY_FUR_LIT}"/>` : ''}`;
};

/** A soft white sheen along a rounded edge (arms, outfit items), part of the 3D look (#177). */
const shine = (d: string, opacity = 0.35) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="${opacity}"/>`;

const LEFT_ARM_SHINE = 'M23 93 Q22 88 25 86';
const RIGHT_ARM_SHINE = 'M105 93 Q106 88 103 86';
const ARM_SHINE: Record<BuddyMood, string> = {
  happy: `${LEFT_ARM_SHINE} ${RIGHT_ARM_SHINE}`,
  sleep: `${LEFT_ARM_SHINE} ${RIGHT_ARM_SHINE}`,
  proud: `${LEFT_ARM_SHINE} ${RIGHT_ARM_SHINE}`,
  cheer: 'M21 72 Q25 70 27 76 M107 72 Q103 70 101 76',
  think: 'M36 90 Q39 87 44 87',
  wave: `${LEFT_ARM_SHINE} M112 59 Q114 55 118 57`,
  point: `${LEFT_ARM_SHINE} M100 94 Q108 92 115 95`,
};

const LEFT_ARM_REST = 'M40 99 Q27 100 24 92 Q22 84 29 82 Q35 80 43 87';
const RIGHT_ARM_REST = 'M88 99 Q101 100 104 92 Q106 84 99 82 Q93 80 85 87';

function bear(mood: BuddyMood): string {
  const arms = mood === 'cheer'
    ? `<path d="M41 103 Q22 96 16 78 Q12 71 20 69 Q27 66 30 76 L46 88 M87 103 Q106 96 112 78 Q116 71 108 69 Q101 66 98 76 L82 88" fill="${FUR}" ${furOutline}/>`
    : mood === 'think'
      ? `<path d="M39 102 Q30 100 33 91 Q36 84 48 86 M89 102 Q94 90 83 80 Q78 76 75 82 L71 89" fill="${FUR}" ${furOutline}/>`
      : mood === 'wave'
        ? `<path d="${LEFT_ARM_REST} M90 100 Q108 88 108 64 Q107 52 115 52 Q123 53 121 64 Q118 92 92 104" fill="${FUR}" ${furOutline}/>`
        : mood === 'point'
          ? `<ellipse cx="121.5" cy="96.5" rx="4.5" ry="3.2" fill="${FUR}" ${furOutline}/><path d="${LEFT_ARM_REST} M86 96 Q100 90 113 92 Q122 93 121 100 Q120 106 111 105 Q98 105 88 104" fill="${FUR}" ${furOutline}/>`
          : `<path d="${LEFT_ARM_REST} ${RIGHT_ARM_REST}" fill="${FUR}" ${furOutline}/>`;
  const sheen = shine(ARM_SHINE[mood], 0.3);
  const extras = mood === 'cheer'
    ? '<path d="M14 47 l5 -6 M109 47 l5 -6" fill="none" stroke="#4DA3FF" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="59" r="3" fill="#FFD23F"/><circle cx="110" cy="60" r="3" fill="#FF8FB1"/>'
    : mood === 'think'
      ? '<path d="M106 27 Q107 17 113 18 Q121 19 118 26 Q117 29 113 31 M113 37 L113 38" fill="none" stroke="#9B6BFF" stroke-width="3" stroke-linecap="round"/>'
      : mood === 'wave'
        ? '<path d="M110 40 Q112 34 118 33 M122 42 Q126 38 126 32" fill="none" stroke="#4DA3FF" stroke-width="3" stroke-linecap="round"/>'
        : mood === 'proud'
          ? `${star(14, 30, 9)}${star(116, 20, 7)}<circle cx="20" cy="58" r="3" fill="#FF8FB1"/>`
          : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${extras}<ellipse cx="64" cy="124" rx="30" ry="3.5" fill="#3A2E39" opacity="0.12"/><ellipse cx="64" cy="103" rx="28" ry="22" fill="${FUR_SHADE}" ${furOutline}/><ellipse cx="62" cy="101" rx="23" ry="18" fill="${FUR}"/><ellipse cx="62" cy="101" rx="15" ry="12" fill="${BUDDY_FUR_LIT}"/>${arms}${sheen}${ear(34)}${ear(94)}<circle cx="64" cy="65" r="43" fill="${FUR_SHADE}" ${furOutline}/><circle cx="62" cy="62" r="36" fill="${FUR}"/><circle cx="60" cy="60" r="30" fill="${BUDDY_FUR_LIT}"/><ellipse cx="46" cy="40" rx="11" ry="5.5" fill="#FFFFFF" opacity="0.35" transform="rotate(-24 46 40)"/>${face(mood)}<path d="M48 105 Q64 115 80 105 L77 114 Q64 119 51 114Z" fill="#FF8C42" ${outline}/><path d="M76 111 L85 120 L78 121 L72 115" fill="#FF8C42" ${outline}/></svg>`;
}

/** Closed-eye lids drawn over the open eyes (fur-coloured patch + a curved line); shown for a moment to blink. */
function lids(mood: BuddyMood): string | undefined {
  const open = OPEN_EYES[mood];
  if (!open) return undefined;
  const lid = (x: number) => `<circle cx="${x}" cy="${EYE_Y}" r="5.5" fill="${BUDDY_FUR_LIT}"/><path d="M${x - 5} ${EYE_Y} Q${x} ${EYE_Y + 4} ${x + 5} ${EYE_Y}" fill="none" stroke="#3A2E39" stroke-width="3" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${lid(open[0])}${lid(open[1])}</svg>`;
}

export const BUDDY_MOODS: readonly BuddyMood[] = ['happy', 'cheer', 'think', 'sleep', 'wave', 'point', 'proud'];

export const BUDDY_ART = Object.fromEntries(BUDDY_MOODS.map((mood) => [mood, bear(mood)])) as Record<BuddyMood, string>;

/** Blink overlays for moods with open eyes. */
export const BUDDY_BLINK = Object.fromEntries(
  BUDDY_MOODS.flatMap((mood) => { const xml = lids(mood); return xml ? [[mood, xml] as const] : []; }),
) as Partial<Record<BuddyMood, string>>;

/** Dress-up items a child earns with stickers (#58). The base bear already wears an orange scarf, so no scarf. */
export type BuddyOutfit = 'hat' | 'glasses' | 'crown';
export const BUDDY_OUTFITS: readonly BuddyOutfit[] = ['hat', 'glasses', 'crown'];

/** Where the glasses sit: over the open eyes, or the usual eye line for closed/uneven eyes. */
function eyeLine(mood: BuddyMood): readonly [number, number] {
  return OPEN_EYES[mood] ?? [49, 79];
}

function outfit(item: BuddyOutfit, mood: BuddyMood): string {
  if (item === 'hat') {
    // A striped party hat resting on top of the head, between the ears.
    return `<path d="M50 29 L64 6 L78 29 Q64 34 50 29Z" fill="#4DA3FF" ${outline}/><path d="M56 20 Q64 23 72 20 M60 13 Q64 15 68 13" fill="none" stroke="#FFD23F" stroke-width="3" stroke-linecap="round"/>${shine('M55 26 L61 15')}<circle cx="64" cy="7" r="5" fill="#FF8FB1" ${outline}/>`;
  }
  if (item === 'glasses') {
    const [left, right] = eyeLine(mood);
    const frame = (x: number) => `<circle cx="${x}" cy="${EYE_Y}" r="10" fill="#FFFFFF" fill-opacity="0.18" stroke="#9B6BFF" stroke-width="3.5"/>${shine(`M${x - 6} ${EYE_Y - 2} Q${x - 5} ${EYE_Y - 5} ${x - 2} ${EYE_Y - 6}`, 0.6)}`;
    return `${frame(left)}${frame(right)}<path d="M${left + 10} ${EYE_Y - 1} Q64 ${EYE_Y - 5} ${right - 10} ${EYE_Y - 1}" fill="none" stroke="#9B6BFF" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  // A small golden crown with three gems.
  return `<path d="M46 29 L44 9 L54 18 L64 5 L74 18 L84 9 L82 29 Q64 34 46 29Z" fill="#FFD23F" ${outline}/>${shine('M49 26 L48 16')}<circle cx="54" cy="25" r="2.8" fill="#F25C54"/><circle cx="64" cy="26" r="2.8" fill="#4DA3FF"/><circle cx="74" cy="25" r="2.8" fill="#4CC985"/>`;
}

/** Outfit overlays, drawn above Buddy (and above the blink lids so glasses stay on during a blink). */
export const BUDDY_OUTFIT_ART = Object.fromEntries(BUDDY_OUTFITS.map((item) => [item, Object.fromEntries(
  BUDDY_MOODS.map((mood) => [mood, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${outfit(item, mood)}</svg>`]),
)])) as Record<BuddyOutfit, Record<BuddyMood, string>>;
