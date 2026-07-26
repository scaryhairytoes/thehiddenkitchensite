'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
      className="relative overflow-x-clip bg-black w-full flex flex-col justify-center items-center py-12 md:py-16 lg:py-20"
    >
      {/* ── Background System (Vintage Documentary Photo) ──────────── */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
          
          {/* Ambient Warmth Background (Animated Gold/Amber Glow) */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            {/* Right side gold glow */}
            <div className="absolute top-[-10%] right-[-5%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,_rgba(214,175,0,0.4)_0%,_transparent_60%)] blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            
            {/* Left side amber glow */}
            <div className="absolute bottom-[-10%] left-[0%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(184,115,51,0.3)_0%,_transparent_60%)] blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
          </div>

          {/* Soft vignette on the left to ensure text readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/80 via-black/30 to-transparent"
          />
        </div>

        {/* Top & Bottom Vignettes for seamless transitions (placed OUTSIDE sticky) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 md:h-28 pointer-events-none bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 md:h-28 pointer-events-none bg-gradient-to-t from-black to-transparent"
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

          <div className="pt-2 border-l-2 border-gold/80 pl-4 mb-10">
            <p className="text-pretty text-lg font-bold leading-snug tracking-tight text-white md:text-xl font-sans">
              Strangers become regulars. Regulars become family.{' '}
              <span className="gold-shimmer inline-block pr-2">That&apos;s the whole plan.</span>
            </p>
          </div>
          
          {/* Editorial Family Photo Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/9] rounded-sm overflow-hidden border border-gold/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
            <Image
              src="/images/family.jpg"
              alt="The Hidden Kitchen family and staff"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="h-full w-full object-cover object-[center_20%] transition-transform duration-1000 group-hover:scale-105 filter grayscale sepia-[0.2] contrast-110"
            />
            {/* Subtle vintage overlay on the photo */}
            <div className="absolute inset-0 bg-gold/10 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Story