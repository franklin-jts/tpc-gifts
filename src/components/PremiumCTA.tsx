import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { images } from "@/lib/images";
import { LuxButton, Arrow } from "./ui/LuxButton";
import { RevealLines, Reveal } from "./ui/Reveal";

export function PremiumCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="grain relative grid min-h-[80vh] place-items-center overflow-hidden px-5 py-28 text-center md:px-8">
      <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
        <img src={images.cta.src} alt={images.cta.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_75%)]" />

      <div className="relative max-w-4xl">
        <h2 id="cta-title" className="eyebrow">Request a Corporate Gifting Quote</h2>
        <p className="mt-8 font-serif text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl">
          <RevealLines lines={[<>Make Your Next Gift</>, <span key="u" className="text-gold shimmer italic">Unforgettable.</span>]} />
        </p>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Looking for premium corporate gifts in India? Partner with The Presentation Company to create personalised gifting
            experiences that leave a lasting impression.
          </p>
          <div className="mt-12">
            <LuxButton href="/#contact">
              Begin Your Gifting Journey <Arrow />
            </LuxButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
