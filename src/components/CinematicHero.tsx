import { motion, type Variants } from "motion/react";
import { LuxButton, Arrow } from "./ui/LuxButton";

const ease = [0.22, 1, 0.36, 1] as const;
const stagger: Variants = { show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease } },
};

export function CinematicHero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="grain relative -mt-[var(--nav-h)] flex min-h-[100svh] items-center overflow-hidden bg-black pt-[var(--nav-h)]"
    >
      {/* Gift box backdrop — the scene sits stage-right and dissolves into black under the copy */}
      <motion.div
        className="absolute inset-y-0 right-0 w-full lg:w-[64%]"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <img
          src="/images/gift-box-hero.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] lg:object-right-center"
        />
      </motion.div>

      {/* Readability scrim: black over the left, night over the floor line, lift at top */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10 max-lg:via-black/95 max-lg:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-black/55 max-lg:to-black/75" />
      <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(214,166,77,0.16),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 md:px-8 lg:py-28">
        <motion.div className="max-w-2xl" variants={stagger} initial="hidden" animate="show">
          <motion.h1 id="hero-title" variants={rise} className="eyebrow flex items-center gap-4">
            <span className="hairline hidden w-10 sm:block" aria-hidden="true" />
            Premium Corporate Gifting in India, Beautifully Presented
          </motion.h1>

          <motion.p variants={rise} className="mt-8 font-serif text-[2.9rem] leading-[1.02] tracking-[-0.015em] sm:text-7xl xl:text-[5.6rem]">
            <span className="block">
              We Don&apos;t Just Give <span className="text-gold shimmer italic">Gifts.</span>
            </span>
            <span className="mt-2 block sm:mt-3">
              <span className="script-glow pr-2 text-[1.18em] leading-[0.9]">We Create</span>{" "}
              <span className="text-gold shimmer italic">Memories.</span>
            </span>
          </motion.p>

          <motion.p variants={rise} className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Discover premium corporate gifts, personalised business gifting solutions and luxury gift hampers in India. At The
            Presentation Company, we create thoughtful gifting experiences that strengthen business relationships and leave lasting
            impressions.
          </motion.p>

          <motion.div variants={rise} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <LuxButton href="/#collections">
              Explore Our Collections <Arrow />
            </LuxButton>
            <LuxButton href="/#concierge" variant="ghost" className="!px-2">
              Find Your Perfect Gift <Arrow kind="right" />
            </LuxButton>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#collections"
        aria-label="Scroll to collections"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-muted md:flex"
      >
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </a>
    </section>
  );
}
