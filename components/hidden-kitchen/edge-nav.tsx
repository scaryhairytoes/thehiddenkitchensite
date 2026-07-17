'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu as MenuIcon, X, Phone, MapPin } from 'lucide-react'
import { useBusinessStatus } from './live-status'

const SECTIONS = [
  { id: 'story', label: 'The Story' },
  { id: 'menu', label: 'The Menu' },
  { id: 'stage', label: 'The Stage' },
  { id: 'visit', label: 'The Details' },
]

function NavStatus() {
  const status = useBusinessStatus()
  if (!status) return null
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
      <span className="relative flex h-[6px] w-[6px] shrink-0">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-[6px] w-[6px] rounded-full ${
            status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
      </span>
      <span className="font-bold text-foreground/80">
        {status.isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  )
}

export function EdgeNav() {
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [dimensions, setDimensions] = useState({
    startTop: 0,
    endTop: 40,
    startSize: 220,
    endSize: 48
  })

  const dimensionsRef = useRef(dimensions)

  useEffect(() => {
    dimensionsRef.current = dimensions
  }, [dimensions])

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768
      const vh50 = window.innerHeight / 2
      setDimensions({
        startTop: isMobile ? vh50 - 47 : vh50 - 80,
        endTop: isMobile ? 32 : 40,
        startSize: isMobile ? 120 : 220,
        endSize: isMobile ? 44 : 56
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const { scrollY } = useScroll()
  const logoOpacity = useTransform(scrollY, [100, 300], [0, 1])
  const statusOpacity = useTransform(scrollY, [150, 320], [0, 1])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'top') {
              setActive(null)
            } else {
              setActive(entry.target.id)
            }
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    const ids = ['top', 'story', 'menu', 'stage', 'visit']
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[80] w-full h-16 md:h-20 bg-black transition-all duration-300">
        <div className="relative mx-auto max-w-[1500px] h-full flex items-center justify-between">
          
          {/* Desktop Left Half (Story, Menu) */}
          <div className="hidden md:flex w-1/2 h-full justify-evenly items-center pr-8">
            <button
              onClick={() => go('story')}
              className={`relative py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                active === 'story' ? 'text-gold' : 'text-foreground/50 hover:text-gold'
              }`}
            >
              The Story
              {active === 'story' && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => go('menu')}
              className={`relative py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                active === 'menu' ? 'text-gold' : 'text-foreground/50 hover:text-gold'
              }`}
            >
              The Menu
              {active === 'menu' && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Desktop Right Half (Stage, Details) */}
          <div className="hidden md:flex w-1/2 h-full justify-evenly items-center pl-8">
            <button
              onClick={() => go('stage')}
              className={`relative py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                active === 'stage' ? 'text-gold' : 'text-foreground/50 hover:text-gold'
              }`}
            >
              The Stage
              {active === 'stage' && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => go('visit')}
              className={`relative py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                active === 'visit' ? 'text-gold' : 'text-foreground/50 hover:text-gold'
              }`}
            >
              The Details
              {active === 'visit' && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Mobile Navbar */}
          <div className="flex md:hidden mx-auto h-full items-center justify-between px-6 w-full">
            <div className="w-10" />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gold/80 hover:text-gold p-2 transition-colors focus:outline-none w-10 flex justify-end"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {menuOpen ? (
                <X className="h-6 w-6" suppressHydrationWarning />
              ) : (
                <MenuIcon className="h-6 w-6" suppressHydrationWarning />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Floating inline status on scroll */}
      <motion.div
        style={{ opacity: menuOpen ? 0 : statusOpacity }}
        className="fixed top-4 left-4 md:top-6 md:left-8 z-[95] pointer-events-auto"
      >
        <NavStatus />
      </motion.div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-[75] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="flex flex-col items-center gap-6">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    go(s.id)
                    setMenuOpen(false)
                  }}
                  className={`text-xl font-bold uppercase tracking-[0.35em] transition-colors duration-300 ${
                    active === s.id ? 'text-gold' : 'text-foreground/60'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Mobile CTAs — minimal text links */}
            <div className="mt-2 flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.25em]">
              <a
                href="tel:+16186814208"
                className="flex items-center gap-1.5 text-gold/70 transition-colors hover:text-gold"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={1.75} /> Call
              </a>
              <span className="h-3 w-px bg-gold/20" aria-hidden />
              <a
                href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gold/70 transition-colors hover:text-gold"
              >
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} /> Directions
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-left: vertical scroll hint */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[70] hidden items-center gap-2 md:flex md:left-6 md:bottom-6">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-[9px] font-semibold uppercase tracking-[0.35em] text-gold/70"
        >
          Scroll
        </motion.span>
      </div>

      {/* Floating Snapping Logo Symbol */}
      <motion.button
        onClick={() => go('top')}
        style={{
          top: dimensions.endTop,
          width: dimensions.endSize,
          height: dimensions.endSize,
          opacity: menuOpen ? 0 : logoOpacity,
        }}
        suppressHydrationWarning
        className={`fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] flex items-center justify-center focus:outline-none transition-all duration-300 ${
          menuOpen ? 'pointer-events-none' : ''
        }`}
        aria-label="The Hidden Kitchen Symbol — back to top"
      >
        <img
          src="/logo_only.svg"
          alt="The Hidden Kitchen Symbol"
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </motion.button>
    </>
  )
}
