'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Phone, Mail, Calendar, Briefcase, Clock, ExternalLink, ChevronUp, Send } from 'lucide-react'
import { VelocitySkew } from './velocity-skew'

const hoursSchedule = [
  { day: 'Monday', kitchen: 'Closed', bar: 'Closed' },
  { day: 'Tuesday — Thursday', kitchen: '11:00 AM – 8:00 PM', bar: '11:00 AM – 12:00 AM' },
  { day: 'Friday — Saturday', kitchen: '11:00 AM – 8:00 PM', bar: '11:00 AM – 12:00 AM' },
  { day: 'Sunday', kitchen: '11:00 AM – 8:00 PM', bar: '12:00 PM – 12:00 AM' },
]

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Details() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section
      id="visit"
      className="relative z-30 w-full flex flex-col justify-between overflow-hidden bg-black py-12 sm:py-16 lg:py-20 text-foreground"
    >

      {/* Background Watermark Text */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-[0.025] select-none overflow-hidden">
        <span className="text-[22vw] sm:text-[18vw] font-black uppercase leading-none tracking-tighter text-gold whitespace-nowrap">
          HIDDEN KITCHEN
        </span>
      </div>

      <div className="relative mx-auto max-w-[1500px] xl:max-w-screen-2xl px-5 sm:px-8 md:px-12 xl:px-16 w-full flex-1 flex flex-col justify-between space-y-12 sm:space-y-16">
        
        {/* Tier 1: Symmetrical Headline Banner */}
        <div className="text-center w-full">
          <VelocitySkew intensity={4}>
            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-15%' }}
              custom={1}
              className="text-balance text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] xl:text-[5vw] 2xl:text-[84px] font-black uppercase leading-[0.9] sm:leading-[0.88] tracking-tighter text-foreground"
            >
              <span className="text-white font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">Pull up a chair.</span>
              <br />
              <span className="gold-shimmer font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">You belong here.</span>
            </motion.h2>
          </VelocitySkew>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/80 text-center"
          >
            <span className="hidden sm:block h-px w-12 sm:w-20 bg-gold/30" />
            <span>131 S. Division St · Carterville, IL · Est. 2026</span>
            <span className="hidden sm:block h-px w-12 sm:w-20 bg-gold/30" />
          </motion.div>
        </div>

        {/* Tier 2: Spacious 2-Column Editorial Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 border-t border-b border-gold/20 py-10 sm:py-14">
          
          {/* Column 1: Location & Hours */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="space-y-10 lg:border-r lg:border-white/10 lg:pr-12"
          >
            {/* Location Sub-Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-black uppercase tracking-[0.25em]">Location & Directions</span>
              </div>

              <div className="relative overflow-hidden aspect-[16/9] w-full border border-gold/20 rounded-sm shadow-2xl">
                <iframe
                  title="The Hidden Kitchen Location Map"
                  src="https://maps.google.com/maps?q=131%20S%20Division%20St,%20Carterville,%20IL%2062918&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                  className="h-full w-full border-0 opacity-85 hover:opacity-100 transition-opacity"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-sm font-bold text-white">131 S. Division St</p>
                  <p className="text-xs text-white/70 font-sans">Carterville, IL 62918</p>
                </div>
                <a
                  href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm font-bold text-xs uppercase tracking-wider font-sans"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Hours Sub-Block */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-gold">
                <Clock className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-black uppercase tracking-[0.25em]">Hours of Operation</span>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs font-sans text-left">
                  <thead>
                    <tr className="border-b border-gold/20 text-gold text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-2 font-bold">Day</th>
                      <th className="py-2 text-center font-bold">Kitchen</th>
                      <th className="py-2 text-right font-bold">Bar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {hoursSchedule.map((h) => (
                      <tr key={h.day} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-semibold text-white">{h.day}</td>
                        <td className="py-3 text-center text-white/70">{h.kitchen}</td>
                        <td className="py-3 text-right font-bold text-gold">{h.bar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Reservations, Careers & Contact */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3}
            className="space-y-10"
          >
            {/* Reservations Sub-Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-black uppercase tracking-[0.25em]">Reservations</span>
              </div>

              <p className="text-sm text-white/90 leading-relaxed text-pretty font-sans">
                Walk-ins are always welcome. For large parties, special events, or guaranteed seating, give us a call or submit an online reservation&nbsp;request.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+16186814208"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm font-bold text-xs uppercase tracking-wider text-center font-sans"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call (618) 681-4208</span>
                </a>
                <Link
                  href="/reservations"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/15 text-white hover:border-gold hover:text-gold transition-all rounded-sm font-bold text-xs uppercase tracking-wider text-center font-sans"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reserve Online</span>
                </Link>
              </div>
            </div>

            {/* Careers Sub-Block */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-gold">
                <Briefcase className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-black uppercase tracking-[0.25em]">Careers</span>
              </div>

              <p className="text-sm text-white/90 leading-relaxed text-pretty font-sans">
                We are always looking for passionate, hospitality-minded individuals to join our growing family. Build a career doing what&nbsp;you&nbsp;love.
              </p>

              <div className="pt-2">
                <Link
                  href="/careers"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm font-bold text-xs uppercase tracking-wider font-sans"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Join Our Family</span>
                </Link>
              </div>
            </div>

            {/* Contact Sub-Block */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-gold">
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-black uppercase tracking-[0.25em]">Contact</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-sans">
                <a
                  href="tel:+16186814208"
                  className="inline-flex items-center gap-2 text-white font-bold hover:text-gold transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-gold" />
                  <span>(618) 681-4208</span>
                </a>

                <span className="hidden sm:inline text-gold/30">|</span>

                <a
                  href="mailto:contact@thehiddenkitchen62.com"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors break-all"
                >
                  <Mail className="h-3.5 w-3.5 text-gold" />
                  <span>contact@thehiddenkitchen62.com</span>
                </a>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Tier 3: Bottom Luxury Brand Footer Anchor */}
        <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 font-sans text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo_only.svg" alt="Emblem" className="h-6 w-6 opacity-70" />
            <p>© {new Date().getFullYear()} The Hidden Kitchen. All rights reserved.</p>
          </div>

          <p className="uppercase tracking-widest text-[10px] text-gold/50">Carterville · Illinois</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold/80 hover:text-gold transition-colors py-1"
          >
            <span>Back to Top</span>
            <ChevronUp className="h-4 w-4" />
          </button>
        </footer>

      </div>
    </section>
  )
}
