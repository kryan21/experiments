import { motion } from 'framer-motion'

const display = { fontFamily: "'Anton', 'Arial Narrow', sans-serif" }

export default function Services() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] px-5 py-20 md:px-10 md:py-28">
      <motion.p
        className="micro mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        What I do
      </motion.p>
      <motion.h2
        className="uppercase leading-[1.02] text-white"
        style={{ ...display, fontSize: 'clamp(1.9rem, 5.2vw, 4.4rem)' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Websites for photographers • clinics • local brands
      </motion.h2>
      <motion.p
        className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.12 }}
      >
        One person, the whole job — design, build and deploy. No templates, no
        handoffs: a site that looks like your brand and turns visitors into
        enquiries.
      </motion.p>
      <div className="micro micro-bright mt-10 flex flex-wrap gap-x-8 gap-y-2">
        <span>Design</span>
        <span>—</span>
        <span>Build</span>
        <span>—</span>
        <span>Deploy</span>
        <span>—</span>
        <span>Support</span>
      </div>
    </section>
  )
}
