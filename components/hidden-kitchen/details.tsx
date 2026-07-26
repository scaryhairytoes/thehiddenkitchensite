'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ExternalLink, Send, Briefcase } from 'lucide-react'
import { VelocitySkew } from './velocity-skew'
import { Footer } from './footer'

const hoursSchedule = [
  { day: 'Monday',     kitchen: 'Closed',       bar: 'Closed',           closed: true  },
  { day: 'Tue — Thu',  kitchen: '11 AM – 8 PM', bar: 'til Midnight',     closed: false },
  { day: 'Fri — Sat',  kitchen: '11 AM – 8 PM', bar: 'til Midnight',     closed: false },
  { day: 'Sunday',     kitchen: '11 AM – 8 PM', bar: '12 PM – Midnight', closed: false },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Details() {
  return (
    <section
      id="visit"
      className="relative z-30 w-full overflow-hidden bg-black text-foreground"
    >
      {/* Subtle background watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-[0.02] select-none overflow-hidden">
        <span className="text-[20vw] font-black uppercase leading-none tracking-tighter text-gold whitespace-nowrap">
          HIDDEN KITCHEN
        </span>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16 w-full">

        {/* ── SECTION HEADLINE ─────────────────────────────────────────────── */}
        <div className="py-14 sm:py-20 lg:py-24 text-center">
          <VelocitySkew intensity={4}>
            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-15%' }}
              custom={0}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] xl:text-[5vw] 2xl:text-[84px] font-black uppercase leading-[0.9] tracking-tighter text-balance"
            >
              <span className="text-white">Pull up a chair.</span>
              <br />
              <span className="gold-shimmer">You belong here.</span>
            </motion.h2>
          </VelocitySkew>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mt-5 flex items-center justify-center gap-3 sm:gap-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold/70"
          >
            <span className="h-px w-12 sm:w-20 bg-gold/30" />
            <span>131 S. Division St · Carterville, IL · Est. 2026</span>
            <span className="h-px w-12 sm:w-20 bg-gold/30" />
          </motion.div>
        </div>

        {/* ── MAIN EDITORIAL GRID ──────────────────────────────────────────── */}
        <div className="border-t border-zinc-900 pb-14 sm:pb-20 lg:pb-24">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y divide-zinc-900 lg:divide-y-0 lg:divide-x lg:divide-zinc-900">

            {/* ── COL 1 (span 4): Map + Contact ─────────────────────────── */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-4 py-10 lg:py-12 lg:pr-10 xl:pr-14 space-y-7"
            >
              <div className="flex items-center gap-2 text-gold">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Location</span>
              </div>

              {/* Map — full iframe on desktop only */}
              <div className="hidden sm:block relative overflow-hidden aspect-[4/3] w-full rounded-sm border border-zinc-900">
                <iframe
                  title="The Hidden Kitchen Location Map"
                  src="https://maps.google.com/maps?q=131%20S%20Division%20St,%20Carterville,%20IL%2062918&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full border-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Mobile compact directions tile */}
              <a
                href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden flex items-center justify-between gap-3 px-4 py-3.5 border border-zinc-900 hover:border-gold/30 rounded-sm transition-colors group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-gold transition-colors">131 S. Division St</p>
                  <p className="text-[11px] text-white/40">Carterville, IL 62918</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gold/50 shrink-0" />
              </a>

              {/* Address + Directions CTA — desktop only */}
              <div className="hidden sm:flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">131 S. Division St</p>
                  <p className="text-xs text-white/40">Carterville, IL 62918</p>
                </div>
                <a
                  href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm font-bold text-[11px] uppercase tracking-wider shrink-0"
                >
                  <span>Directions</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Contact — single source of truth */}
              <div className="border-t border-zinc-900 pt-6 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold/60">Contact</span>
                <div className="space-y-2 text-xs">
                  <a href="tel:+16186814208" className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors">
                    <Phone className="h-3.5 w-3.5 text-gold/50 shrink-0" strokeWidth={1.75} />
                    <span className="font-semibold">(618) 681-4208</span>
                  </a>
                  <a href="mailto:contact@thehiddenkitchen62.com" className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors">
                    <Mail className="h-3.5 w-3.5 text-gold/50 shrink-0" strokeWidth={1.75} />
                    <span className="font-semibold break-all">contact@thehiddenkitchen62.com</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── COL 2 (span 4): Hours ─────────────────────────────────── */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="lg:col-span-4 py-10 lg:py-12 lg:px-10 xl:px-14 space-y-6"
            >
              <div className="flex items-center gap-2 text-gold">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Hours of Operation</span>
              </div>

              {/* Operating hours schedule without helper subtext */}
              <div className="divide-y divide-zinc-900">
                {hoursSchedule.map((h, i) => (
                  <motion.div
                    key={h.day}
                    variants={reveal}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={i * 0.4 + 2}
                    className={`flex items-start justify-between gap-4 py-3.5 ${h.closed ? 'opacity-35' : ''}`}
                  >
                    <span className="text-xs font-semibold text-white w-28 shrink-0">{h.day}</span>
                    <div className="text-right space-y-0.5">
                      <p className="text-[11px] text-white/55 font-sans">
                        <span className="text-gold/60 font-bold text-[10px] uppercase tracking-wider mr-1.5">Kitchen</span>
                        {h.kitchen}
                      </p>
                      <p className="text-[11px] text-white/55 font-sans">
                        <span className="text-gold/60 font-bold text-[10px] uppercase tracking-wider mr-1.5">Bar</span>
                        {h.bar}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── COL 3 (span 4): Actions (Reservations & Careers) ──────── */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="lg:col-span-4 py-10 lg:py-12 lg:pl-10 xl:pl-14 space-y-7"
            >
              {/* Reservations Action & Context */}
              <div className="space-y-3">
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                  Walk-ins welcome. Reserve online or call ahead for large parties.
                </p>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/reservations"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-sm font-bold text-[11px] uppercase tracking-wider"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Reserve Online</span>
                  </Link>
                  <a
                    href="tel:+16186814208"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-zinc-900 text-white/60 hover:border-gold/30 hover:text-gold transition-all rounded-sm font-bold text-[11px] uppercase tracking-wider"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call to Reserve</span>
                  </a>
                </div>
              </div>

              {/* Careers Action & Context */}
              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                  We&apos;re always looking for passionate hospitality professionals.
                </p>
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 border border-zinc-900 text-white/60 hover:border-gold/30 hover:text-gold transition-all rounded-sm font-bold text-[11px] uppercase tracking-wider"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Careers</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </section>
  )
}
