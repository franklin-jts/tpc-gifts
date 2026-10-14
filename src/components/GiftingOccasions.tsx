import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { occasions } from "@/lib/collections";
import { SectionHeading } from "./ui/SectionHeading";

export function GiftingOccasions() {
  return (
    <section id="occasions" aria-labelledby="occasions-title" className="bg-black px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="occasions-title"
          align="center"
          seo="Customised Corporate Gifts for Every Occasion"
          display={[<>Every Occasion.</>, <span key="b" className="script-glow text-[1.15em]">Beautifully.</span>]}
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((o, i) => (
            <motion.li
              key={o.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            >
              <Link
                to={`/?occasion=${encodeURIComponent(o.occasion)}#contact`}
                className="group flex h-full flex-col border border-white/10 bg-night transition-colors duration-500 hover:border-gold/60"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={o.image.src}
                    alt={o.image.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover grayscale-[35%] transition-all duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
                  <span className="absolute left-5 top-5 font-serif text-sm italic text-gold">0{i + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl text-white">{o.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{o.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-champagne">
                    Enquire <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
