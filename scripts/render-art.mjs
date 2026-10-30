// Renders every word illustration to a labelled contact sheet for visual QA:
//   node scripts/render-art.mjs <theme> [out.png]
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const [theme, out = `art-${theme}.png`] = process.argv.slice(2);
const src = readFileSync(new URL(`../src/art/words/${theme}.ts`, import.meta.url), 'utf8');
// Theme files are plain `slug: \`<svg ...>\`` entries; evaluate the object literal.
const body = src.slice(src.indexOf('{', src.indexOf('art')), src.lastIndexOf('}') + 1);
const art = Function(`return (${body});`)();
const names = Object.keys(art);
const cell = 200;
const cols = 4;
const rows = Math.ceil(names.length / cols);
const tiles = names
  .map((name, i) => {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * cell;
    const inner = art[name].replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<g transform="translate(${x} ${y})"><rect x="6" y="6" width="${cell - 12}" height="${cell - 12}" rx="24" fill="#FFF8EE" stroke="#F0E3D0" stroke-width="3"/>
      <g transform="translate(36 20) scale(1)"><svg x="0" y="0" width="128" height="128" viewBox="0 0 128 128">${inner}</svg></g>
      <text x="${cell / 2}" y="${cell - 22}" font-family="Helvetica" font-size="18" text-anchor="middle" fill="#3A2E39">${name}</text></g>`;
  })
  .join('');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${rows * cell}"><rect width="100%" height="100%" fill="#FFFFFF"/>${tiles}</svg>`;
writeFileSync(out, new Resvg(sheet, { font: { loadSystemFonts: true } }).render().asPng());
console.log(`${names.length} pictures → ${out}`);
