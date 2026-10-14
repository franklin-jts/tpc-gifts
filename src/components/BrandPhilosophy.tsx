import { Reveal, RevealLines } from "./ui/Reveal";
import { GoldDivider } from "./ui/GoldDivider";

export function BrandPhilosophy() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-night px-5 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(214,166,77,0.10),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="eyebrow">The Philosophy of Giving</p>
        </Reveal>
        <p className="mt-10 font-serif text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[5.25rem]">
          <RevealLines
            lines={[
              <>Some Gifts Are Opened.</>,
              <span key="f" className="script-glow text-[1.2em] leading-[1]">Others Are Felt.</span>,
              <span key="g" className="text-gold shimmer italic">Forever.</span>,
            ]}
          />
        </p>
        <GoldDivider className="mt-14" />
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <h2 id="about-title" className="font-serif text-2xl text-champagne md:text-3xl">
            Why Thoughtful Corporate Gifting Matters
          </h2>
          <p className="mt-6 text-base leading-[1.9] text-muted md:text-lg">
            Corporate gifting is more than exchanging presents. It is an opportunity to recognise achievements, celebrate milestones
            and build meaningful professional relationships. The Presentation Company specialises in premium corporate gifting
            solutions, personalised gifts and thoughtfully curated gift experiences for businesses across India.
          </p>
          <p className="mt-5 text-base leading-[1.9] text-muted md:text-lg">
            From our base in Bengaluru, we work with HR, procurement, marketing and leadership teams to turn a gifting brief into
            something people remember — chosen with care, finished with your brand, and presented beautifully.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
