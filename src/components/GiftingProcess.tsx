import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "./ui/SectionHeading";

const steps = [
  { n: "01", title: "Discover", text: "We understand your audience, occasion, budget and gifting objectives." },
  { n: "02", title: "Curate", text: "We recommend premium corporate gifts and customised gifting concepts tailored to your requirements." },
  { n: "03", title: "Personalise", text: "We bring your brand identity to life through thoughtful customisation and premium packaging." },
  { n: "04", title: "Present", text: "We prepare your gifts for a memorable presentation and coordinate delivery based on your requirements." },
];

export function GiftingProcess() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" aria-labelledby="process-title" className="bg-black px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="process-title"
          align="center"
          seo="How Our Corporate Gifting Process Works"
          display={[<>From a Thought</>, <>to a <span key="t" className="text-gold italic">Treasure.</span></>]}
        />

        <ol ref={ref} className="relative mt-20 grid gap-14 md:grid-cols-4 md:gap-8">
          {/* connecting gold line — vertical on mobile, horizontal on desktop */}
          <span className="absolute left-[23px] top-0 h-full w-px bg-white/10 md:left-0 md:top-[23px] md:h-px md:w-full" aria-hidden="true" />
          <motion.span style={{ scaleY: line }} className="absolute left-[23px] top-0 h-full w-px origin-top bg-gradient-to-b from-champagne to-gold-deep md:hidden" aria-hidden="true" />
          <motion.span style={{ scaleX: line }} className="absolute left-0 top-[23px] hidden h-px w-full origin-left bg-gradient-to-r from-gold-deep via-champagne to-gold md:block" aria-hidden="true" />

          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
              className="relative pl-16 md:pl-0"
            >
              <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border border-gold bg-black font-serif text-sm italic text-gold md:relative">
                {s.n}
              </span>
              <h3 className="font-serif text-3xl text-white md:mt-8">{s.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
