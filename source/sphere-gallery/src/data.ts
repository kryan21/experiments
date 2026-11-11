export interface Project {
  id: number
  title: string
  tag: string
  year: string
}

/** Sample project tiles (placeholder photography via picsum, fixed IDs so the
 *  sphere looks identical on every load). Swap in real work any time. */
export const PROJECTS: Project[] = [
  { id: 1016, title: 'Canyon Light', tag: 'Landscape', year: '2026' },
  { id: 1015, title: 'River Study', tag: 'Landscape', year: '2025' },
  { id: 1018, title: 'Alpine Still', tag: 'Travel', year: '2026' },
  { id: 1025, title: 'Portrait Nº 4', tag: 'Portrait', year: '2025' },
  { id: 1036, title: 'High Pass', tag: 'Travel', year: '2024' },
  { id: 1041, title: 'Coastline', tag: 'Landscape', year: '2026' },
  { id: 1043, title: 'Bloom', tag: 'Nature', year: '2025' },
  { id: 1044, title: 'Moon Field', tag: 'Nature', year: '2024' },
  { id: 1060, title: 'Morning Ritual', tag: 'Still Life', year: '2026' },
  { id: 1067, title: 'City Geometry', tag: 'Architecture', year: '2025' },
  { id: 1080, title: 'Harvest', tag: 'Still Life', year: '2024' },
  { id: 292, title: 'Table Nº 2', tag: 'Food', year: '2026' },
  { id: 429, title: 'Café Culture', tag: 'Street', year: '2025' },
  { id: 431, title: 'Quiet Interior', tag: 'Interior', year: '2026' },
  { id: 435, title: 'Neon District', tag: 'Street', year: '2025' },
  { id: 452, title: 'Festival', tag: 'Event', year: '2024' },
  { id: 493, title: 'Old Town', tag: 'Architecture', year: '2025' },
  { id: 550, title: 'Passage', tag: 'Street', year: '2026' },
  { id: 593, title: 'The Performer', tag: 'Portrait', year: '2025' },
  { id: 659, title: 'Workshop', tag: 'Documentary', year: '2024' },
]

export const img = (p: Project, w = 480, h = 360) =>
  `https://picsum.photos/id/${p.id}/${w}/${h}`
