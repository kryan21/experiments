/** Shared show timeline: one 20s loop of keyframed states, in the spirit of
 *  the reference recording — low arc → big band crossing the headline → thin
 *  strip riding high while the headline zooms → ribbon flattens into a grid
 *  (headline gone) → headline splits wide with a low small arc → loop. */
export interface TLState {
  bend: number // arc height of the ribbon's curve
  yOff: number // vertical placement of the ribbon
  tile: number // tile scale on the ribbon
  grid: number // 0 = ribbon, 1 = flattened grid
  headScale: number
  headSplit: number // 0..1 — headline lines slide apart
  headOp: number
  time01: number
}

interface Key extends Omit<TLState, 'time01'> {
  t: number
}

const KEYS: Key[] = [
  { t: 0, bend: 0.95, yOff: -1.25, tile: 0.8, grid: 0, headScale: 1.0, headSplit: 0, headOp: 1 },
  { t: 4, bend: 0.5, yOff: 0.05, tile: 1.3, grid: 0, headScale: 1.04, headSplit: 0.06, headOp: 1 },
  { t: 8, bend: 1.15, yOff: 1.55, tile: 0.55, grid: 0, headScale: 1.45, headSplit: 0.22, headOp: 1 },
  { t: 12, bend: 0.0, yOff: 0.0, tile: 1.5, grid: 1, headScale: 1.0, headSplit: 0, headOp: 0 },
  { t: 16, bend: 0.85, yOff: -1.35, tile: 0.7, grid: 0, headScale: 1.0, headSplit: 1, headOp: 1 },
  { t: 20, bend: 0.95, yOff: -1.25, tile: 0.8, grid: 0, headScale: 1.0, headSplit: 0, headOp: 1 },
]

export const LOOP = 20

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
  out.bend = lerp(a.bend, b.bend, u)
  out.yOff = lerp(a.yOff, b.yOff, u)
  out.tile = lerp(a.tile, b.tile, u)
  out.grid = lerp(a.grid, b.grid, u)
  out.headScale = lerp(a.headScale, b.headScale, u)
  out.headSplit = lerp(a.headSplit, b.headSplit, u)
  out.headOp = lerp(a.headOp, b.headOp, u)
  return out
}

export const newTLState = (): TLState => ({
  bend: 0.95, yOff: -1.25, tile: 0.8, grid: 0,
  headScale: 1, headSplit: 0, headOp: 1, time01: 0,
})
