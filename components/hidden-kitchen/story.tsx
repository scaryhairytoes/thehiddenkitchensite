'use client'

import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Story() {
  return (
    <section
      id="story"
      className="sticky top-0 z-10 min-h-screen w-full overflow-hidden bg-black pt-24 pb-20 md:pt-[15vh] lg:pt-[18vh]"
    >
      {/* ambient warmth */}
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(214,175,0,0.12),transparent_60%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-16 w-full">
        {/* Headline & Paragraph Grid */}
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-12 lg:items-center">
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            custom={1}
            className="col-span-1 text-balance text-[13vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground lg:col-span-6 lg:text-[7.5vw]"
          >
            Everyone
            <br />
            <span className="gold-shimmer">Belongs</span> Here
          </motion.h2>

          {/* All 3 paragraphs formatted together */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            custom={2}
            className="col-span-1 space-y-6 lg:col-span-6"
          >
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              What happens when you combine a family, a stove, a few tables, and a stubborn belief that a night out should feel like coming home? You get a place built entirely for the community.
            </p>
            
            <p className="text-pretty text-base leading-relaxed text-foreground/80 md:text-lg">
              We don&apos;t do velvet ropes or exclusive handshakes. Our only mission is to give everyone a space where they truly belong. From the local talent at our weekly live music to the comfort on your plate, everything we do is about bringing people together.
            </p>

            <div className="pt-2 border-l-2 border-gold/60 pl-4">
              <p className="text-pretty text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl">
                Strangers become regulars. Regulars become family.{' '}
                <span className="gold-shimmer block sm:inline">That&apos;s the whole plan.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
