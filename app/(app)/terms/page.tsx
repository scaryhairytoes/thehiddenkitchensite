import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Scale, AlertTriangle, UtensilsCrossed, ShieldAlert, Award, FileText } from 'lucide-react'
import { Footer } from '@/components/hidden-kitchen/footer'

export const metadata: Metadata = {
  title: 'Terms of Service | The Hidden Kitchen',
  description:
    'Terms of Service for The Hidden Kitchen. Important disclaimers on menu pricing, food allergen warnings, FDA health disclosures, intellectual property, and venue policies.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-dvh bg-black text-white relative overflow-x-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0d0800]" />
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[200px]" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-gold/4 blur-[180px]" />
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
              <Scale className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]">Legal Terms</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white gold-shimmer">
              Terms of Service
            </h1>
            <p className="text-xs text-gold/60 uppercase tracking-widest font-semibold">
              Effective Date: July 24, 2026 · Last Updated: July 2026
            </p>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl pt-2">
              Please read these Terms of Service (&quot;Terms&quot;) carefully before visiting our physical restaurant, booking our venue/stage, placing reservations, or using The Hidden Kitchen website. By accessing our services, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-white/85">
            
            {/* Section 1 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <UtensilsCrossed className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  1. Menu Pricing & Availability Disclaimers
                </h2>
              </div>
              <p>
                All menu offerings, drink items, seasonal specials, prices, and live stage performance schedules displayed on our website or social channels are provided for informational purposes:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li>
                  <strong className="text-white">Price Modifications:</strong> Prices and menu items are subject to change without prior notice due to market conditions or seasonal ingredient availability.
                </li>
                <li>
                  <strong className="text-white">Taxes & Gratuity:</strong> Prices shown do not include applicable state/local sales taxes or gratuities unless explicitly noted.
                </li>
                <li>
                  <strong className="text-white">Item Availability:</strong> Kitchen items and craft cocktail ingredients are subject to daily availability and supplier inventory constraints.
                </li>
              </ul>
            </section>

            {/* Section 2: Allergen Warning */}
            <section className="space-y-4 bg-amber-500/5 border border-amber-500/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  2. Food Allergen Warnings & Dietary Notice
                </h2>
              </div>
              <p className="text-amber-200/90 font-medium">
                Our kitchen prepares foods that contain common food allergens, including but not limited to: milk, eggs, wheat, gluten, peanuts, tree nuts, fish, shellfish, soy, and sesame.
              </p>
              <p className="text-sm text-white/80">
                While we take precautions to prevent cross-contamination, we operate an open kitchen environment and cannot guarantee that any item is 100% free of allergen traces. Guests with severe allergies are required to inform their server or management prior to placing an order.
              </p>
            </section>

            {/* Section 3: FDA Warning */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  3. Undercooked Food & FDA Health Advisory
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-white/90 text-sm italic">
                &quot;Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.&quot;
              </div>
              <p className="text-xs sm:text-sm text-white/70">
                In compliance with Illinois Department of Public Health and FDA food safety regulations, items served raw or cooked to order are identified with this warning upon request or on physical menus.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <FileText className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  4. Reservations & Venue Policies
                </h2>
              </div>
              <ul className="space-y-2 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li>
                  <strong className="text-white">Walk-ins & Reservations:</strong> The Hidden Kitchen is a walk-in-first restaurant. Online reservation requests are subject to table availability and manual confirmation by venue management.
                </li>
                <li>
                  <strong className="text-white">Holding Times:</strong> Reserved tables will be held for up to 15 minutes past the scheduled reservation time before being released to walk-in patrons.
                </li>
                <li>
                  <strong className="text-white">Stage & Event Bookings:</strong> Performers and private event organizers must abide by signed venue contracts, sound guidelines, and deposit schedules.
                </li>
                <li>
                  <strong className="text-white">Guest Conduct:</strong> Management reserves the right to refuse service or eject any individual violating venue safety rules or exhibiting disruptive behavior.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <Award className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  5. Intellectual Property Rights
                </h2>
              </div>
              <p>
                All content on this website—including but not limited to branding, logos, restaurant names, menu copy, custom graphics, typography, photography, audio clips, and code—is the exclusive property of The Hidden Kitchen and protected under United States copyright and trademark laws. Unauthorized reproduction or distribution is strictly prohibited.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                6. Limitation of Liability & Governing Law
              </h2>
              <p>
                To the fullest extent permitted by law, The Hidden Kitchen, its owners, and employees shall not be liable for any indirect, incidental, or consequential damages resulting from website downtime, technical errors, or reliance on digital menu information.
              </p>
              <p className="text-xs text-white/70">
                These Terms are governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law principles. Any legal proceedings shall be conducted exclusively in Williamson County, Illinois.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 bg-gold/5 border border-gold/30 rounded-2xl p-6 sm:p-8 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                7. Legal Contact Information
              </h2>
              <p className="text-sm text-white/90">
                For questions or formal legal notices regarding these Terms, please reach out to us at:
              </p>
              <div className="text-xs sm:text-sm text-white/80 space-y-1 pt-2 font-mono">
                <p className="font-bold text-white">The Hidden Kitchen</p>
                <p>131 S. Division St, Carterville, IL 62918</p>
                <p>Phone: (618) 681-4208</p>
                <p>Email: contact@thehiddenkitchen62.com</p>
              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
