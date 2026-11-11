import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Ribbon, { type DragState } from './components/Ribbon'
import { newTLState, type TLState } from './timeline'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

export default function App() {
  const tl = useRef<TLState>(newTLState())
  const drag = useRef<DragState>({ vel: 0, sway: 0 })
  const headRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)

  // Drive the headline + scrub bar straight from the shared timeline (no re-renders)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = tl.current
      if (headRef.current) {
        headRef.current.style.transform = `translate(-50%, -50%) scale(${s.headScale})`
        headRef.current.style.opacity = String(s.headOp)
      }
      if (line1Ref.current) line1Ref.current.style.transform = `translateX(${-s.headSplit * 34}vw)`
      if (line2Ref.current) line2Ref.current.style.transform = `translateX(${s.headSplit * 34}vw)`
      if (scrubRef.current) scrubRef.current.style.width = `${Math.round(s.time01 * 100)}%`
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
      drag.current.vel += dx * 0.00006
      drag.current.sway = (ev.clientY / window.innerHeight - 0.5) * 2
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div
      className="relative h-full w-full cursor-grab select-none overflow-hidden bg-black active:cursor-grabbing"
      onPointerDown={onPointerDown}
    >
      {/* headline — behind the ribbon, animated by the timeline */}
      <div
        ref={headRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-full will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <h1
          style={display}
          className="text-center uppercase leading-[0.94] tracking-[0.005em] text-white"
        >
          <span ref={line1Ref} className="block pl-[16vw] text-left text-[16.5vw] will-change-transform md:text-[17.5vw]">
            Sites in
          </span>
          <span ref={line2Ref} className="block pr-[10vw] text-right text-[16.5vw] will-change-transform md:text-[17.5vw]">
            Motion
          </span>
        </h1>
      </div>
      <p className="micro micro-bright pointer-events-none absolute left-1/2 top-[26%] z-30 -translate-x-1/2 text-center leading-[1.9]">
        Experiments in web, film
        <br />
        and interface — daily practice
      </p>

      {/* the ribbon */}
      <div className="absolute inset-0 z-20">
        <Ribbon tl={tl} drag={drag} />
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
        Drag — bend the ribbon
      </p>
    </div>
  )
}
