import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { scrollToTarget } from '../scroll'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

function CrowdStrip() {
  const boxRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxPan, setMaxPan] = useState(0)

  // pan is driven by this strip scrolling into view
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ['start end', 'end end'],
  })
  const panX = useTransform(scrollYProgress, [0, 1], [0, -maxPan])

  useLayoutEffect(() => {
    const measure = () => {
      if (!boxRef.current || !trackRef.current) return
      const overflow = trackRef.current.scrollWidth - boxRef.current.clientWidth
      setMaxPan(Math.max(0, overflow))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div ref={boxRef} className="relative h-[34vh] overflow-hidden bg-white md:h-[46vh]">
      {/* the name, giant and barely there, behind the crowd */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <span
          className="leading-none text-[#ececec] select-none"
          style={{ ...display, fontSize: '38vh', letterSpacing: '0.02em' }}
        >
          KRYAN
        </span>
      </div>

      {/* the crowd — wider than the screen, pans with scroll; sits on the
          strip's floor so the name looms behind the heads */}
      <motion.div style={{ x: panX }} className="absolute bottom-0 left-0 z-[5] h-[79%]">
        <motion.div
          ref={trackRef}
          className="flex h-full w-max"
          animate={{ x: [0, -26, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        >
          {[0, 1, 2].map((i) => (
            <img
              key={i}
              src="art/crowd.webp"
              alt={i === 0 ? 'Hand-drawn doodle crowd of people' : ''}
              aria-hidden={i > 0}
              className="h-full w-auto max-w-none shrink-0"
              draggable={false}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* the designer himself — full colour, middle of the crowd */}
      <img
        src="art/owner-cut.png"
        alt="KRYAN standing in the middle of the crowd"
        className="absolute bottom-0 left-1/2 z-10 h-[96%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
        draggable={false}
      />
    </div>
  )
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-black">
      <div className="border-t border-white/10 px-5 pt-16 md:px-10 md:pt-24">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className="uppercase leading-none text-white" style={{ ...display, fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
              KRYAN.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              Website designer for local brands — photographers, clinics and
              businesses that live on enquiries.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="micro mb-1">Menu</span>
            <button onClick={() => scrollToTarget(0)} className="text-left text-sm text-white/80 hover:text-white">Home</button>
            <button onClick={() => scrollToTarget('#work')} className="text-left text-sm text-white/80 hover:text-white">Work</button>
            <button onClick={() => scrollToTarget('#contact')} className="text-left text-sm text-white/80 hover:text-white">Contact</button>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="micro mb-1">Say hello</span>
            <a href="mailto:aaryanraj2000@gmail.com" className="text-sm text-white/80 hover:text-white">
              aaryanraj2000@gmail.com
            </a>
            <a
              href="https://wa.me/917321929869"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/80 hover:text-white"
            >
              WhatsApp — +91 73219 29869
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 pb-10 md:mt-24 md:pb-14">
          <motion.h2
            className="uppercase leading-[0.95] text-white"
            style={{ ...display, fontSize: 'clamp(2.6rem, 9vw, 8.5rem)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            See you
            <br />
            around.
          </motion.h2>
          <button
            onClick={() => scrollToTarget(0)}
            className="micro micro-bright shrink-0 rounded-full border border-white/25 px-5 py-3 hover:bg-white hover:text-black transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      <CrowdStrip />
    </footer>
  )
}
