# Vante Ribbon Hero — Experiment 003 (v2)

A single full-screen hero on pure black, after the MotionSites "Video
Ribbon" (vante-ribbon-hero) design: a giant condensed headline — SITES IN /
MOTION — orbited by a **closed cylinder carousel** of project thumbnails.

**V2 (2026-11-11)** — rebuilt after a close second study of the reference
recording. What changed vs v1: the strip is not a wavy ribbon, it is a ring
of tiles wrapped around a vertical cylinder, rotating continuously (front
face travelling right-to-left). Perspective does the show: tiles swell as
they round the front (~1/3 of the screen at the close pass) and foreshorten
to slivers at the sides. The headline NEVER moves — it is only covered by
the front pass or faded. One ~14-second loop:

close pass (ring big and centred, fast, headline faded) → ring shrinks and
drops into a thin ghosted strip low under the headline (calm headline
moment) → six tiles fly into a flat 3×2 grid and hold ~4.5s → fly out →
loop. The grid six alternate between the two halves of the set each loop.

**Our addition:** in the grid state the tiles are accessible — hover lifts
a tile, click opens it full-screen (the show pauses) — and dragging spins
the ring. The reference preview is a recording and shows neither; both felt
like what the design is for.

The headline opacity and the showreel scrub bar are driven from the same
timeline object the WebGL loop writes each frame — no React re-renders.

**Stack:** React + TypeScript + Vite, Tailwind v4, Three.js via React Three
Fiber (tiles on a parametric cylinder, facing outward; grid morphs by
lerping position/quaternion/scale per tile), Framer Motion for chrome and
the tile overlay. Type: Anton (condensed display) + Inter. Tiles: 10
picsum photos + 2 graphic cards drawn on canvas at runtime.

**Run the source** (in [`../source/vante-ribbon-hero/`](../source/vante-ribbon-hero/)):
`npm install && npm run dev` — build with `npm run build`.
Add `?t=<seconds>` to pin the loop at one moment.

Direction studied from the MotionSites preview (reference only — rebuilt
from observation, all wording original).
