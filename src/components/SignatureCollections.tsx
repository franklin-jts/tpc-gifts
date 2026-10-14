import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { collections } from "@/lib/collections";
import { SectionHeading } from "./ui/SectionHeading";

export function SignatureCollections() {
  return (
    <section id="collections" aria-labelledby="collections-title" className="bg-black px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="collections-title" seo="Explore Our Corporate Gift Collections" display={[<>The Signature</>, <span key="c" className="text-gold italic">Collections.</span>]} />
          <p className="max-w-md text-muted lg:pb-3">
            Three ways into premium corporate gifting — each curated, customisable and presented with the same attention to detail.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-8">
          {collections.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className={i === 1 ? "md:mt-16" : ""}
            >
              <Link
                to={`/collections/${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-night outline-offset-4"
                aria-label={`${c.title} — explore the collection`}
              >
                <img
                  src={c.image.src}
                  alt={c.image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.08] group-focus-visible:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 transition-opacity duration-700 group-hover:via-black/65" />
                {/* gold border reveal */}
                <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-all duration-700 group-hover:inset-4 group-hover:border-gold/70" />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                  <span className="font-serif text-sm italic text-gold">{c.index}</span>
                  <h3 className="mt-2 font-serif text-3xl text-white transition-transform duration-700 group-hover:-translate-y-1 lg:text-4xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/75 md:line-clamp-4 lg:line-clamp-none">{c.description}</p>
                  <span className="mt-6 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne">
                    Explore Collection
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">→</span>
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
