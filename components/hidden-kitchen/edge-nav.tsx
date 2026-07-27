'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Menu as MenuIcon, X, Phone, MapPin } from 'lucide-react'
import { UpNext } from './up-next'
import { usePathname } from 'next/navigation'

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
      setLogoSize({ top: isMobile ? 32 : 36, size: isMobile ? 48 : 56 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { scrollY } = useScroll()
  const logoOpacity = useTransform(scrollY, [100, 300], [0, 1])

  const [isSticky, setIsSticky] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (typeof window !== 'undefined') {
      // It docks at the top when we scroll exactly the height of the hero (100vh)
      // Trigger slightly early to ensure it's glass when it hits the top
      if (latest >= window.innerHeight - 20) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }
  })

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

  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .desktop-links-container {
            display: flex !important;
            justify-content: space-evenly !important;
          }
          .mobile-hamburger-container {
            display: none !important;
          }
        }
        .master-header-gradient {
          background: linear-gradient(to bottom, #000000 0%, #000000 55%, transparent 100%) !important;
          border: none !important;
        }
        .master-header-glass {
          background-color: rgba(20, 20, 20, 0.4) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: none !important;
        }
        .inner-nav-row {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 12px 4vw !important;
        }
      `}</style>
      <div 
        className={`${isSticky ? 'master-header-glass' : 'master-header-gradient'} sticky top-0 z-[50] w-full transition-colors duration-300`}
      >
        <header className="inner-nav-row w-full transition-all duration-300">
          <div
            className="desktop-links-container hidden w-full items-center"
          >
          <button
            onClick={() => go('story')}
            className={`flex items-center justify-center py-3 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ![background:transparent] ![background-color:transparent] ![box-shadow:none] ${active === 'story' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Story
          </button>

          <button
            onClick={() => go('menu')}
            className={`flex items-center justify-center py-3 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ![background:transparent] ![background-color:transparent] ![box-shadow:none] ${active === 'menu' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Menu
          </button>

          <div aria-hidden style={{ width: 'clamp(240px, 25vw, 360px)' }} />

          <button
            onClick={() => go('stage')}
            className={`flex items-center justify-center py-3 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ![background:transparent] ![background-color:transparent] ![box-shadow:none] ${active === 'stage' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Stage
          </button>

          <button
            onClick={() => go('visit')}
            className={`flex items-center justify-center py-3 text-xs xl:text-sm font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ![background:transparent] ![background-color:transparent] ![box-shadow:none] ${active === 'visit' ? 'text-gold' : 'text-foreground/40 hover:text-gold'
              }`}
          >
            The Details
          </button>
        </div>

        <div className="mobile-hamburger-container flex w-full items-center justify-between px-6">
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
      <UpNext />
    </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-[75] bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-center md:hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-white transition-transform hover:scale-110 hover:text-gold focus:outline-none"
              aria-label="Close Menu"
            >
              <X className="h-8 w-8" strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <div className="mb-12">
              <Image
                src="/logo_only.svg"
                alt="The Hidden Kitchen Symbol"
                width={112}
                height={112}
                unoptimized
                className="brightness-0 invert" 
              />
            </div>

            <div className="flex flex-col items-center gap-5 w-full">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    go(s.id)
                    setMenuOpen(false)
                  }}
                  className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white hover:text-gold transition-colors duration-300 text-center w-full"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-5 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              <a
                href="tel:+16186814208"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4" strokeWidth={2} /> Call
              </a>
              <span className="h-3 w-px bg-white/30" aria-hidden />
              <a
                href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <MapPin className="h-4 w-4" strokeWidth={2} /> Directions
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => go('top')}
        style={{
          top: logoSize.top,
          width: logoSize.size,
          height: logoSize.size,
          opacity: menuOpen || active === 'menu' || active === 'stage' ? 0 : logoOpacity,
        }}
        suppressHydrationWarning
        className={`fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[50] flex items-center justify-center focus:outline-none transition-all duration-300 ${menuOpen ? 'pointer-events-none' : ''
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