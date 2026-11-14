// Builds the "family" word picture from the bundled Fluent 3D mom, dad and child (MIT, assets/words/LICENSE), so the
// Family theme shows one 3D style (#143). Fluent has no Light-skin family picture. Re-run after changing the sources:
//   node scripts/compose-family.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../assets/words/family/', import.meta.url);
const href = (name) => `data:image/png;base64,${readFileSync(new URL(`${name}.png`, dir)).toString('base64')}`;

// Grown-ups behind, side by side; the child in front, centred and lower, overlapping both.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512">
  <image xlink:href="${href('dad')}" x="-22" y="-8" width="320" height="320"/>
  <image xlink:href="${href('mom')}" x="214" y="-8" width="320" height="320"/>
  <image xlink:href="${href('child')}" x="111" y="212" width="290" height="290"/>
</svg>`;

const png = new Resvg(svg, { fitTo: { mode: 'width', value: 256 } }).render().asPng();
writeFileSync(new URL('family.png', dir), png);
console.log(`family.png ${png.length} bytes`);
