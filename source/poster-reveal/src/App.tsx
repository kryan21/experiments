import { useEffect, useState } from 'react'
import Poster, { type PosterParams } from './components/Poster'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

const DEFAULTS: PosterParams = {
  duration: 3.6,
  cameraScale: 1.14,
  fit: 0.96,
  depth: 1.0,
  logoBlur: 4,
}

interface SliderDef {
  key: keyof PosterParams
  label: string
  min: number
  max: number
  step: number
  fmt: (v: number) => string
}

const SLIDERS: SliderDef[] = [
  { key: 'duration', label: 'Duration', min: 1, max: 8, step: 0.1, fmt: (v) => v.toFixed(1) },
  { key: 'cameraScale', label: 'Camera Scale', min: 1, max: 1.8, step: 0.01, fmt: (v) => v.toFixed(2) },
  { key: 'fit', label: 'Fit', min: 0.85, max: 1, step: 0.01, fmt: (v) => v.toFixed(2) },
  { key: 'depth', label: 'Depth', min: 0, max: 1.6, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: 'logoBlur', label: 'Logo Blur', min: 0, max: 12, step: 0.5, fmt: (v) => v.toFixed(1) },
]

export default function App() {
  const [params, setParams] = useState<PosterParams>(DEFAULTS)
  const [runId, setRunId] = useState(0)
  const [controlsOpen, setControlsOpen] = useState(false)

  // any parameter change re-runs the reveal (debounced while dragging)
  useEffect(() => {
    const t = setTimeout(() => setRunId((r) => r + 1), 450)
    return () => clearTimeout(t)
  }, [params])

  const replay = () => setRunId((r) => r + 1)

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #241536 0%, #120a1e 45%, #050308 100%)',
      }}
    >
      {/* header */}
      <header className="z-10 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-6">
        <span style={display} className="text-lg uppercase tracking-wide">
          Kryan<sup className="align-super text-[9px]">®</sup>
        </span>
        <span className="micro micro-bright mt-1.5 hidden md:block">
          Experiment 004 — Poster Reveal
        </span>
        <a
          href="https://kryan21.github.io/experiments/"
          className="rounded-full border border-white/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] transition hover:bg-white hover:text-black"
        >
          All experiments
        </a>
      </header>

      {/* stage */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6">
        <div
          className="relative"
          style={{ width: 'min(84vmin, 700px)', height: 'min(84vmin, 700px)' }}
        >
          <Poster params={params} runId={runId} />

          {/* replay */}
          <button
            onClick={replay}
            aria-label="Replay poster intro"
            className="absolute -left-3 -top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-base text-white backdrop-blur transition hover:bg-white hover:text-black md:-left-5 md:-top-5"
          >
            ↻
          </button>
          {/* controls toggle */}
          <button
            onClick={() => setControlsOpen((o) => !o)}
            aria-label="Toggle controls"
            className="absolute -right-3 -top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-base text-white backdrop-blur transition hover:bg-white hover:text-black md:-right-5 md:-top-5"
          >
            ⚙
          </button>

          {/* controls panel */}
          {controlsOpen && (
            <div className="absolute -right-3 top-12 z-20 w-60 rounded-xl border border-white/15 bg-[#0d0817]/95 p-4 shadow-2xl backdrop-blur md:-right-5">
              <p className="micro micro-bright mb-3">Controls</p>
              {SLIDERS.map((s) => (
                <label key={s.key} className="mb-3 block last:mb-1">
                  <span className="mb-1 flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/70">
                      {s.label}
                    </span>
                    <span className="text-[11px] font-semibold text-white">
                      {s.fmt(params[s.key])}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={params[s.key]}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, [s.key]: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-fuchsia-500"
                  />
                </label>
              ))}
              <button
                onClick={() => setParams(DEFAULTS)}
                className="micro mt-2 w-full rounded-full border border-white/25 py-1.5 text-white/80 transition hover:bg-white hover:text-black"
              >
                Reset defaults
              </button>
            </div>
          )}
        </div>
      </main>

      {/* footer */}
      <footer className="z-10 flex items-end justify-between gap-6 px-5 pb-5 md:px-8 md:pb-6">
        <p className="hidden max-w-[260px] text-[11px] leading-relaxed text-white/55 sm:block">
          A layered poster intro: panels stagger in at different depths while
          the camera zooms out, and the logo lands last on a spring.
        </p>
        <p className="micro">Layers / Camera / Spring</p>
        <button
          onClick={replay}
          className="micro micro-bright transition hover:text-white"
        >
          Replay intro —
        </button>
      </footer>
    </div>
  )
}
