import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS, type Project } from '../data'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

function FolderCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer pt-16 md:pt-20"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {/* the paper / screenshot peeking out of the folder */}
      <motion.div
        className="absolute inset-x-5 top-6 bottom-24 overflow-hidden rounded-t-md bg-white shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:inset-x-7"
        initial={false}
        animate={{ y: open ? -26 : 6, rotate: open ? -1.2 : 0 }}
        transition={{ type: 'spring', stiffness: 210, damping: 24 }}
      >
        <img
          src={project.shot}
          alt={`${project.name} — live site screenshot`}
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </motion.div>

      {/* folder body */}
      <div className="relative z-10">
        {/* tab */}
        <div
          className="absolute -top-5 left-0 h-6 w-[42%] rounded-t-lg"
          style={{ background: project.tint, clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)' }}
        />
        <motion.div
          className="relative flex h-52 flex-col justify-between overflow-hidden rounded-b-xl rounded-tr-xl p-5 md:h-60 md:p-6"
          style={{ background: `linear-gradient(160deg, ${project.tint} 0%, #121214 78%)` }}
          initial={false}
          animate={{ rotateX: open ? 3.5 : 0, y: open ? 3 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="micro">File — 0{index + 1}</span>
            <span className="micro micro-bright">{project.city}</span>
          </div>
          <div>
            <h3 className="uppercase leading-none text-white" style={{ ...display, fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)' }}>
              {project.name}
            </h3>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="micro">{project.kind}</span>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="micro micro-bright underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                Visit live site ↗
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
        </motion.div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="work" className="bg-[#0a0a0a] px-5 py-24 md:px-10 md:py-36">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-10">
        <motion.h2
          className="uppercase leading-none text-white"
          style={{ ...display, fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Featured Projects
        </motion.h2>
        <span className="micro pb-2">( 04 ) — Real sites, live now</span>
      </div>

      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <FolderCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
