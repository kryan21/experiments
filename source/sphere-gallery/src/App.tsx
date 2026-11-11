import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChromeSphere from './components/ChromeSphere'
import TileSphere, { type DragState, type MorphState } from './components/TileSphere'
import { img, type Project } from './data'

const SECTIONS = ['hero', 'craft', 'identity', 'gallery'] as const
type Section = (typeof SECTIONS)[number]

const NAV: { key: Section; label: string }[] = [
  { key: 'hero', label: '1' },
  { key: 'craft', label: '2' },
  { key: 'identity', label: '3' },
  { key: 'gallery', label: 'Gallery' },
]

const serif = { fontFamily: "'Playfair Display', Didot, serif" }

function Hero() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-[54%] opacity-95">
        <ChromeSphere />
      </div>
      <h1
        style={serif}
        className="relative z-10 text-[9.2vw] font-medium leading-[1.04] tracking-tight text-white sm:text-[6.2vw] lg:text-[4.6vw]"
      >
        Turning quiet briefs into
        <br />
        sharp, precise and wildly
        <br />
        kinetic <em className="font-normal italic">Websites</em> that sell.
      </h1>
      <p className="micro micro-bright relative z-10 mt-10">Currently booking — new projects open</p>
      <p className="micro relative z-10 mt-16 animate-pulse">Scroll ↓</p>
    </div>
  )
}

function Craft() {
  return (
    <div className="relative grid h-full grid-cols-1 items-center gap-10 px-8 py-24 md:grid-cols-3 md:px-16">
      <div className="max-w-xs">
        <p className="micro micro-bright mb-4">Build</p>
        <p style={serif} className="text-xl leading-snug text-white/85">
          Business sites, portfolios and landing pages that load fast and explain themselves in
          seconds.
        </p>
        <ul className="micro mt-12 space-y-2 leading-relaxed">
          <li>Business Websites</li>
          <li>Portfolios</li>
          <li>Landing Pages</li>
          <li>Creative Development</li>
          <li>Motion &amp; 3D</li>
        </ul>
      </div>
      <div className="flex flex-col items-center text-center">
        <span style={serif} className="text-[26vw] leading-none text-white/95 md:text-[11rem]">I</span>
        <p className="micro micro-bright mt-2">Part One · Craft</p>
        <p style={serif} className="mt-6 max-w-xs text-lg italic leading-snug text-white/80">
          Stacks change every season. Shipping on time never goes out of style.
        </p>
        <div className="pointer-events-none mt-4 h-44 w-44 opacity-90">
          <ChromeSphere />
        </div>
      </div>
      <div className="max-w-xs md:justify-self-end">
        <p className="micro micro-bright mb-4">Recognition</p>
        <ul style={serif} className="space-y-3 text-xl text-white/85">
          <li>13 Sites shipped</li>
          <li>06 Industries served</li>
          <li>01 Demo before price, always</li>
          <li>00 Templates used</li>
        </ul>
        <p style={serif} className="mt-12 text-lg italic leading-snug text-white/70">
          “Noise is cheap. Clarity takes craft.”
        </p>
        <p className="micro mt-3">Studio note, 2026</p>
      </div>
    </div>
  )
}

function Identity() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
      <span style={serif} className="text-[26vw] leading-none text-white/95 md:text-[11rem]">II</span>
      <p className="micro micro-bright mt-2">Part Two · Identity</p>
      <p
        style={serif}
        className="mt-8 max-w-2xl text-3xl leading-snug text-white/90 md:text-4xl"
      >
        Brand systems and type direction that hold still beautifully — and move even better.
      </p>
      <p className="micro mt-10 max-w-md leading-loose">
        Logos · Colour · Typography · Voice — built to survive contact with the real web
      </p>
    </div>
  )
}

function Gallery({
  drag, morph, open, onToggle, onSelect,
}: {
  drag: React.MutableRefObject<DragState>
  morph: React.MutableRefObject<MorphState>
  open: boolean
  onToggle: (open: boolean) => void
  onSelect: (p: Project) => void
}) {
  const last = useRef<{ x: number; y: number } | null>(null)
  const touchY = useRef<number | null>(null)
  // NOTE: no setPointerCapture here — capturing on the wrapper would steal
  // the canvas's pointer events and tile clicks would never fire. Drag is
  // tracked with window-level listeners instead.
  const down = (e: React.PointerEvent) => {
    last.current = { x: e.clientX, y: e.clientY }
    const move = (ev: PointerEvent) => {
      if (!last.current) return
      const dx = ev.clientX - last.current.x
      const dy = ev.clientY - last.current.y
      last.current = { x: ev.clientX, y: ev.clientY }
      drag.current.oy += dx * 0.0052
      drag.current.ox += dy * 0.0052
      drag.current.vy = dx * 0.0052
      drag.current.vx = dy * 0.0052
    }
    const up = () => {
      last.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  return (
    <div
      className="relative h-full"
      onTouchStart={(e) => {
        touchY.current = e.touches[0].clientY
      }}
      onTouchEnd={(e) => {
        if (touchY.current === null) return
        const dy = touchY.current - e.changedTouches[0].clientY
        touchY.current = null
        if (dy > 60 && !open) onToggle(true)
        else if (dy < -60 && open) onToggle(false)
      }}
    >
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={down}
      >
        <TileSphere drag={drag} morph={morph} onSelect={onSelect} />
      </div>
      <p className="micro micro-bright pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 md:block">
        Kryan
      </p>
      <p className="micro micro-bright pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 text-right md:block">
        Websites &amp; Motion
      </p>
      <button
        onClick={() => onToggle(!open)}
        className="micro micro-bright absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/[0.05] px-5 py-2.5 backdrop-blur-md transition hover:bg-white hover:text-black"
      >
        {open ? '↑ Close — back to the sphere' : 'Scroll ↓ — the sphere opens'}
      </button>
    </div>
  )
}

function Overlay({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.figure
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={img(project, 1080, 720)} alt={project.title} className="w-full rounded-lg object-cover" />
        <figcaption className="mt-5 flex items-end justify-between">
          <div>
            <p style={serif} className="text-3xl text-white">{project.title}</p>
            <p className="micro mt-2">
              {project.tag} — {project.year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/25 px-5 py-2 text-xs tracking-widest text-white/80 transition hover:bg-white hover:text-black"
          >
            CLOSE
          </button>
        </figcaption>
      </motion.figure>
    </motion.div>
  )
}

export default function App() {
  const [section, setSection] = useState<Section>('hero')
  const [selected, setSelected] = useState<Project | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const drag = useRef<DragState>({ ox: 0, oy: 0, vx: 0, vy: 0 })
  const morph = useRef<MorphState>({ value: 0, target: 0 })
  const wheelLock = useRef(0)

  const setOpen = useCallback((open: boolean) => {
    morph.current.target = open ? 1 : 0
    setGalleryOpen(open)
  }, [])

  const go = useCallback(
    (dir: 1 | -1) => {
      setSection((s) => {
        const i = SECTIONS.indexOf(s)
        const n = Math.min(SECTIONS.length - 1, Math.max(0, i + dir))
        return SECTIONS[n]
      })
    },
    [],
  )

  const onWheel = (e: React.WheelEvent) => {
    if (selected) return
    if ((e.target as HTMLElement).closest('[data-nonav]')) return
    const now = performance.now()
    if (now - wheelLock.current < 1000) return
    if (Math.abs(e.deltaY) < 24) return
    if (section === 'gallery') {
      // the gallery eats the first scroll each way: it opens / closes the sphere
      if (e.deltaY > 0 && morph.current.target === 0) {
        wheelLock.current = now
        setOpen(true)
        return
      }
      if (e.deltaY < 0 && morph.current.target === 1) {
        wheelLock.current = now
        setOpen(false)
        return
      }
      if (e.deltaY > 0) return // already open — gallery is the last section
    }
    wheelLock.current = now
    go(e.deltaY > 0 ? 1 : -1)
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (section === 'gallery' && morph.current.target === 0) setOpen(true)
        else go(1)
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (section === 'gallery' && morph.current.target === 1) setOpen(false)
        else go(-1)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go, section, setOpen])

  return (
    <div className="relative h-full w-full overflow-hidden bg-black" onWheel={onWheel}>
      <AnimatePresence mode="wait">
        <motion.main
          key={section}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          {section === 'hero' && <Hero />}
          {section === 'craft' && <Craft />}
          {section === 'identity' && <Identity />}
          {section === 'gallery' && (
            <Gallery drag={drag} morph={morph} open={galleryOpen} onToggle={setOpen} onSelect={setSelected} />
          )}
        </motion.main>
      </AnimatePresence>

      <p className="micro pointer-events-none absolute left-6 top-6 z-20">Sphere Gallery — Exp. 002</p>
      <p className="micro pointer-events-none absolute right-6 top-6 z-20 hidden sm:block">
        React · Three.js · Motion
      </p>

      <nav className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-1.5 backdrop-blur-md">
        <span style={serif} className="px-3 text-sm italic tracking-wide text-white">Kryan</span>
        <span className="h-4 w-px bg-white/20" />
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider transition ${
              section === item.key ? 'bg-white text-black' : 'text-white/65 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {selected && <Overlay project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
