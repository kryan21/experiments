import { motion } from 'framer-motion'
import { PANELS, photoUrl } from '../data'

export interface PosterParams {
  duration: number // main reveal duration (s)
  cameraScale: number // zoom the intro starts from
  fit: number // final scale of the whole poster
  depth: number // depth separation multiplier
  logoBlur: number // px of blur the logo starts with
}

const EASE = [0.22, 0.61, 0.21, 1] as const

/** The logo lockup: a giant sunset-gradient K with the studio name stacked
 *  over it in outlined block letters — drawn as SVG so it scales crisply
 *  with the poster at any size. */
function LogoLockup() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-label="KRYAN Websites Studio">
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="32%" stopColor="#a855f7" />
          <stop offset="58%" stopColor="#ec4899" />
          <stop offset="82%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      {/* dark outline pass */}
      <text
        x="200" y="272" textAnchor="middle"
        fontFamily="'Anton', 'Arial Narrow', sans-serif" fontSize="308"
        fill="none" stroke="#0b0610" strokeWidth="14" paintOrder="stroke"
      >
        K
      </text>
      {/* gradient face with a thin white inner edge */}
      <text
        x="200" y="272" textAnchor="middle"
        fontFamily="'Anton', 'Arial Narrow', sans-serif" fontSize="308"
        fill="url(#sunset)" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke"
      >
        K
      </text>
      {/* stacked block words */}
      <g
        fontFamily="'Anton', 'Arial Narrow', sans-serif"
        fill="#ffffff" stroke="#0b0610" strokeWidth="7" paintOrder="stroke"
        textAnchor="middle" letterSpacing="3"
      >
        <text x="200" y="238" fontSize="57">KRYAN</text>
        <text x="200" y="293" fontSize="57">WEBSITES</text>
        <text x="200" y="348" fontSize="57">STUDIO</text>
      </g>
      <text
        x="290" y="222" fontSize="17" fill="#ffffff" stroke="#0b0610"
        strokeWidth="4" paintOrder="stroke"
        fontFamily="'Inter', Arial, sans-serif" fontWeight="600"
      >
        ®
      </text>
    </svg>
  )
}

export default function Poster({ params, runId }: { params: PosterParams; runId: number }) {
  const { duration, cameraScale, fit, depth, logoBlur } = params
  const tScale = duration / 3.6 // keep proportions when duration changes

  // reveal order: background (low depth) first, foreground last
  const ordered = [...PANELS].sort((a, b) => a.depth - b.depth)
  const rank = new Map(ordered.map((p, i) => [p.id, i]))

  return (
    <motion.div
      key={runId}
      className="h-full w-full will-change-transform"
      initial={{ scale: cameraScale }}
      animate={{ scale: fit }}
      transition={{ duration, ease: EASE }}
    >
      <div className="relative h-full w-full overflow-hidden bg-black shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        {PANELS.map((p) => {
          const cx = p.x + p.w / 2
          const cy = p.y + p.h / 2
          const d = p.depth * depth
          return (
            <motion.div
              key={p.id}
              className="absolute overflow-hidden"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                width: `${p.w}%`, height: `${p.h}%`,
              }}
              initial={{
                opacity: 0,
                scale: 1.15 + 0.13 * d,
                x: `${(50 - cx) * 0.22 * d}%`,
                y: `${(50 - cy) * 0.22 * d}%`,
              }}
              animate={{ opacity: 1, scale: 1, x: '0%', y: '0%' }}
              transition={{
                duration: 1.05 * tScale,
                delay: 0.15 + (rank.get(p.id) ?? 0) * 0.13 * tScale,
                ease: EASE,
              }}
            >
              <img
                src={photoUrl(p.id)}
                alt={p.label}
                className="h-full w-full object-cover"
                style={{ filter: 'saturate(1.45) contrast(1.12) brightness(1.02)' }}
                draggable={false}
              />
            </motion.div>
          )
        })}

        {/* logo arrives last: blurred, slightly large, spring settle */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[68%]"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 1.14, filter: `blur(${logoBlur}px)` }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{
            type: 'spring',
            bounce: 0.5,
            duration: 4 * tScale,
            delay: duration * 0.52,
          }}
        >
          <LogoLockup />
        </motion.div>
      </div>
    </motion.div>
  )
}
