# Vante Ribbon Hero — Experiment 003

A single full-screen hero on pure black, after the MotionSites "Video
Ribbon" (vante-ribbon-hero) design: a giant condensed headline — SITES IN /
MOTION — with a **travelling ribbon of project thumbnails** flowing through
it in 3D. The ribbon is a conveyor: tiles ride a curved path, fronts to the
viewer, curling away at the ends.

One 32-second timeline loops the whole show:
low arc under the headline → big band crossing (and covering) the type →
thin strip riding high while the headline zooms → ribbon flattens into a
4×3 grid, headline gone → headline splits wide apart with a low small arc →
loop. Drag sideways to speed the flow; pointer height bends the ribbon.

The headline and the showreel scrub bar are driven from the same timeline
object the WebGL loop writes each frame — no React re-renders.

**Stack:** React + TypeScript + Vite, Tailwind v4, Three.js via React Three
Fiber (tiles oriented along the path tangent via a basis matrix), Framer
Motion for the chrome fade-in. Type: Anton (condensed display) + Inter.
Tiles: 10 picsum photos + 2 graphic cards drawn on canvas at runtime.

**Run the source** (in [`../source/vante-ribbon-hero/`](../source/vante-ribbon-hero/)):
`npm install && npm run dev` — build with `npm run build`.

Direction studied from the MotionSites preview (reference only — rebuilt
from observation, all wording original).
