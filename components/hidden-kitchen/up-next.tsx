import { TonightOnStage } from './tonight-on-stage'

export function UpNext() {
  return (
    <section className="sticky top-16 md:top-20 z-[70] w-full bg-black/90 backdrop-blur-xl py-1.5 border-b border-gold/20 shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <TonightOnStage />
      </div>
    </section>
  )
}
