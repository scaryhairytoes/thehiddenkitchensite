export function SectionDivider() {
    return (
        <div className="relative z-50 w-full h-0 pointer-events-none select-none flex items-end">
            {/* The Parallax Overlay Edge (Soft Gold Glow) */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent shadow-[0_-8px_24px_rgba(255,215,0,0.4)]" />
            
            {/* Center soft ambient glow sitting just above the line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-8 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold/20 via-black/0 to-transparent blur-xl" />
        </div>
    )
}