import type { ArtXml } from './types';

/**
 * Soft scene backdrops drawn behind a screen's bottom edge (Home, lesson reward). Same flat style as the word art, but
 * no outlines and only pale tints so they stay quiet behind cards and text (`colors.text` keeps ≥ 4.5:1 on every fill).
 * Wide viewBox; drawn with `xMidYMax slice`, so the top may crop on tablets and nothing important sits above y = 24.
 */
export const SCENES = {
  hills: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
  <g fill="#FFFFFF">
    <ellipse cx="140" cy="30" rx="22" ry="9"/>
    <ellipse cx="158" cy="24" rx="14" ry="10"/>
    <ellipse cx="124" cy="27" rx="10" ry="7"/>
  </g>
  <path d="M0 70 C60 42 130 44 190 62 C250 80 320 42 400 54 L400 120 L0 120 Z" fill="#EAF6DC"/>
  <rect x="316" y="44" width="8" height="16" rx="3" fill="#EAD7C2"/>
  <circle cx="320" cy="38" r="14" fill="#CFE9B6"/>
  <circle cx="314" cy="34" r="4" fill="#FFFFFF" opacity="0.4"/>
  <path d="M0 92 C70 72 150 76 220 90 C290 104 350 80 400 84 L400 120 L0 120 Z" fill="#D8F0C4"/>
  <ellipse cx="72" cy="84" rx="18" ry="9" fill="#CFE9B6"/>
  <ellipse cx="86" cy="80" rx="11" ry="8" fill="#CFE9B6"/>
  <g fill="#FFD0DC">
    <circle cx="40" cy="106" r="4"/>
    <circle cx="112" cy="100" r="4"/>
    <circle cx="252" cy="106" r="4"/>
    <circle cx="362" cy="96" r="4"/>
  </g>
  <g fill="#FFE8A0">
    <circle cx="40" cy="106" r="1.6"/>
    <circle cx="112" cy="100" r="1.6"/>
    <circle cx="252" cy="106" r="1.6"/>
    <circle cx="362" cy="96" r="1.6"/>
  </g>
  <g fill="#C3E3A6">
    <ellipse cx="180" cy="110" rx="5" ry="2"/>
    <ellipse cx="300" cy="112" rx="5" ry="2"/>
  </g>
</svg>`,
} as const satisfies Record<string, ArtXml>;

export type SceneName = keyof typeof SCENES;
