'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Story() {
  return (
    <section
      id="story"
      className="relative w-full min-h-[80vh] lg:min-h-screen bg-[#050505] text-white overflow-hidden"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center min-h-[80vh] lg:min-h-screen">
        {/* ── Left Half: Photo Fading into Center ─────────────────────── */}
        <div className="relative h-[450px] sm:h-[550px] lg:h-full min-h-[500px] lg:min-h-screen w-full overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_100%)] lg:[mask-image:linear-gradient(to_right,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)]">
          <Image
            src="/images/family.jpg"
            alt="The Hidden Kitchen family and staff"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
            className="h-full w-full object-cover object-[center_20%] filter contrast-115 brightness-90 sepia-[.40] hue-rotate-[-10deg] saturate-120"
          />

          {/* Warm gold tint overlay */}
          <div className="absolute inset-0 bg-[#C2A370]/10 mix-blend-color pointer-events-none" />

          {/* Slight dark overlay to improve text legibility */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        </div>

        {/* ── Right Half: Headline, Body Text, and Quote Block ───────── */}
        <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 xl:px-24 py-12 lg:py-24 space-y-8">
          {/* Headline */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={1}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
              EVERYONE<br />
              <span className="gold-shimmer inline-block pr-3 leading-none">
                BELONGS
              </span><br />
              HERE
            </h2>
          </motion.div>

          {/* Narrative Body Text */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={2}
            className="text-gray-300 text-base lg:text-lg xl:text-xl leading-relaxed space-y-6 font-sans font-normal"
          >
            <p className="text-pretty">
              What happens when you combine a family, a stove, a few tables, and a stubborn belief that a night out should feel like coming home? You get a place built entirely for the community.
            </p>
            <p className="text-pretty">
              We don&apos;t do velvet ropes or exclusive handshakes. Our only mission is to give everyone a space where they truly belong. From the local talent at our weekly live music to the comfort on your plate, everything we do is about bringing people together.
            </p>
          </motion.div>

          {/* Quote Block */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            custom={3}
            className="border-l border-[#C2A370]/40 pl-6 py-2"
          >
            <p className="text-white font-medium text-lg lg:text-xl xl:text-2xl leading-relaxed">
              Strangers become regulars. Regulars become family.{' '}
              <span className="gold-shimmer font-black ml-1">
                That&apos;s the whole plan.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Story