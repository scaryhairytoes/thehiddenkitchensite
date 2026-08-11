export function GrainOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {/* Vignette — darkens the edges for a cinematic frame */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
      {/* Animated film grain */}
      <div className="film-grain absolute inset-0 overflow-hidden mix-blend-soft-light" />
    </div>
  )
}
