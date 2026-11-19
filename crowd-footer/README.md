# Crowd Footer — Experiment 005

A one-page dark portfolio concept whose **footer is the main character**,
after Aswin Panengal's portfolio (aswinpanengal.me): a giant condensed
headline hero, project cards shaped like file folders, and — below the
black footer block — a white strip holding a hand-drawn crowd that pans
sideways as you scroll, with the designer standing in full colour in the
middle of it. Concept and mechanics recreated for KRYAN; all artwork,
wording and code are original.

**The hero:** near-black page, centred KRYAN wordmark nav, a giant Anton
headline — `< WEBSITE DESIGNER />` — with an illustrated colour portrait
card (generated, original) centred under it, `©2026` bottom-left and
`{{ WEBSITES FOR LOCAL BRANDS }}` bottom-right. Headline lines slide up
on load.

**Featured Projects:** four file-folder cards for real, live KRYAN sites —
Perfect Media (Gorakhpur), Saat Pheras Moments (Pune), Shaadi Reels
(Delhi | Dubai), Pixbiz Creatives (Hyderabad). Each folder has a tab and a
real screenshot of the site printed on a "paper" tucked inside; hover or
tap and the paper rises out of the folder while the folder front tips
forward. The paper links through to the live site.

**The footer (the star):** a black block — KRYAN. wordmark, tagline, menu,
email and WhatsApp, a huge "See you around." and a Back-to-top pill — then
the white crowd strip (~46vh desktop, ~34vh phone). A generated B/W ink
crowd of Indian characters (photographer with camera front and centre, a
doctor, a chef, a bride and groom, elders, kids) is tiled into a strip
~260% of the viewport wide. It **pans horizontally with scroll progress**
while the strip reveals (measured pan — the range is exactly the strip's
overflow, so an edge can never show empty white), plus a very slow idle
drift. Behind the crowd, "KRYAN" sits in giant #ececec letters; in the
middle stands the designer himself — a generated full-colour character in
the same ink style (black outfit, laptop, yellow shoes), cut out and
composited over the crowd.

**Stack:** React + TypeScript + Vite, Tailwind v4, Framer Motion
(`useScroll` + measured `useTransform` pan, spring folder papers), Lenis
smooth scroll. Anton is self-hosted (the sandbox browser can't reach
Google Fonts); transform-only animation throughout.

**Run the source** (in [`../source/crowd-footer/`](../source/crowd-footer/)):
`npm install && npm run dev` — build with `npm run build`.

Mechanism studied from Aswin Panengal's portfolio and his Instagram reel
(reference only — rebuilt from observation, artwork and wording original,
no third-party assets).
