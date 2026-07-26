import { EdgeNav } from '@/components/hidden-kitchen/edge-nav'
import { Hero } from '@/components/hidden-kitchen/hero'
import { UpNext } from '@/components/hidden-kitchen/up-next'
import { Story } from '@/components/hidden-kitchen/story'
import { Menu } from '@/components/hidden-kitchen/menu'
import { Stage } from '@/components/hidden-kitchen/stage'
import { Details } from '@/components/hidden-kitchen/details'
import { Preloader } from '@/components/hidden-kitchen/preloader'
import { GrainOverlay } from '@/components/hidden-kitchen/grain-overlay'
import { SectionDivider } from '@/components/hidden-kitchen/section-divider'

export default function Page() {
  return (
    <main className="relative bg-black text-foreground" suppressHydrationWarning>
      <Preloader />
      <GrainOverlay />
      <EdgeNav />

      <Hero />
      <SectionDivider />

      <UpNext />
      <SectionDivider />

      <Story />
      <SectionDivider />

      <Menu />
      <SectionDivider />

      <Stage />
      <SectionDivider />

      <Details />
    </main>
  )
}