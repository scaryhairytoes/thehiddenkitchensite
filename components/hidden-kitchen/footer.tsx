'use client'

import Link from 'next/link'

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer id="visit" className="relative z-30 w-full bg-black text-foreground font-sans border-t border-zinc-900 py-16 lg:py-24 flex flex-col items-center text-center">
      <div className="w-full max-w-[1440px] px-6 sm:px-10 lg:px-16 flex flex-col items-center">
        
        {/* 1. FIRST ELEMENT: The Massive Anchor */}
        <h2 className="pt-12 lg:pt-20 text-[12vw] sm:text-[10vw] lg:text-[8vw] xl:text-[120px] font-black uppercase leading-[0.85] tracking-tighter text-white mb-8">
          <span className="block text-balance">Pull up a chair</span>
          <span className="block text-balance mt-1 sm:mt-2">You belong here</span>
        </h2>
        
        {/* 2. SECOND ELEMENT: Primary CTA */}
        <Link
          href="/reservations"
          className="inline-flex items-center justify-center gold-shimmer font-black uppercase tracking-tight text-3xl sm:text-5xl lg:text-[4vw] xl:text-[60px] hover:opacity-80 transition-opacity mb-8 lg:mb-12 p-4"
        >
          Book Your Seat Online <span className="ml-3 sm:ml-5 font-light opacity-80 text-2xl sm:text-4xl lg:text-[3.5vw] xl:text-[50px]">↗</span>
        </Link>

        {/* 3. THIRD ELEMENT: Secondary links row */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-2.5 lg:gap-6 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
          <a href="https://www.doordash.com/store/the-hidden-kitchen-carterville-47996853" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">ORDER DELIVERY</a>
          <span className="hidden lg:inline-block opacity-30 text-[#A0A0A0]">•</span>
          <a href="tel:+16186814208" className="hover:text-gold transition-colors">CALL TO RESERVE</a>
          <span className="hidden lg:inline-block opacity-30 text-[#A0A0A0]">•</span>
          <Link href="/careers" className="hover:text-gold transition-colors">JOIN THE FAMILY</Link>
        </div>

        {/* 4. FOURTH ELEMENT: The Divider */}
        <hr className="w-full max-w-5xl border-t border-zinc-900/60 my-10 lg:my-20" />

        {/* 5. FIFTH ELEMENT: Condensed Contact Line */}
        <address className="not-italic text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-widest mb-10 lg:mb-12 max-w-5xl px-4 leading-loose flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-0">
          <a 
            href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mx-2 text-center group"
          >
            <span className="text-[#B0B0B0] transition-colors group-hover:text-gold">131 S. DIVISION ST, CARTERVILLE, IL 62918</span>
          </a>
          <span className="hidden lg:inline-block mx-2 opacity-30 text-[#B0B0B0]">•</span>
          <a href="tel:+16186814208" className="inline-block mx-2 text-[#B0B0B0] hover:text-gold transition-colors text-center">(618) 681-4208</a>
          <span className="hidden lg:inline-block mx-2 opacity-30 text-[#B0B0B0]">•</span>
          <a href="mailto:contact@thehiddenkitchen62.com" className="inline-block mx-2 text-[#B0B0B0] hover:text-gold transition-colors text-center">CONTACT@THEHIDDENKITCHEN62.COM</a>
        </address>

        {/* 6. SIXTH ELEMENT: Condensed Hours Line */}
        <div className="text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-widest mb-12 lg:mb-16 max-w-5xl px-4 leading-loose flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-0">
          <span className="inline-block mx-2 text-center">
            <span className="text-[#B0B0B0]">MON:</span> <span className="text-[#B0B0B0]">CLOSED</span>
          </span>
          <span className="hidden lg:inline-block mx-2 opacity-30 text-[#B0B0B0]">•</span>
          <span className="inline-block mx-2 text-center">
            <span className="text-[#B0B0B0]">TUE - SAT:</span> <span className="text-[#B0B0B0]">11AM–8PM (BAR TIL MIDNIGHT)</span>
          </span>
          <span className="hidden lg:inline-block mx-2 opacity-30 text-[#B0B0B0]">•</span>
          <span className="inline-block mx-2 text-center">
            <span className="text-[#B0B0B0]">SUN:</span> <span className="text-[#B0B0B0]">11AM–8PM (BAR 12PM–MIDNIGHT)</span>
          </span>
        </div>

        {/* 7. SEVENTH ELEMENT: Bottom Utility Links & Copyright */}
        <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 sm:gap-10 leading-loose text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8" aria-label="Footer utility links">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <Link href="/#menu" className="hover:text-gold transition-colors">Menu</Link>
          <Link href="/#stage" className="hover:text-gold transition-colors">Stage</Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
          <Link href="/accessibility" className="hover:text-gold transition-colors">Accessibility</Link>
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white/20">
          <span>© {new Date().getFullYear()} THE HIDDEN KITCHEN</span>
          <span className="opacity-40">—</span>
          <button
            onClick={scrollToTop}
            className="text-white/30 hover:text-white/60 transition-colors cursor-pointer inline-flex items-center gap-1"
            aria-label="Scroll back to top"
          >
            TOP <span>^</span>
          </button>
        </div>

      </div>
    </footer>
  )
}
