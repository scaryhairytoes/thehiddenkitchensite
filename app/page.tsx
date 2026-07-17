import { EdgeNav } from '@/components/hidden-kitchen/edge-nav'
import { Hero } from '@/components/hidden-kitchen/hero'
import { Story } from '@/components/hidden-kitchen/story'
import { Menu } from '@/components/hidden-kitchen/menu'
import { Stage } from '@/components/hidden-kitchen/stage'
import { Details } from '@/components/hidden-kitchen/details'
import { Preloader } from '@/components/hidden-kitchen/preloader'
import { GrainOverlay } from '@/components/hidden-kitchen/grain-overlay'

export default function Page() {
  return (
    <main className="relative bg-black text-foreground overflow-x-hidden" suppressHydrationWarning>
      <Preloader />
      <GrainOverlay />
      <EdgeNav />
      {/* Card-stack: each section is sticky and layers over the previous on scroll */}
      <Hero />
      <Story />
      <Menu />
      <Stage />
      <Details />
    </main>
  )
}
