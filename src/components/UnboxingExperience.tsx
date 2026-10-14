import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { images } from "@/lib/images";
import { LuxButton, Arrow } from "./ui/LuxButton";
import { Reveal, RevealLines } from "./ui/Reveal";

export function UnboxingExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} aria-labelledby="unboxing-title" className="relative grid bg-night lg:min-h-[90vh] lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:aspect-auto">
        <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
          <img src={images.unboxing.src} alt={images.unboxing.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-night" />
      </div>

      <div className="flex items-center px-5 py-20 md:px-12 lg:px-16 xl:px-24">
        <div className="max-w-xl">
          <h2 id="unboxing-title" className="eyebrow">Premium Corporate Gifting Solutions</h2>
          <p className="mt-6 font-serif text-[2.6rem] leading-[1.04] sm:text-6xl">
            <RevealLines lines={[<>Unwrap the</>, <span key="u" className="script-glow text-[1.22em]">Unexpected.</span>]} />
          </p>
          <Reveal delay={0.15}>
            <p className="mt-8 text-base leading-[1.9] text-muted md:text-lg">
              From premium product selection to customised branding and elegant packaging, we create memorable corporate gifting
              experiences. Our curated gifts are designed to impress clients, recognise employees and celebrate meaningful business
              relationships.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-3">
              {["Curated selection", "Brand customisation", "Signature packaging"].map((t) => (
                <li key={t} className="flex items-center gap-3 border-t border-gold/25 pt-3">
                  <span className="text-[10px] text-gold" aria-hidden="true">✦</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <LuxButton href="/#concierge">
                Create Something Exceptional <Arrow />
              </LuxButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
