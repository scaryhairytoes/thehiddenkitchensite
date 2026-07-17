'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import { VelocitySkew } from './velocity-skew'

const hoursSchedule = [
  { day: 'Mon', kitchen: 'Closed', bar: 'Closed' },
  { day: 'Tue — Thu', kitchen: '11 AM – 8 PM', bar: '11 AM – 12 AM' },
  { day: 'Fri — Sat', kitchen: '11 AM – 8 PM', bar: '11 AM – 12 AM' },
  { day: 'Sun', kitchen: '11 AM – 8 PM', bar: '12 PM – 12 AM' },
]

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Details() {
  return (
    <section
      id="visit"
      className="relative z-40 min-h-screen w-full overflow-hidden bg-black py-24 md:py-32"
    >
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-[70vh] w-[90vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,175,0,0.12),transparent_60%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-16">
        <VelocitySkew intensity={4}>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            custom={1}
            className="text-balance text-[15vw] font-black uppercase leading-[0.8] tracking-tighter text-foreground lg:text-[9vw]"
          >
            Pull up a chair.
            <br />
            <span className="gold-shimmer">You belong here.</span>
          </motion.h2>
        </VelocitySkew>

        {/* Asymmetric info columns, no cards */}
        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 lg:mt-28">
          {/* Location / Google Map */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={2}
            className="md:col-span-4"
          >
            <div className="mb-4 flex items-center gap-3 text-gold">
              <MapPin className="h-5 w-5" strokeWidth={1.75} suppressHydrationWarning />
              <span className="text-sm font-black uppercase tracking-[0.25em]">Location</span>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gold/20 bg-black/80 shadow-xl aspect-[4/3] w-full">
              <iframe
                title="The Hidden Kitchen Location Map"
                src="https://maps.google.com/maps?q=131%20S%20Division%20St,%20Carterville,%20IL%2062918&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                className="h-full w-full border-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-zinc-950/90 backdrop-blur-md border-t border-gold/15 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground truncate max-w-[70%]">131 S. Division St, Carterville</span>
                <a
                  href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-semibold hover:underline shrink-0"
                >
                  Directions ↗
                </a>
              </div>
            </div>
          </motion.div>

          {/* Hours — Symmetrical 3-Column Table without outer box */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={3}
            className="md:col-span-5 md:pt-2"
          >
            <div className="mb-4 flex items-center gap-3 text-gold">
              <span className="text-sm font-black uppercase tracking-[0.25em]">Hours of Operation</span>
            </div>

            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-gold/20 pb-2.5 text-[11px] font-mono font-bold uppercase tracking-wider text-gold">
                <span className="col-span-4">Day</span>
                <span className="col-span-4 text-center">Kitchen</span>
                <span className="col-span-4 text-right">Bar</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gold/10 text-xs sm:text-sm">
                {hoursSchedule.map((h) => (
                  <div key={h.day} className="grid grid-cols-12 items-center py-3">
                    <span className="col-span-4 font-semibold text-foreground">{h.day}</span>
                    <span className="col-span-4 text-center font-mono text-muted-foreground">{h.kitchen}</span>
                    <span className="col-span-4 text-right font-mono font-medium text-gold/90">{h.bar}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={4}
            className="md:col-span-3 md:pt-2"
          >
            <div className="mb-5 flex items-center gap-3 text-gold">
              <span className="text-sm font-black uppercase tracking-[0.25em]">Say Hello</span>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+16186814208"
                className="group flex items-center gap-3 text-lg text-muted-foreground transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} suppressHydrationWarning />
                (618) 681-4208
              </a>
              <a
                href="mailto:contact@thehiddenkitchen62.com"
                className="group flex items-center gap-3 break-all text-sm text-muted-foreground transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} suppressHydrationWarning />
                contact@thehiddenkitchen62.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-gold/15 pt-8 flex items-center justify-between text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} The Hidden Kitchen</p>
        </footer>
      </div>
    </section>
  )
}
