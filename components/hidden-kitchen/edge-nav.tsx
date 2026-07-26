'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu as MenuIcon, X, Phone, MapPin } from 'lucide-react'

const SECTIONS = [
  { id: 'story', label: 'The Story' },
  { id: 'menu', label: 'The Menu' },
  { id: 'stage', label: 'The Stage' },
  { id: 'visit', label: 'The Details' },
]

export function EdgeNav() {
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoSize, setLogoSize] = useState({ top: 40, size: 56 })

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768
      setLogoSize({ top: isMobile ? 32 : 40, size: isMobile ? 44 : 56 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { scrollY } = useScroll()
  const logoOpacity = useTransform(scrollY, [100, 300], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      const storyEl = document.getElementById('story')
      const heroThreshold = storyEl ? storyEl.offsetTop - 120 : window.innerHeight * 0.6

      if (window.scrollY < heroThreshold) {
        setActive(null)
        return
      }

      const ids = ['story', 'menu', 'stage', 'visit']
      const viewportCenter = window.innerHeight * 0.4

      let currentActive: string | null = null
      let minDistance = Infinity

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            currentActive = id
            break
          }
          const dist = Math.abs(rect.top - viewportCenter)
          if (dist < minDistance) {
            minDistance = dist
            currentActive = id
          }
        }
      }

      setActive(currentActive)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const go = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(id)
      if (el) {
        const headerOffset = window.innerWidth < 768 ? 64 : 80
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[80] w-full h-16 md:h-20 bg-black transition-all duration-300">
        <div
          className="hidden md:grid w-full h-full items-center px-6 lg:px-10 xl:px-16"
          style={{ gridTemplateColumns: '1fr 1fr clamp(240px, 25vw, 360px) 1fr 1fr' }}
        >
          <button
            onClick={() => go('story')}
            className={`flex items-center justify-center py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${active === 'story' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Story
          </button>

          <button
            onClick={() => go('menu')}
            className={`flex items-center justify-center py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${active === 'menu' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Menu
          </button>

          <div aria-hidden />

          <button
            onClick={() => go('stage')}
            className={`flex items-center justify-center py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${active === 'stage' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Stage
          </button>

          <button
            onClick={() => go('visit')}
            className={`flex items-center justify-center py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${active === 'visit' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Details
          </button>
        </div>

        <div className="flex md:hidden w-full h-full items-center justify-between px-6">
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
      </header>

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
                  className={`text-xl font-bold uppercase tracking-[0.35em] transition-colors duration-300 ${active === s.id ? 'text-gold' : 'text-foreground/60 hover:text-gold'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

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

      <div className="pointer-events-none fixed bottom-4 left-4 z-[70] hidden items-center gap-2 md:flex md:left-6 md:bottom-6">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-[9px] font-semibold uppercase tracking-[0.35em] text-gold/70"
        >
          Scroll
        </motion.span>
      </div>

      <motion.button
        onClick={() => go('top')}
        style={{
          top: logoSize.top,
          width: logoSize.size,
          height: logoSize.size,
          opacity: menuOpen ? 0 : logoOpacity,
        }}
        suppressHydrationWarning
        className={`fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] flex items-center justify-center focus:outline-none transition-all duration-300 ${menuOpen ? 'pointer-events-none' : ''
          }`}
        aria-label="The Hidden Kitchen Symbol — back to top"
      >
        <Image
          src="/logo_only.svg"
          alt="The Hidden Kitchen Symbol"
          width={56}
          height={56}
          unoptimized
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
      </motion.button>
    </>
  )
}

export default EdgeNav