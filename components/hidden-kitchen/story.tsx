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
      className="relative overflow-hidden bg-black w-full flex flex-col justify-center items-center py-12 md:py-16 lg:py-20"
    >
      {/* ── Background System (Ultra-Smooth Dark Blended Family Photo) ──────────── */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden bg-black">
        {/* Family photo wrapper - framed so all family members sit clearly on the right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[70%] sm:w-[62%] md:w-[58%] lg:w-[55%] xl:w-[54%] pointer-events-none [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)]">
          <img
            src="/images/family.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[32%_20%] opacity-55 contrast-105 saturate-105 select-none"
          />
        </div>

        {/* Global Dark Tint Overlay Layer (matching video sections) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-black/45"
        />

        {/* Continuous Full-Width Horizontal Fade — protects left header column while leaving family fully visible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-black/80 via-35% to-transparent"
        />

        {/* Ultra-Smooth Top & Bottom Vignettes — seamless natural flow into surrounding sections */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 md:h-28 pointer-events-none bg-gradient-to-b from-black via-black/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 md:h-28 pointer-events-none bg-gradient-to-t from-black via-black/60 to-transparent"
        />
      </div>

      {/* ── Foreground Content — explicitly z-10 ───────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full max-w-6xl mx-auto px-6 py-8">

        {/* Left Column — Crisp Sharp Vector Typography */}
        <div>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            custom={1}
            className="text-[13vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground lg:text-[7.5vw]"
          >
            Everyone<br />
            <span className="gold-shimmer inline-block pr-3 leading-none">Belongs</span><br />
            Here
          </motion.h2>
        </div>

        {/* Right Column — Clean Sharp Text */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15%' }}
          custom={2}
          className="space-y-6"
        >
          <p className="text-pretty text-base leading-relaxed text-white/90 md:text-lg font-sans">
            What happens when you combine a family, a stove, a few tables, and a stubborn belief that a night out should feel like coming home? You get a place built entirely for the community.
          </p>

          <p className="text-pretty text-base leading-relaxed text-white/90 md:text-lg font-sans">
            We don&apos;t do velvet ropes or exclusive handshakes. Our only mission is to give everyone a space where they truly belong. From the local talent at our weekly live music to the comfort on your plate, everything we do is about bringing people together.
          </p>

          <div className="pt-2 border-l-2 border-gold/80 pl-4">
            <p className="text-pretty text-lg font-bold leading-snug tracking-tight text-white md:text-xl font-sans">
              Strangers become regulars. Regulars become family.{' '}
              <span className="gold-shimmer inline-block pr-2">That&apos;s the whole plan.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

