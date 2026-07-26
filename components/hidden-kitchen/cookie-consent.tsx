'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ShieldCheck, CheckCircle2, Ban } from 'lucide-react'

const STORAGE_KEY = 'cookie_consent_given'

export type ConsentChoice = 'allow_all' | 'necessary' | 'deny'

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      // If on main page, wait 3.2s for the preloader ("Glad you're here") to finish sliding off
      // On subpages, pop up after a short 0.8s entrance delay
      const isHomePage = pathname === '/'
      const delay = isHomePage ? 3200 : 800

      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleConsent = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Handle quota / private browsing storage restrictions
    }
    setIsVisible(false)
  }

  // Prevent SSR hydration mismatches
  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 90, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 90, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-lg z-[90] pointer-events-auto"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-black/92 p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white font-sans space-y-4">
            
            {/* Ambient gold glow background */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gold/15 blur-2xl" />

            {/* Banner Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold shrink-0">
                  <Cookie className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    Cookie Preferences
                  </h3>
                  <p className="text-[10px] text-gold/80 font-bold uppercase tracking-wider">
                    The Hidden Kitchen
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleConsent('deny')}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                aria-label="Close cookie consent modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Banner Description */}
            <p className="text-xs text-white/80 leading-relaxed">
              We use cookies to ensure core website functionality, remember your preferences, and analyze site traffic. Read our{' '}
              <Link
                href="/privacy"
                className="text-gold font-semibold underline underline-offset-2 hover:text-gold/80 transition-colors"
              >
                Privacy Policy
              </Link>{' '}
              for details.
            </p>

            {/* Banner Actions — 3 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Deny */}
              <button
                onClick={() => handleConsent('deny')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <Ban className="h-3.5 w-3.5 opacity-60" />
                <span>Deny</span>
              </button>

              {/* Necessary Only */}
              <button
                onClick={() => handleConsent('necessary')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gold/40 bg-gold/10 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold/20 hover:text-white transition-all duration-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Necessary Only</span>
              </button>

              {/* Allow All */}
              <button
                onClick={() => handleConsent('allow_all')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold/90 transition-all duration-200 shadow-md shadow-gold/20"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Allow All</span>
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
