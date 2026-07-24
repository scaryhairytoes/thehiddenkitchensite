import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import '../globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Hidden Kitchen — Food, Drinks & Live Music',
  description:
    'The Hidden Kitchen is a walk-in, community-first restaurant and live music venue. Craft cocktails, elevated comfort food, and a gold-lit stage where everyone belongs.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${manrope.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
