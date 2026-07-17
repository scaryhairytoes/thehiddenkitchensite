'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { lineup } from './lineup'
import { TonightOnStage } from './tonight-on-stage'
import { VelocitySkew } from './velocity-skew'

export function Stage() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.08])

  return (
    <section
      id="stage"
      ref={ref}
      className="relative z-30 min-h-screen w-full overflow-hidden bg-black pt-24 pb-20 md:pt-[15vh] lg:pt-[18vh]"
    >
      {/* atmosphere background image */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <img
          src="/images/stage.png"
          alt="A band performing under warm golden stage lights at The Hidden Kitchen"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-16 w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left column: Title & Description & Tonight status */}
          <div className="col-span-1 lg:col-span-5">
            <VelocitySkew intensity={5}>
              <h2 className="text-[20vw] font-black uppercase leading-[0.8] tracking-tighter text-foreground sm:text-[15vw] lg:text-[8.5vw]">
                <span className="block">The</span>
                <span className="gold-shimmer block">Stage</span>
              </h2>
            </VelocitySkew>
            
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Every week, the room comes alive with the best live music in town. No cover, just walk in, grab a glass, and join the energy.
            </p>

            {/* Tonight on stage status callout */}
            <TonightOnStage />
          </div>

          {/* Right column: Condensed & styled weekly schedule */}
          <div className="col-span-1 lg:col-span-7">
            <div className="rounded-2xl border border-gold/20 bg-black/85 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-gold/15 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-gold">
                  Weekly Schedule
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold/80">
                  No Cover · Always Free
                </span>
              </div>

              <div className="grid gap-3">
                {lineup.map((show, i) => (
                  <motion.div
                    key={show.day}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-gold/10 bg-black/50 p-4 transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.03]"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="w-10 font-mono text-sm font-bold uppercase tracking-widest text-gold shrink-0">
                        {show.day}
                      </span>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-gold transition-colors md:text-2xl">
                          {show.act}
                        </h3>
                        {show.genre && <p className="mt-0.5 text-xs text-muted-foreground">{show.genre}</p>}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-gold/80">
                      To Be Announced
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
                Artist announcements updated weekly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
