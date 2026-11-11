import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Ribbon, { type DragState } from './components/Ribbon'
import { newTLState, showState, type TLState } from './timeline'
import { TILES, photoUrl, type TileDef } from './data'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

export default function App() {
  const tl = useRef<TLState>(newTLState())
  const drag = useRef<DragState>({ vel: 0, sway: 0 })
  const headRef = useRef<HTMLDivElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const [selected, setSelected] = useState<number | null>(null)

  // dev/check aid: ?t=<seconds> pins the show at one moment
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    if (t != null && !Number.isNaN(parseFloat(t))) showState.freezeT = parseFloat(t)
  }, [])

  // opening a grid tile pauses the show until it is closed
  useEffect(() => {
    showState.paused = selected != null
  }, [selected])

  // The headline NEVER transforms (per the reference) — the timeline only
  // fades it; the scrub bar tracks loop progress. Driven by rAF, no re-renders.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = tl.current
      if (headRef.current) headRef.current.style.opacity = String(s.headOp)
      if (scrubRef.current) scrubRef.current.style.width = `${Math.round(s.time01 * 100)}%`
      if (subRef.current) subRef.current.style.opacity = String(1 - s.grid)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    let lastX = e.clientX
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX
      lastX = ev.clientX
      drag.current.vel = THREE_clamp(dx * 0.0035)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const sel: TileDef | null = selected != null ? TILES[selected] : null

  return (
    <div
      className="relative h-full w-full cursor-grab select-none overflow-hidden bg-black active:cursor-grabbing"
      onPointerDown={onPointerDown}
    >
      {/* headline — behind the ring, opacity only */}
      <div
        ref={headRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-full"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <h1
          style={display}
          className="text-center uppercase leading-[0.94] tracking-[0.005em] text-white"
        >
          <span className="block pl-[8vw] text-left text-[23vw] md:pl-[16vw] md:text-[17.5vw]">
            Sites in
          </span>
          <span className="block pr-[6vw] text-right text-[23vw] md:pr-[10vw] md:text-[17.5vw]">
            Motion
          </span>
        </h1>
      </div>
      <p ref={subRef} className="micro micro-bright pointer-events-none absolute left-1/2 top-[26%] z-30 -translate-x-1/2 text-center leading-[1.9]">
        Experiments in web, film
        <br />
        and interface — daily practice
      </p>

      {/* the ring */}
      <div className="absolute inset-0 z-20">
        <Ribbon tl={tl} drag={drag} onSelect={(i) => setSelected(i)} />
      </div>

      {/* chrome */}
      <motion.header
        {...fadeUp}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-6"
      >
        <span style={display} className="text-lg uppercase tracking-wide text-white">
          Kryan<sup className="text-[9px] align-super">®</sup>
        </span>
        <span className="micro micro-bright mt-1.5 hidden md:block">Start a project —</span>
        <span className="flex gap-2">
          <a
            href="https://wa.me/917321929869"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black"
          >
            ● Let&apos;s talk
          </a>
          <button className="rounded-full border border-white/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black">
            Menu ≡
          </button>
        </span>
      </motion.header>

      <motion.footer
        {...fadeUp}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-6 px-5 pb-5 md:px-8 md:pb-6"
      >
        <p className="hidden max-w-[250px] text-[11px] leading-relaxed text-white/55 sm:block">
          Concepts, explorations and interface experiments — shared openly as part of the process.
        </p>
        <p className="micro hidden md:block">Visuals / Film / Music / Experiments</p>
        <span className="flex items-center gap-4">
          <span className="relative hidden h-px w-28 bg-white/25 md:block">
            <span ref={scrubRef} className="absolute left-0 top-0 h-px bg-white" style={{ width: '0%' }} />
          </span>
          <span className="micro micro-bright">View showreel —</span>
        </span>
      </motion.footer>

      <p className="micro pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 opacity-70 md:bottom-24">
        Drag — spin the ring · tiles open in the grid
      </p>

      {/* opened grid tile */}
      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 p-6"
            onClick={() => setSelected(null)}
          >
            <motion.figure
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {sel.kind === 'photo' ? (
                <img
                  src={photoUrl(sel.id, 1080, 800)}
                  alt={sel.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center"
                  style={{ background: sel.bg, color: sel.fg }}
                >
                  <span style={display} className="text-7xl uppercase md:text-8xl">{sel.big}</span>
                  <span className="micro mt-4 opacity-70" style={{ color: sel.fg }}>{sel.sub}</span>
                </div>
              )}
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span style={display} className="text-xl uppercase tracking-wide text-white">
                  {sel.title}
                </span>
                <span className="micro">Kryan — selected experiments</span>
              </figcaption>
            </motion.figure>
            <button
              className="micro micro-bright absolute right-6 top-6 rounded-full border border-white/35 px-4 py-2 text-white transition hover:bg-white hover:text-black"
              onClick={() => setSelected(null)}
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function THREE_clamp(v: number) {
  return Math.max(-0.06, Math.min(0.06, v))
}
