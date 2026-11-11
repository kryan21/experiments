export type TileDef =
  | { kind: 'photo'; id: number; title: string }
  | { kind: 'graphic'; title: string; bg: string; fg: string; big: string; sub: string }

/** The ribbon's cargo: 10 photos (picsum, fixed IDs) + 2 graphic tiles
 *  drawn on canvas at runtime — like the reference's mix of project stills
 *  and bold graphic cards. */
export const TILES: TileDef[] = [
  { kind: 'photo', id: 1016, title: 'Canyon Light' },
  { kind: 'graphic', title: 'Brand Mark', bg: '#f4f2ec', fg: '#0a0a0a', big: 'KRYAN®', sub: 'WEBSITES — EST. 2025' },
  { kind: 'photo', id: 1025, title: 'Portrait Nº 4' },
  { kind: 'photo', id: 1043, title: 'Bloom' },
  { kind: 'graphic', title: 'Index', bg: '#5b3df0', fg: '#ffffff', big: '02', sub: 'SELECTED EXPERIMENTS' },
  { kind: 'photo', id: 1067, title: 'City Geometry' },
  { kind: 'photo', id: 435, title: 'Neon District' },
  { kind: 'photo', id: 292, title: 'Table Nº 2' },
  { kind: 'photo', id: 593, title: 'The Performer' },
  { kind: 'photo', id: 1080, title: 'Harvest' },
  { kind: 'photo', id: 431, title: 'Quiet Interior' },
  { kind: 'photo', id: 550, title: 'Passage' },
]

export const photoUrl = (id: number, w = 480, h = 300) =>
  `https://picsum.photos/id/${id}/${w}/${h}`
