import { Link, useParams } from "react-router-dom";
import { collections, getCollection } from "@/lib/collections";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { LuxuryNavbar } from "@/components/LuxuryNavbar";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { LuxButton, Arrow } from "@/components/ui/LuxButton";
import { Reveal } from "@/components/ui/Reveal";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { usePageSeo } from "@/lib/seo";
import NotFound from "./NotFound";

export default function CollectionPage() {
  const { slug = "" } = useParams();
  const c = getCollection(slug);

  usePageSeo(
    c
      ? {
          title: `${c.title} — ${c.eyebrow} in India`,
          description: c.description,
          canonical: `/collections/${c.slug}`,
          image: c.image.src,
          imageAlt: c.image.alt,
        }
      : { title: "Page not found", robots: "noindex, follow" },
  );

  if (!c) return <NotFound />;

  const others = collections.filter((o) => o.slug !== c.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/#collections" },
    { name: c.title, path: `/collections/${c.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <AnnouncementBar />
      <LuxuryNavbar />
      <main id="main">
        <section className="relative -mt-[var(--nav-h)] flex min-h-[78svh] items-end overflow-hidden pt-[var(--nav-h)]">
          <img src={c.image.src} alt={c.image.alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-black/70 to-black/50" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                {crumbs.map((cr, i) => (
                  <li key={cr.path} className="flex items-center gap-2">
                    {i < crumbs.length - 1 ? (
                      <Link to={cr.path} className="hover:text-champagne">{cr.name}</Link>
                    ) : (
                      <span aria-current="page" className="text-champagne">{cr.name}</span>
                    )}
                    {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="eyebrow mt-10">{c.eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
              {c.title.split(" ")[0]} <span className="text-gold shimmer italic">{c.title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{c.description}</p>
          </div>
        </section>

        <section className="bg-night px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 className="font-serif text-3xl text-white md:text-4xl">The approach</h2>
              <p className="mt-6 leading-[1.9] text-muted">{c.intro}</p>
              <h3 className="mt-12 eyebrow">Ideal for</h3>
              <ul className="mt-5 space-y-3">
                {c.idealFor.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white/80"><span className="text-[10px] text-gold" aria-hidden="true">✦</span>{t}</li>
                ))}
              </ul>
            </Reveal>
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl text-white md:text-4xl">Gifting ideas</h2>
              <ul className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2">
                {c.ideas.map((idea, i) => (
                  <li key={idea.title} className="bg-night p-8">
                    <Reveal delay={i * 0.08}>
                      <span className="font-serif text-sm italic text-gold">0{i + 1}</span>
                      <h3 className="mt-3 font-serif text-2xl">{idea.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{idea.text}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-white/45">Specific products, customisation options and pricing are shared in your quotation.</p>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-24 text-center md:px-8">
          <GoldDivider />
          <h2 className="mt-10 font-serif text-4xl md:text-6xl">
            Begin your <span className="script-glow">{c.title}</span> brief
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LuxButton href="/#contact">Request a Quotation <Arrow /></LuxButton>
            <LuxButton href="/#concierge" variant="outline">Try the Gift Concierge <Arrow kind="right" /></LuxButton>
          </div>

          <nav aria-label="Other collections" className="mx-auto mt-20 max-w-3xl">
            <p className="eyebrow">Explore more collections</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={`/collections/${o.slug}`} className="group flex items-center justify-between border border-white/10 px-6 py-5 text-left transition-colors hover:border-gold/60">
                    <span className="font-serif text-xl">{o.title}</span>
                    <span className="text-gold transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
      <LuxuryFooter />
    </>
  );
}
