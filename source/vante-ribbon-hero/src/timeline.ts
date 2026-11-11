/** Shared show timeline v2 — rebuilt after a close second study of the
 *  reference recording (2026-11-11). The real motion is a closed cylinder
 *  carousel: a strip of tiles wrapped around a vertical ring, rotating
 *  continuously, front face travelling right-to-left, tiles swelling with
 *  perspective as they round the front. The headline NEVER moves — it is
 *  only covered by the front pass or faded. Phases in one ~14s loop:
 *  close pass (ring big, centred, fast) → ring shrinks and drops into a
 *  thin strip low under the headline (long calm moment) → six tiles fly
 *  into a flat 3x2 grid and HOLD (interactive in our build) → fly out →
 *  back to the close pass. */
export interface TLState {
  ringScale: number // overall size of the cylinder
  ringY: number // vertical placement of the ring
  ringTilt: number // x-axis tilt of the ring (diagonal read)
  rotSpeed: number // angular speed multiplier
  grid: number // 0 = ring, 1 = flattened 3x2 grid
  headOp: number // headline opacity (it never transforms)
  time01: number
}

interface Key extends Omit<TLState, 'time01'> {
  t: number
}

const KEYS: Key[] = [
  { t: 0.0, ringScale: 1.1, ringY: 0.15, ringTilt: 0.06, rotSpeed: 1.05, grid: 0, headOp: 0.3 },
  { t: 2.2, ringScale: 1.0, ringY: -0.3, ringTilt: 0.12, rotSpeed: 0.8, grid: 0, headOp: 0.95 },
  { t: 3.4, ringScale: 0.4, ringY: -2.85, ringTilt: 0.5, rotSpeed: 0.5, grid: 0, headOp: 1 },
  { t: 6.8, ringScale: 0.4, ringY: -2.85, ringTilt: 0.5, rotSpeed: 0.45, grid: 0, headOp: 1 },
  { t: 7.8, ringScale: 0.75, ringY: -1.0, ringTilt: 0.18, rotSpeed: 0.4, grid: 1, headOp: 0 },
  { t: 12.2, ringScale: 0.75, ringY: -1.0, ringTilt: 0.18, rotSpeed: 0.4, grid: 1, headOp: 0 },
  { t: 13.2, ringScale: 1.05, ringY: 0.0, ringTilt: 0.08, rotSpeed: 1.0, grid: 0, headOp: 0.35 },
  { t: 14.0, ringScale: 1.1, ringY: 0.15, ringTilt: 0.06, rotSpeed: 1.05, grid: 0, headOp: 0.3 },
]

export const LOOP = 14

/** Runtime show controls shared between the canvas and the DOM chrome. */
export const showState = {
  paused: false, // true while a grid tile is opened full-screen
  freezeT: null as number | null, // dev/check aid: ?t=<seconds> pins the loop
  loops: 0, // completed loops — the grid alternates tile subsets per loop
}

const smooth = (u: number) => u * u * (3 - 2 * u)
const lerp = (a: number, b: number, u: number) => a + (b - a) * u

export function evalTimeline(time: number, out: TLState): TLState {
  const t = ((time % LOOP) + LOOP) % LOOP
  out.time01 = t / LOOP
  let i = 0
  while (i < KEYS.length - 2 && KEYS[i + 1].t <= t) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const u = smooth(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))))
  out.ringScale = lerp(a.ringScale, b.ringScale, u)
  out.ringY = lerp(a.ringY, b.ringY, u)
  out.ringTilt = lerp(a.ringTilt, b.ringTilt, u)
  out.rotSpeed = lerp(a.rotSpeed, b.rotSpeed, u)
  out.grid = lerp(a.grid, b.grid, u)
  out.headOp = lerp(a.headOp, b.headOp, u)
  return out
}

export const newTLState = (): TLState => ({
  ringScale: 1.1, ringY: 0.15, ringTilt: 0.06, rotSpeed: 1.05,
  grid: 0, headOp: 0.3, time01: 0,
})
