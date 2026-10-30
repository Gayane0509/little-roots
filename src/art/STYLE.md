# Little Roots illustration style

Every word picture is a hand-written SVG string so it is free, offline and crisp at any size.

- `viewBox="0 0 128 128"`, no width/height attributes, **transparent background** (the UI draws the tile).
- Subject centred, filling ~80% of the box, 8px safe margin.
- Flat shapes, no gradients, no filters, no text, no `<style>`/CSS classes, no external refs. Allowed elements:
  `g, path, circle, ellipse, rect, line, polyline, polygon`. Attributes only (`fill`, `stroke`, `stroke-width`,
  `stroke-linecap`, `stroke-linejoin`, `transform`, `opacity`, `rx`, `ry`, `d`, points, coordinates).
- Outline: `stroke="#3A2E39"` `stroke-width="3"` `stroke-linejoin="round"` `stroke-linecap="round"` on main shapes.
- One soft highlight (white, opacity 0.35–0.5) on rounded objects for depth.
- Friendly faces where natural (people, animals, food, toys, sun/moon/cloud): two dot eyes `r=3.5` fill `#3A2E39`,
  small curved smile, optional pink cheeks `#FF9EAA` opacity 0.6.
- People share one look: skin `#F6C9A0` (outline same), rounded heads; distinguish by hair/clothes/age cues
  (grandma: grey bun + glasses; grandpa: grey hair + moustache; child/baby smaller).

Palette (prefer these):
  ink `#3A2E39` · white `#FFFFFF` · cream `#FFF3DC` · red `#F25C54` · orange `#FF9F43` · yellow `#FFD23F`
  · green `#4CC985` · dark green `#2F9E57` · blue `#4DA3FF` · navy `#2F5DA8` · purple `#9B6BFF` · pink `#FF8FB1`
  · brown `#A0582F` · light brown `#D9965B` · grey `#B8BCC6` · skin `#F6C9A0` · cheeks `#FF9EAA`
Colors theme: the picture must clearly be that colour (e.g. a paint blob or crayon in that colour).
Numbers theme: a big friendly numeral plus that many dots/items, readable at 56px.
