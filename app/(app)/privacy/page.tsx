import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'
import { Footer } from '@/components/hidden-kitchen/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Hidden Kitchen',
  description:
    'Privacy Policy for The Hidden Kitchen in Carterville, IL. Learn how we collect, use, and protect your personal data, cookie preferences, and user rights.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-black text-white relative overflow-x-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0d0800]" />
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[200px]" />
        <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-gold/4 blur-[180px]" />
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
              <Shield className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]">Legal & Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white gold-shimmer">
              Privacy Policy
            </h1>
            <p className="text-xs text-gold/60 uppercase tracking-widest font-semibold">
              Effective Date: July 24, 2026 · Last Updated: July 2026
            </p>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl pt-2">
              At The Hidden Kitchen (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), respecting your privacy and protecting your personal information is fundamental to our values. This Privacy Policy details how we collect, use, store, and safeguard your data when you visit our website, submit reservation requests, apply for employment, or interact with our services.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-white/85">
            
            {/* Section 1 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <FileText className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  1. Information We Collect
                </h2>
              </div>
              <p>
                We collect personal information that you voluntarily provide to us when using our digital features or communicating with our team:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li>
                  <strong className="text-white">Reservation & Contact Requests:</strong> Full name, email address, telephone number, party size, preferred dining date/time, and special requests.
                </li>
                <li>
                  <strong className="text-white">Stage & Event Inquiries:</strong> Artist/performer name, contact details, event category, set lengths, expected attendance, and media portfolio links.
                </li>
                <li>
                  <strong className="text-white">Career & Employment Applications:</strong> Full name, phone number, email address, work history, availability, uploaded resumes, and cover letter notes.
                </li>
                <li>
                  <strong className="text-white">Orders & Transactions:</strong> Payment and billing details provided directly to our accredited third-party payment processors when placing food or event orders.
                </li>
                <li>
                  <strong className="text-white">Automatically Collected Technical Data:</strong> IP addresses, browser types, operating systems, referring URLs, pages viewed, and access timestamps collected automatically via server logs and analytics cookies.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <Eye className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  2. Cookie Usage & Tracking Technologies
                </h2>
              </div>
              <p>
                Our website utilizes cookies, web beacons, and similar tracking technologies to enhance user experience, ensure site security, and measure website performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold">Essential Cookies</h3>
                  <p className="text-xs text-white/70">
                    Necessary for core website functions such as secure navigation, form submission states, and session management.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold">Performance & Analytics</h3>
                  <p className="text-xs text-white/70">
                    Helps us understand how visitors interact with our site (e.g. Vercel Analytics) so we can continuously refine performance and load speeds.
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/70 pt-2">
                You can manage or disable non-essential cookies at any time through your web browser preferences. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <Lock className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  3. Third-Party Services & Integrations
                </h2>
              </div>
              <p>
                We do not sell, rent, or trade your personal information to third-party marketers. We may share data with trusted third-party service providers solely to facilitate our operational services:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li><strong className="text-white">Analytics Providers:</strong> Vercel Analytics for aggregate traffic insights.</li>
                <li><strong className="text-white">Mapping & Directions:</strong> Embedded Google Maps widgets for location assistance.</li>
                <li><strong className="text-white">Payment Gateway Partners:</strong> PCI-DSS compliant credit card processors for secure transactions.</li>
              </ul>
              <p className="text-xs text-white/70">
                These third parties operate under their own independent privacy policies, and we encourage you to review their terms.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-gold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  4. How We Use Your Information
                </h2>
              </div>
              <p>
                The information we collect is utilized strictly for legitimate business purposes:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-gold text-white/80 text-sm">
                <li>Processing and confirming table reservations and stage booking inquiries.</li>
                <li>Evaluating candidate applications for open job opportunities at The Hidden Kitchen.</li>
                <li>Communicating venue announcements, schedule updates, or reservation changes.</li>
                <li>Maintaining digital security, preventing fraud, and optimizing overall web performance.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                5. Your Privacy Rights & Choices
              </h2>
              <p>
                Depending on your location, you possess rights regarding your personal information, including the right to request access, correction, or deletion of your data, as well as opting out of promotional communications.
              </p>
              <p>
                To submit a privacy inquiry or exercise your rights, please contact our privacy compliance team via email at{' '}
                <a href="mailto:contact@thehiddenkitchen62.com" className="text-gold underline hover:text-gold/80">
                  contact@thehiddenkitchen62.com
                </a>{' '}
                or by phone at <span className="text-gold font-bold">(618) 681-4208</span>.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 bg-gold/5 border border-gold/30 rounded-2xl p-6 sm:p-8 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gold">
                6. Contact Information & Legal Entity
              </h2>
              <p className="text-sm text-white/90">
                If you have questions regarding this Privacy Policy or our data handling practices, please contact us:
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
