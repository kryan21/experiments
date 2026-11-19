import { motion } from 'framer-motion'
import { scrollToTarget } from '../scroll'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

function RiseLine({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  return (
    <header className="relative flex min-h-svh flex-col bg-[#0a0a0a] px-5 pt-5 md:px-10 md:pt-7">
      {/* top bar — wordmark centred, links either side */}
      <motion.nav
        className="relative flex items-center justify-between"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="micro hidden sm:block">Patna — India</span>
        <button
          onClick={() => scrollToTarget(0)}
          className="text-base font-semibold tracking-[0.3em] text-white sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-lg sm:tracking-[0.45em]"
          style={display}
        >
          KRYAN
        </button>
        <div className="flex items-center gap-5 md:gap-8">
          <button onClick={() => scrollToTarget('#work')} className="micro micro-bright hover:opacity-60 transition-opacity">
            Work
          </button>
          <button onClick={() => scrollToTarget('#contact')} className="micro micro-bright hover:opacity-60 transition-opacity">
            Contact
          </button>
        </div>
      </motion.nav>

      {/* headline */}
      <h1
        className="mt-10 text-center uppercase leading-[0.94] text-white md:mt-14"
        style={{ ...display, fontSize: 'clamp(3rem, 11.5vw, 11rem)' }}
      >
        <RiseLine delay={0.15}>&lt; Website</RiseLine>
        <RiseLine delay={0.3}>Designer /&gt;</RiseLine>
      </h1>

      {/* portrait card */}
      <motion.div
        className="relative z-10 mx-auto -mt-[0.5em] w-[min(68vw,300px)] md:w-[320px]"
        initial={{ opacity: 0, y: 60, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-hidden rounded-xl border border-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <img
            src="art/portrait.webp"
            alt="Illustrated portrait of KRYAN, website designer"
            className="block aspect-[4/5] w-full object-cover object-top"
            draggable={false}
          />
        </div>
        <p className="micro mt-3 text-center">Aaryan — designs, builds, ships</p>
      </motion.div>

      {/* bottom corners */}
      <motion.div
        className="mt-auto flex items-end justify-between pb-6 pt-10 md:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1 }}
      >
        <span className="micro micro-bright">©2026</span>
        <span className="micro hidden md:block">Scroll — the footer is the main character ↓</span>
        <span className="micro micro-bright">{'{{ Websites for local brands }}'}</span>
      </motion.div>
    </header>
  )
}
