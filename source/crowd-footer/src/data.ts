export interface Project {
  name: string
  kind: string
  city: string
  shot: string
  url: string
  tint: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Perfect Media',
    kind: 'Wedding Photography',
    city: 'Gorakhpur',
    shot: 'shots/perfect.jpg',
    url: 'https://kryan21.github.io/perfect-media/',
    tint: '#26221c',
  },
  {
    name: 'Saat Pheras Moments',
    kind: 'Wedding Films',
    city: 'Pune',
    shot: 'shots/saat.jpg',
    url: 'https://kryan21.github.io/saatpher/',
    tint: '#1d2126',
  },
  {
    name: 'Shaadi Reels',
    kind: 'Wedding Content',
    city: 'Delhi | Dubai',
    shot: 'shots/shaadi.jpg',
    url: 'https://kryan21.github.io/shadi-reels/',
    tint: '#261d1d',
  },
  {
    name: 'Pixbiz Creatives',
    kind: 'Marketing Agency',
    city: 'Hyderabad',
    shot: 'shots/pixbiz.jpg',
    url: 'https://kryan21.github.io/pixbiz-creatives/',
    tint: '#1c1e24',
  },
]
