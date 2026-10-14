import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

type Variant = "gold" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 min-h-12";
const variants: Record<Variant, string> = {
  gold: "bg-gold text-black shimmer hover:shadow-[0_0_40px_-8px_rgba(247,217,133,0.65)]",
  outline: "border border-gold/70 text-champagne hover:border-champagne hover:bg-gold/10",
  ghost: "text-white/90 hover:text-champagne",
};

/**
 * CTA with a subtle magnetic pull on fine pointers.
 * Renders a router <Link> for hrefs, or a <button> otherwise.
 */
export function LuxButton({
  href,
  children,
  variant = "gold",
  className = "",
  magnetic = true,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );

  return (
    <motion.span ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-block">
      {href ? (
        <Link to={href} className={cls}>
          {inner}
        </Link>
      ) : (
        <button className={cls} {...rest}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}

/** Arrow glyph that drifts on parent hover. */
export function Arrow({ kind = "up" }: { kind?: "up" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        kind === "up" ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1.5"
      }`}
    >
      {kind === "up" ? "↗" : "→"}
    </span>
  );
}
