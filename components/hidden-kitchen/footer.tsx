'use client'

import Link from 'next/link'
import { ChevronUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative z-30 w-full bg-black border-t border-zinc-900 text-foreground font-sans">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16 w-full py-7 sm:py-8">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">

          {/* Logo asset — stands entirely alone, no text adjacent or underneath */}
          <img
            src="/logo.svg"
            alt="The Hidden Kitchen"
            width={160}
            height={104}
            className="h-9 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
          />

          {/* Compact nav links — single dot-separated row */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-white/45 font-medium" aria-label="Footer navigation">
            <Link href="/"               className="hover:text-gold transition-colors">Home</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/#menu"          className="hover:text-gold transition-colors">Menu</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/#stage"         className="hover:text-gold transition-colors">Stage</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/reservations"   className="hover:text-gold transition-colors">Reservations</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/book-the-stage" className="hover:text-gold transition-colors">Book the Stage</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/careers"        className="hover:text-gold transition-colors">Careers</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/privacy"        className="hover:text-gold transition-colors">Privacy</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/terms"          className="hover:text-gold transition-colors">Terms</Link>
            <span className="text-white/20" aria-hidden>·</span>
            <Link href="/accessibility"  className="hover:text-gold transition-colors">Accessibility</Link>
          </nav>

          {/* Copyright + Back to Top */}
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-white/30 whitespace-nowrap">
              © {new Date().getFullYear()} The Hidden Kitchen
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold/70 hover:text-gold transition-colors cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
