'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Phone, MapPin } from 'lucide-react'
import { useBusinessStatus } from '@/components/hidden-kitchen/live-status'

export function Hero() {
  const { scrollY } = useScroll()

  const titleScale = useTransform(scrollY, [0, 400], [1, 0.86])
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const bottomOpacity = useTransform(scrollY, [0, 20], [1, 0])
  const bottomY = useTransform(scrollY, [0, 100], [0, -100])

  const status = useBusinessStatus()

  const scrollToVisit = () => {
    const el = document.getElementById('visit')
    if (el) {
      const headerOffset = window.innerWidth < 768 ? 64 : 80
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="top"
      className="sticky top-0 z-0 flex h-[100dvh] min-h-[540px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Center logo */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center py-6 sm:py-8"
      >
        <h1 className="sr-only">The Hidden Kitchen</h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-[85vw] w-[240px] sm:w-[380px] md:w-[500px] lg:w-[600px] xl:w-[680px] 2xl:w-[740px] max-h-[42vh] sm:max-h-[46vh] md:max-h-[48vh] aspect-[1300/842]"
        >
          <Image
            src="/logo.svg"
            alt="The Hidden Kitchen Logo"
            fill
            priority
            unoptimized
            className="w-full h-full max-h-[42vh] sm:max-h-[46vh] md:max-h-[48vh] object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Bottom bar — status + CTAs pinned to viewport bottom */}
      <motion.div
        style={{ opacity: bottomOpacity, y: bottomY }}
        className="absolute bottom-5 sm:bottom-8 md:bottom-10 inset-x-0 z-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mx-auto flex max-w-xl xl:max-w-2xl flex-col items-center gap-3 sm:gap-4 xl:gap-5 px-6"
        >
          {/* Live status line — seamless, borderless, single-line across all screen sizes, links to Hours (#visit) */}
          {status && (
            <button
              onClick={scrollToVisit}
              className="group flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] xl:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors duration-300 cursor-pointer whitespace-nowrap"
              title="Click to view complete Location & Hours"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                {status.isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                />
              </span>
              <span className="font-bold text-foreground/90 group-hover:text-gold transition-colors">
                {status.label}
              </span>
              <span className="text-foreground/30">—</span>
              <span className="font-medium text-foreground/60 group-hover:text-gold/80 transition-colors">
                {status.detail}
              </span>
            </button>
          )}

          {/* CTA row — understated text-links with subtle divider */}
          <div className="flex items-center gap-6 xl:gap-8 text-[11px] xl:text-[13px] font-semibold uppercase tracking-[0.25em]">
            <a
              href="tel:+16186814208"
              className="group flex items-center gap-1.5 text-gold/80 transition-colors duration-300 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gold" strokeWidth={1.75} suppressHydrationWarning />
              <span>Call</span>
            </a>

            <span className="h-3 w-px bg-gold/30" aria-hidden />

            <a
              href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-gold/80 transition-colors duration-300 hover:text-gold"
            >
              <MapPin className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gold" strokeWidth={1.75} suppressHydrationWarning />
              <span>Directions</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero