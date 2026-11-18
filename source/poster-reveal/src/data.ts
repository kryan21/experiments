/** Poster collage panels — positions in % of the square poster.
 *  `depth` drives the reveal: low depth = background layer (settles first,
 *  moves least during the camera zoom), high depth = foreground (arrives
 *  last, travels most). Photos are picsum fixed IDs, saturation-boosted
 *  with CSS filters in the Poster component for a key-art feel. */
export interface Panel {
  id: number
  x: number
  y: number
  w: number
  h: number
  depth: number
  label: string
}

export const PANELS: Panel[] = [
  { id: 1015, x: 0, y: 0, w: 32, h: 30, depth: 0.9, label: 'River bend' },
  { id: 1025, x: 33.2, y: 0, w: 33.6, h: 38, depth: 0.75, label: 'The portrait' },
  { id: 593, x: 68, y: 0, w: 32, h: 30, depth: 1.0, label: 'The performer' },
  { id: 1044, x: 0, y: 31.2, w: 32, h: 33, depth: 1.2, label: 'Bloom study' },
  { id: 659, x: 68, y: 31.2, w: 32, h: 33, depth: 1.2, label: 'The dog' },
  { id: 435, x: 0, y: 65.4, w: 32, h: 34.6, depth: 1.1, label: 'Neon district' },
  { id: 431, x: 33.2, y: 39.2, w: 33.6, h: 60.8, depth: 0.95, label: 'Quiet interior' },
  { id: 1016, x: 68, y: 65.4, w: 32, h: 34.6, depth: 1.1, label: 'Canyon light' },
  { id: 1080, x: 41, y: 55, w: 18, h: 15, depth: 1.45, label: 'Harvest — accent' },
]

export const photoUrl = (id: number, w = 800, h = 800) =>
  `https://picsum.photos/id/${id}/${w}/${h}`
