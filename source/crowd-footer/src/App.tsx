import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Services from './components/Services'
import Footer from './components/Footer'
import { setLenis } from './scroll'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    setLenis(lenis)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <main className="bg-[#0a0a0a]">
      <Hero />
      <Projects />
      <Services />
      <Footer />
    </main>
  )
}
