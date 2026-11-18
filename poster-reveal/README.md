# Poster Reveal — Experiment 004

A square layered-collage poster on a dark stage, after the Aceternity UI
Labs "GTA VI Poster": nine photo panels with hard black gutters and a
logo lockup layered over the centre. The artwork is original — a sunset-
gradient **K** with KRYAN / WEBSITES / STUDIO stacked over it in outlined
block letters (drawn as SVG, so it scales crisply) and saturation-boosted
photos standing in for key art.

**The intro (the part worth stealing):** a camera-zoom reveal. The whole
poster starts zoomed in (Camera Scale 1.14) and pulls back to its fit
(0.96) over ~3.6s while the panels stagger in — background layers first,
foreground last — each starting larger and offset toward the centre by an
amount scaled by its depth, so the layers separate at different rates
during the zoom. The logo arrives last, blurred (4px) and oversized, and
settles on a spring (bounce 0.5, ~4s). Nothing loops; the settled poster
is still until you replay it.

**Controls (gear, top right)** mirror the reference's panel: Duration,
Camera Scale, Fit, Depth and Logo Blur sliders — changing any of them
re-runs the reveal, so the intro can be tuned live. Replay button top
left (and in the footer).

**Stack:** React + TypeScript + Vite, Tailwind v4, Framer Motion (camera
wrapper + per-panel tweens + duration-based spring for the logo). No
WebGL — the whole build is ~360KB of JS.

**Run the source** (in [`../source/poster-reveal/`](../source/poster-reveal/)):
`npm install && npm run dev` — build with `npm run build`.

Mechanism studied from the Aceternity Labs preview (reference only —
rebuilt from observation, artwork and wording original, no third-party
assets).
