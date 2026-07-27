import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/hidden-kitchen/schema-markup'
import { Preloader } from '@/components/hidden-kitchen/preloader'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://thehiddenkitchen62.com'),
  title: {
    default: 'The Hidden Kitchen | Restaurant, Drinks & Live Stage in Carterville, IL',
    template: '%s | The Hidden Kitchen',
  },
  description:
    'Experience good food, cold drinks, live entertainment, and warm hospitality at The Hidden Kitchen in Carterville, IL. Everyone belongs here.',
  keywords: [
    'The Hidden Kitchen',
    'Carterville IL restaurants',
    'Southern Illinois dining',
    'Live music Carterville',
    'Craft cocktails',
    'Carterville Illinois food',
    'The Stage Carterville',
  ],
  authors: [{ name: 'The Hidden Kitchen' }],
  creator: 'The Hidden Kitchen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thehiddenkitchen62.com',
    siteName: 'The Hidden Kitchen',
    title: 'The Hidden Kitchen | Restaurant & Live Venue in Carterville, IL',
    description:
      'Good food, cold drinks, live entertainment, and warm hospitality. Join us at The Hidden Kitchen in Carterville.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'The Hidden Kitchen Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hidden Kitchen | Carterville, IL',
    description:
      'Good food, cold drinks, live entertainment, and warm hospitality. Welcome home.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-black font-sans text-foreground antialiased selection:bg-gold selection:text-black">
        <SchemaMarkup />
        <Preloader />
        {children}
      </body>
    </html>
  )
}