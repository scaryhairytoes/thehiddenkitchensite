import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Accessibility, CheckCircle2, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react'
import { Footer } from '@/components/hidden-kitchen/footer'

export const metadata: Metadata = {
  title: 'Accessibility Statement | The Hidden Kitchen',
  description:
    'Accessibility Statement for The Hidden Kitchen demonstrating WCAG 2.1 AA alignment, digital accessibility features, physical venue accommodations, and feedback contact details.',
}

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-dvh bg-black text-white relative overflow-x-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0d0800]" />
        <div className="absolute top-0 left-1/3 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gold/4 blur-[180px]" />
      </div>

      {/* Page Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">
        {/* Header navigation bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 sm:py-5 border-b border-gold/15 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-sans text-gold/80 hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.25em] text-gold/60">
            The Hidden Kitchen
          </span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 font-sans space-y-12">
          {/* Hero Banner */}
          <div className="space-y-4 border-b border-gold/20 pb-8">
            <div className="flex items-center gap-2 text-gold">
              <Accessibility className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]">Inclusion & Access</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white gold-shimmer">
              Accessibility Statement
            </h1>
            <p className="text-xs text-gold/60 uppercase tracking-widest font-semibold">
              WCAG 2.1 AA Alignment · Last Updated: July 2026
            </p>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl pt-2">
              At The Hidden Kitchen, we believe that dining and live entertainment should be welcoming and accessible to everyone. We are committed to ensuring digital accessibility for people of all abilities and continuously improving the user experience for everyone.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-white/85">
            
            {/* Section 1: WCAG Alignment */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  1. WCAG 2.1 AA Standards Alignment
                </h2>
              </div>
              <p>
                To provide an inclusive experience, we aim to conform to the <strong className="text-white">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards defined by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible for people with visual, auditory, motor, and cognitive disabilities.
              </p>
            </section>

            {/* Section 2: Features Grid */}
            <section className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                2. Key Digital Accessibility Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" /> High Contrast & Dark Theme
                  </h3>
                  <p className="text-xs text-white/70">
                    Carefully chosen color contrast ratios between text elements and backgrounds to optimize legibility for low-vision users.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" /> Keyboard Navigation
                  </h3>
                  <p className="text-xs text-white/70">
                    All interactive buttons, reservation forms, and navigation menus are accessible via keyboard tab navigation with visible focus indicators.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" /> Screen Reader Compatibility
                  </h3>
                  <p className="text-xs text-white/70">
                    Constructed with semantic HTML5 elements, ARIA landmark tags, and descriptive alt text for visual media.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" /> Responsive Text Scaling
                  </h3>
                  <p className="text-xs text-white/70">
                    Fully responsive layout supporting text resizing up to 200%+ without loss of content or breaking site navigation.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Physical Accommodations */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <HeartHandshake className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  3. Physical Venue Accommodations
                </h2>
              </div>
              <p>
                We are committed to providing equal physical access at our restaurant and live stage in Carterville, IL:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li><strong className="text-white">Wheelchair Accessible Entrance:</strong> Ground-level ramp and accessible main entrance.</li>
                <li><strong className="text-white">Accessible Dining & Bar Seating:</strong> Wheelchair-friendly tables and spacious seating configurations.</li>
                <li><strong className="text-white">ADA Restrooms:</strong> Fully accessible restroom facilities equipped with grab bars.</li>
                <li><strong className="text-white">Service Animals:</strong> Trained service animals are always welcome throughout the dining room and venue space.</li>
              </ul>
            </section>

            {/* Section 4: Feedback & Assistance Contact Details */}
            <section className="space-y-4 bg-gold/5 border border-gold/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                4. Feedback & Assistance Contact Details
              </h2>
              <p className="text-sm text-white/90">
                We welcome your feedback on the accessibility of The Hidden Kitchen. If you encounter accessibility barriers on our website or require specific accommodations for your physical visit, please reach out to us:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <a
                  href="tel:+16186814208"
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-gold/20 hover:border-gold hover:bg-gold/10 transition-all text-center"
                >
                  <Phone className="h-5 w-5 text-gold mb-2" />
                  <span className="text-xs font-bold text-white">Phone Support</span>
                  <span className="text-xs text-gold/80 mt-1">(618) 681-4208</span>
                </a>

                <a
                  href="mailto:contact@thehiddenkitchen62.com"
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-gold/20 hover:border-gold hover:bg-gold/10 transition-all text-center"
                >
                  <Mail className="h-5 w-5 text-gold mb-2" />
                  <span className="text-xs font-bold text-white">Email Assistance</span>
                  <span className="text-xs text-gold/80 mt-1 break-all">contact@thehiddenkitchen62.com</span>
                </a>

                <a
                  href="https://maps.google.com/?q=131+S+Division+St,+Carterville,+IL+62918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-gold/20 hover:border-gold hover:bg-gold/10 transition-all text-center"
                >
                  <MapPin className="h-5 w-5 text-gold mb-2" />
                  <span className="text-xs font-bold text-white">Physical Location</span>
                  <span className="text-xs text-gold/80 mt-1">131 S. Division St, Carterville</span>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/70 text-center sm:text-left mt-4">
                <strong className="text-gold">Response Guarantee:</strong> We strive to respond to all accessibility feedback and accommodation requests within <strong className="text-white">two (2) business days</strong>.
              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
