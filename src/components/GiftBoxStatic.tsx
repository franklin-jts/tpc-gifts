/**
 * Lightweight SVG gift box — used on mobile, touch devices, reduced-motion
 * and browsers without WebGL. Gentle CSS float only when motion is allowed.
 */
export function GiftBoxStatic({ onActivate }: { onActivate?: () => void }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="View our signature collections"
      className="group relative grid h-full w-full place-items-center"
    >
      <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(247,217,133,0.28),transparent_65%)] blur-2xl transition-opacity duration-700 group-hover:opacity-100 opacity-70" />
      <svg viewBox="0 0 240 240" className="relative w-[78%] motion-safe:animate-[float_6s_ease-in-out_infinite]" aria-hidden="true">
        <defs>
          <linearGradient id="gb-front" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7d985" />
            <stop offset=".45" stopColor="#d6a64d" />
            <stop offset="1" stopColor="#7a5418" />
          </linearGradient>
          <linearGradient id="gb-side" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c08d38" />
            <stop offset="1" stopColor="#5c3f12" />
          </linearGradient>
          <linearGradient id="gb-top" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f7d985" />
            <stop offset="1" stopColor="#d6a64d" />
          </linearGradient>
          <linearGradient id="gb-rib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6da" />
            <stop offset="1" stopColor="#e9c56f" />
          </linearGradient>
        </defs>
        {/* body */}
        <path d="M40 112 L120 146 L120 222 L40 188 Z" fill="url(#gb-front)" />
        <path d="M120 146 L200 112 L200 188 L120 222 Z" fill="url(#gb-side)" />
        {/* lid */}
        <path d="M32 92 L120 56 L208 92 L120 128 Z" fill="url(#gb-top)" />
        <path d="M32 92 L120 128 L120 148 L32 112 Z" fill="#b8862f" />
        <path d="M120 128 L208 92 L208 112 L120 148 Z" fill="#7d5719" />
        {/* ribbons */}
        <path d="M70 79 L84 73 L172 109 L158 115 Z" fill="url(#gb-rib)" opacity=".95" />
        <path d="M158 73 L172 79 L84 115 L70 109 Z" fill="url(#gb-rib)" opacity=".95" />
        <path d="M74 122 L88 128 L88 206 L74 200 Z" fill="url(#gb-rib)" />
        <path d="M152 128 L166 122 L166 200 L152 206 Z" fill="#c9a04d" />
        {/* bow */}
        <path d="M120 92 C 92 60, 70 74, 96 92 Z" fill="none" stroke="url(#gb-rib)" strokeWidth="7" strokeLinejoin="round" />
        <path d="M120 92 C 148 60, 170 74, 144 92 Z" fill="none" stroke="url(#gb-rib)" strokeWidth="7" strokeLinejoin="round" />
        <ellipse cx="120" cy="92" rx="9" ry="6" fill="#fff6da" />
      </svg>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </button>
  );
}
