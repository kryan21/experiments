# Vante Ribbon Hero — Experiment 003

A single full-screen hero on pure black, after the MotionSites "Video
Ribbon" (vante-ribbon-hero) design: a giant condensed headline — SITES IN /
MOTION — with a **travelling ribbon of project thumbnails** flowing through
it in 3D. The ribbon is a conveyor: tiles ride a curved path, fronts to the
viewer, curling away at the ends.

One 14-second timeline loops the whole show (sped up from the original
32s): low arc under the headline → big band crossing (and covering) the
type → thin strip riding high while the headline zooms → ribbon flattens
into a 4x3 grid, headline gone → headline splits wide apart with a low
small arc → loop. Drag sideways to speed the flow; pointer height bends
the ribbon.

The headline and the showreel scrub bar are driven from the same timeline
object the WebGL loop writes each frame — no React re-renders.

**Stack:** React + TypeScript + Vite, Tailwind v4, Three.js via React Three
Fiber (tiles on a parametric cylinder, facing outward; grid morphs by
lerping position/quaternion/scale per tile), Framer Motion for the chrome fade-in. Type: Anton (condensed display) + Inter. Tiles: 10
picsum photos + 2 graphic cards drawn on canvas at runtime.

**Run the source** (in [`../source/vante-ribbon-hero/`](../source/vante-ribbon-hero/)):
`npm install && npm run dev` — build with `npm run build`.

**Reverted 2026-11-11:** a v2 cylinder-carousel rebuild was tried and the
user preferred this original — so the live version is v1 again, with the
loop sped up at his request (14s, tile flow ~3.75x). The v2 source is kept
in git history (commit 3c4cd59) if it is ever wanted back.

Direction studied from the MotionSites preview (reference only — rebuilt
from observation, all wording original).
