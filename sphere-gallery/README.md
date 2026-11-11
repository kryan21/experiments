# Sphere Gallery — Experiment 002

A full-screen, near-black portfolio built around one object: a glossy chrome
sphere (with antenna + ring stand) sitting on the hero headline. In the
Gallery, the same sphere has exploded into ~20 project tiles floating on a
sphere in 3D — auto-rotating, draggable with inertia, tap a tile to open it.

Sections (bottom pill nav, scroll or arrow keys also work):
1. Hero — Didone serif headline + chrome sphere
2. Part One · Craft — three-column editorial, Roman numeral I
3. Part Two · Identity — Roman numeral II
4. Gallery — the tile sphere
5. Projects — flat curated strip

**Stack:** React + TypeScript + Vite, Tailwind v4, Three.js via React Three
Fiber (studio-environment PMREM for the chrome — no HDR file needed),
Framer Motion for section transitions. Project photos are placeholder
picsum images with fixed IDs; swap in `src/data.ts`.

**Run the source** (in [`../source/sphere-gallery/`](../source/sphere-gallery/)):
`npm install && npm run dev` — build with `npm run build`.

Direction studied from the MotionSites "Sphere Gallery" preview (reference
only — layout rebuilt from observation, all wording original).
