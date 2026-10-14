const items = ["Exceptional Gifting", "Signature Packaging", "Bespoke Creations", "Lasting Impressions"];

export function BrandMarquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6 font-serif text-xl uppercase tracking-[0.18em] md:px-10 md:text-3xl">
          <span className="text-gold shimmer">{t}</span>
          <span className="ml-12 text-sm text-gold/70 md:ml-20" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Our promise" className="marquee relative overflow-hidden border-y border-gold/20 bg-black py-6 md:py-8">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent md:w-40" />
    </section>
  );
}
