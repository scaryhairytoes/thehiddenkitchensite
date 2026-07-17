'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Phone, MapPin } from 'lucide-react'
import { useBusinessStatus } from './live-status'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const bottomY = useTransform(scrollYProgress, [0, 0.4], [0, 30])

  const status = useBusinessStatus()

  return (
    <section
      id="top"
      ref={ref}
      className="sticky top-0 z-0 flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,175,0,0.16),transparent_65%)] blur-2xl"
      />

      {/* Center logo */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <h1 className="sr-only">The Hidden Kitchen</h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-[85vw] w-[320px] sm:w-[450px] md:w-[580px] lg:w-[680px] aspect-[1300/806]"
        >
          <img
            src="/logo.svg"
            alt="The Hidden Kitchen Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Bottom bar — status + CTAs pinned to viewport bottom */}
      <motion.div
        style={{ opacity: bottomOpacity, y: bottomY }}
        className="absolute bottom-0 inset-x-0 z-20 pb-8 md:pb-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6"
        >
          {/* Live status — minimal inline text, no heavy pill */}
          {status && (
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]">
              <span className="relative flex h-2 w-2 shrink-0">
                {status.isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="font-bold text-foreground/90">
                {status.isOpen ? 'Open' : 'Closed'}
              </span>
              <span className="text-foreground/30">—</span>
              <span className="font-medium text-foreground/50">
                {status.detail}
              </span>
            </div>
          )}

          {/* CTA row — understated text-links with subtle divider */}
          <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.25em]">
            <a
              href="tel:+16186814208"
              className="group flex items-center gap-1.5 text-gold/70 transition-colors duration-300 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} suppressHydrationWarning />
              <span>Call</span>
            </a>

            <span className="h-3 w-px bg-gold/20" aria-hidden />

            <a
              href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-gold/70 transition-colors duration-300 hover:text-gold"
            >
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} suppressHydrationWarning />
              <span>Directions</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
