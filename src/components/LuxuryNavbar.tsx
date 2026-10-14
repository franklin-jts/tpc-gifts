import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { BriefcaseBusiness, ChevronDown, Heart, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LuxButton, Arrow } from "./ui/LuxButton";
import { nav } from "@/lib/site";
import { collections } from "@/lib/collections";
import { images } from "@/lib/images";

const personalizedLinks: ReadonlyArray<{
  label: string;
  href: string;
  isNew?: boolean;
  submenu?: ReadonlyArray<{ label: string; href: string }>;
  megaMenu?: ReadonlyArray<{ title: string; links: ReadonlyArray<{ label: string; href: string }> }>;
}> = [
  {
    label: "Diwali Gifts",
    href: "/?occasion=Festive%20Gifting#contact",
    isNew: true,
    submenu: [
      { label: "Diwali Gift Hampers", href: "/?occasion=Festive%20Gifting#contact" },
      { label: "Diwali Dry Fruit Gifts", href: "/?occasion=Festive%20Gifting#contact" },
      { label: "Make your Diwali Hamper", href: "/#concierge" },
    ],
  },
  {
    label: "Return Gifts",
    href: "/#concierge",
    submenu: [
      { label: "Brass Return Gifts", href: "/#concierge" },
      { label: "Wedding Return Gifts", href: "/#concierge" },
    ],
  },
  {
    label: "Shop Gifts",
    href: "/#collections",
    megaMenu: [
      {
        title: "Shop by Recipient",
        links: [
          "Gifts for Women", "Gifts for Men", "Gifts for Wife", "Gifts for Husband",
          "Gifts for Girlfriend", "Gifts for Boyfriend", "Gifts for Parents",
          "Gifts for Couple", "Gifts for Moms to be", "Gifts for Kids",
        ].map((label) => ({ label, href: "/#concierge" })),
      },
      {
        title: "Shop by Occasion",
        links: ["Thank You", "Birthday", "Anniversary", "Housewarming Gifts", "Get Well Soon Gifts", "Office Gifts"]
          .map((label) => ({ label, href: "/#concierge" })),
      },
      {
        title: "Shop by Interest",
        links: [
          "Love Gifts", "Dry Fruit Gifts", "Eco-friendly Gifts", "Home Decor Gifts",
          "Gourmet Edibles", "Self Care Hampers", "Gifts for Coffee Lovers", "Gifts for Fitness Freaks",
        ].map((label) => ({ label, href: "/#concierge" })),
      },
      {
        title: "By Price",
        links: ["Gifts Under Rs 999", "Rs 1000 to Rs 2000", "Rs 2000 to Rs 3000", "Above Rs 3000+"]
          .map((label) => ({ label, href: "/#concierge" })),
      },
      {
        title: "Personalised Gifts",
        links: [
          "Bouquets", "Gifts in Spotlight", "Romantic Love Gifts", "Luxe Collective",
          "Gift Cards", "Best Sellers", "Same Day Delivery in Bangalore",
        ].map((label) => ({ label, href: "/#concierge" })),
      },
    ],
  },
  { label: "Make Your Own Hamper", href: "/#concierge" },
  { label: "New Arrivals", href: "/#collections", isNew: true },
  { label: "All Gifts", href: "/#collections" },
] as const;

const corporateNavigation: ReadonlyArray<{
  label: string;
  isNew?: boolean;
  href?: string;
}> = [
  { label: "Corporate Diwali Gifts", isNew: true },
  { label: "Corporate Gifting" },
  { label: "Promotional Gifts" },
  { label: "New Arrivals", isNew: true, href: "/#collections" },
  { label: "Bulk Enquiry", href: "/#contact" },
  { label: "About Us", href: "/#about" },
] as const;

const corporateMegaMenus = {
  "Corporate Gifting": [
    {
      title: "By Celebration",
      links: ["Employee Welcome Kits", "Rewards and Recognition", "Work Anniversary Gifts", "Client Appreciation Gifts", "Corporate Birthday Gifts", "Thank You Gifts", "Delegate Gifts"],
    },
    {
      title: "By Occasion",
      links: ["Diwali Gifts", "Christmas Gifts", "New Year Gifts", "Women's Day Gifts"],
    },
    {
      title: "By Industry",
      links: ["Tech Gifts", "Architecture Gifts", "Real Estate Gifts"],
    },
    {
      title: "By Price",
      links: ["Under Rs 1000", "Rs 1000 to Rs 2000", "Rs 2000 to Rs 3000", "Above Rs 3000"],
    },
  ],
  "Promotional Gifts": [
    {
      title: "Executive Essentials",
      links: ["Pens", "Journal", "Drinkware", "Desk Essential"],
    },
    {
      title: "Home & Living",
      links: ["Fragrance", "Home & Decor", "Lights & Lamps", "Photo Frames", "Tea Coaster"],
    },
    {
      title: "Lifestyle & Accessories",
      links: ["Travel", "Apparels", "Lifestyle", "Keychains", "Bags & Luggage"],
    },
    {
      title: "Gourmet Indulgence",
      links: ["Chocolates", "Nuts & Seeds", "Gourmet Snacks", "Healthy Munchies", "Coffee & Tea Delights"],
    },
    {
      title: "Smart Gifts",
      links: ["Eco-Friendly Gifts", "Planters & Pots", "Electronic Gadgets", "Stationery & Accessories"],
    },
  ],
} as const;

const corporateCategoryHref = (label: string) => {
  const occasion = /diwali|christmas|new year/i.test(label)
    ? "Festive Gifting"
    : /welcome/i.test(label)
      ? "Welcome Kit"
      : /employee|reward|anniversary/i.test(label)
        ? "Employee Recognition"
        : /client/i.test(label)
          ? "Client Appreciation"
          : "Corporate Event";
  return `/?occasion=${encodeURIComponent(occasion)}#contact`;
};

const giftModes = [
  {
    id: "personalized",
    label: "Personalized Gifts",
    Icon: Heart,
    categories: [],
  },
  {
    id: "corporate",
    label: "Corporate Gifts",
    Icon: BriefcaseBusiness,
    categories: [
      { label: "Corporate Diwali Gifting", occasion: "Festive Gifting", image: images.cta },
      { label: "Welcome Kits", occasion: "Welcome Kit", image: images.employee },
      { label: "Eco Friendly Gifts", occasion: "Other", image: images.bespoke },
      { label: "Employee Gifting", occasion: "Employee Recognition", image: images.executive },
      { label: "Client Gifting", occasion: "Client Appreciation", image: images.moments },
      { label: "Promotional Products", occasion: "Corporate Event", image: images.unboxing },
    ],
  },
] as const;

export function LuxuryNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [giftMode, setGiftMode] = useState<"personalized" | "corporate">("personalized");
  const [activePersonalizedMenu, setActivePersonalizedMenu] = useState<string | null>(null);
  const [activeCorporateMenu, setActiveCorporateMenu] = useState("Corporate Diwali Gifts");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCollectionsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!collectionsOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest("[data-collections-dropdown]")) {
        setCollectionsOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [collectionsOpen]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-gold/25 bg-black/95 backdrop-blur-md" : "border-b border-transparent bg-black/20 backdrop-blur-[2px]"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Logo priority className="h-11 md:h-14" />

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li
              key={item.href}
              data-collections-dropdown={item.label === "Collections" ? "" : undefined}
            >
              {item.label === "Collections" ? (
                <>
                  <button
                    type="button"
                    aria-expanded={collectionsOpen}
                    aria-haspopup="true"
                    aria-controls="collections-dropdown"
                    onClick={() => setCollectionsOpen((isOpen) => !isOpen)}
                    className="group flex items-center gap-1.5 py-2 font-serif text-[0.95rem] tracking-wide text-white/85 transition-colors hover:text-champagne"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${collectionsOpen ? "rotate-180" : ""}`}
                    />
                    <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                  </button>
                  {collectionsOpen && (
                    <div
                      id="collections-dropdown"
                      className="absolute left-1/2 top-full z-50 mt-3 w-[min(80rem,calc(100vw-2rem))] -translate-x-1/2 border border-gold/30 bg-black p-5 shadow-2xl shadow-black/60"
                    >
                      <div className="mb-5 flex w-fit rounded-full border border-gold/35 bg-night p-1">
                        {giftModes.map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={giftMode === id}
                            onClick={() => {
                              setGiftMode(id);
                              setActivePersonalizedMenu(null);
                              setActiveCorporateMenu("Corporate Diwali Gifts");
                            }}
                            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 font-serif text-sm transition-colors ${
                              giftMode === id
                                ? "bg-gold-deep text-white"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                            {label}
                          </button>
                        ))}
                      </div>

                      {giftMode === "personalized" ? (
                        <>
                          <p className="eyebrow mb-4 px-2">Personalized gifting</p>
                          <ul className="grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
                            {personalizedLinks.map((category) => (
                              <li key={category.label} className="relative pt-3 text-center">
                                {category.isNew && (
                                  <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-gold-deep px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white">
                                    New
                                  </span>
                                )}
                                {category.submenu || category.megaMenu ? (
                                  <button
                                    type="button"
                                    aria-expanded={activePersonalizedMenu === category.label}
                                    aria-controls="personalized-category-submenu"
                                    onMouseEnter={() => setActivePersonalizedMenu(category.label)}
                                    onFocus={() => setActivePersonalizedMenu(category.label)}
                                    onClick={() => setActivePersonalizedMenu((active) => active === category.label ? null : category.label)}
                                    className={`group inline-flex min-h-9 items-center justify-center gap-1 border-b text-center text-[0.68rem] font-medium uppercase tracking-[0.08em] transition-colors ${
                                      activePersonalizedMenu === category.label
                                        ? "border-gold text-champagne"
                                        : "border-transparent text-white/80 hover:text-champagne"
                                    }`}
                                  >
                                    {category.label}
                                    <ChevronDown size={13} aria-hidden="true" className={`shrink-0 text-gold/70 transition-transform ${activePersonalizedMenu === category.label ? "rotate-180" : ""}`} />
                                  </button>
                                ) : (
                                  <Link
                                    to={category.href}
                                    onClick={() => setCollectionsOpen(false)}
                                    className="group inline-flex min-h-9 items-center justify-center gap-1 text-center text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-champagne"
                                  >
                                    {category.label}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                          {personalizedLinks.map((category) =>
                            (category.submenu || category.megaMenu) && activePersonalizedMenu === category.label ? (
                              <div
                                key={category.label}
                                id="personalized-category-submenu"
                                aria-label={`${category.label} submenu`}
                                className="mt-3 border-t border-gold/20 bg-night px-5 py-5 text-white sm:px-7"
                              >
                                {category.megaMenu ? (
                                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                                    {category.megaMenu.map((column) => (
                                      <section key={column.title}>
                                        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-gold">
                                          {column.title}
                                        </h3>
                                        <ul className="space-y-2">
                                          {column.links.map((subitem) => (
                                            <li key={subitem.label}>
                                              <Link
                                                to={subitem.href}
                                                onClick={() => {
                                                  setCollectionsOpen(false);
                                                  setActivePersonalizedMenu(null);
                                                }}
                                                className="text-sm leading-snug text-white/75 transition-colors hover:text-champagne"
                                              >
                                                {subitem.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </section>
                                    ))}
                                  </div>
                                ) : (
                                  <ul className="space-y-2">
                                    {category.submenu?.map((subitem) => (
                                      <li key={subitem.label}>
                                        <Link
                                          to={subitem.href}
                                          onClick={() => {
                                            setCollectionsOpen(false);
                                            setActivePersonalizedMenu(null);
                                          }}
                                          className="inline-flex py-1 text-sm tracking-wide text-white/75 transition-colors hover:text-champagne"
                                        >
                                          {subitem.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : null,
                          )}
                        </>
                      ) : (
                        <>
                          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-b border-white/10 pb-4 lg:justify-between">
                            {corporateNavigation.map((category) => (
                              <li key={category.label} className="relative pt-2">
                                {category.isNew && (
                                  <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-gold-deep px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white">
                                    New
                                  </span>
                                )}
                                {category.href ? (
                                  <Link
                                    to={category.href}
                                    onClick={() => setCollectionsOpen(false)}
                                    className="inline-flex min-h-8 items-center text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-champagne"
                                  >
                                    {category.label}
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    aria-expanded={activeCorporateMenu === category.label}
                                    aria-controls="corporate-category-panel"
                                    onMouseEnter={() => setActiveCorporateMenu(category.label)}
                                    onFocus={() => setActiveCorporateMenu(category.label)}
                                    onClick={() => setActiveCorporateMenu(category.label)}
                                    className={`inline-flex min-h-8 items-center gap-1 border-b text-[0.68rem] font-medium uppercase tracking-[0.08em] transition-colors ${
                                      activeCorporateMenu === category.label
                                        ? "border-gold text-champagne"
                                        : "border-transparent text-white/80 hover:text-champagne"
                                    }`}
                                  >
                                    {category.label}
                                    <ChevronDown size={14} className={`text-gold/70 transition-transform ${activeCorporateMenu === category.label ? "rotate-180" : ""}`} aria-hidden="true" />
                                  </button>
                                )}
                              </li>
                            ))}
                            <li>
                              <Link
                                to="/#contact"
                                onClick={() => setCollectionsOpen(false)}
                                className="inline-flex min-h-8 items-center gap-2 bg-gold-deep px-3 text-[0.62rem] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold"
                              >
                                Request Catalogue <Arrow />
                              </Link>
                            </li>
                          </ul>

                          {activeCorporateMenu === "Corporate Diwali Gifts" ? (
                            <ul id="corporate-category-panel" className="grid grid-cols-3 gap-x-3 gap-y-5 py-5 sm:grid-cols-6">
                              {giftModes.find(({ id }) => id === "corporate")!.categories.map((category) => (
                                <li key={category.label}>
                                  <Link
                                    to={corporateCategoryHref(category.label)}
                                    onClick={() => setCollectionsOpen(false)}
                                    className="group flex h-full flex-col items-center gap-2 text-center"
                                  >
                                    <img
                                      src={category.image.src}
                                      alt=""
                                      loading="lazy"
                                      className="aspect-square w-full max-w-20 rounded-full object-cover ring-1 ring-gold/20 transition duration-300 group-hover:scale-105 group-hover:ring-gold/70"
                                    />
                                    <span className="text-xs leading-snug text-white/80 transition-colors group-hover:text-champagne">
                                      {category.label}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : activeCorporateMenu in corporateMegaMenus ? (
                            <div id="corporate-category-panel" className="grid gap-6 py-5 sm:grid-cols-2 lg:grid-cols-5">
                              {corporateMegaMenus[activeCorporateMenu as keyof typeof corporateMegaMenus].map((column) => (
                                <section key={column.title}>
                                  <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-gold">
                                    {column.title}
                                  </h3>
                                  <ul className="space-y-2">
                                    {column.links.map((label) => (
                                      <li key={label}>
                                        <Link
                                          to={corporateCategoryHref(label)}
                                          onClick={() => setCollectionsOpen(false)}
                                          className="text-sm leading-snug text-white/75 transition-colors hover:text-champagne"
                                        >
                                          {label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </section>
                              ))}
                            </div>
                          ) : (
                            <div id="corporate-category-panel" className="py-5 text-sm text-white/60">
                              Browse the latest corporate gifting collections.
                            </div>
                          )}
                        </>
                      )}

                      {giftMode === "corporate" ? (
                        <div className="mt-5 border-t border-white/10 pt-4">
                          <p className="eyebrow mb-3 px-2">Explore our collections</p>
                          <ul className="grid gap-2 sm:grid-cols-3">
                            {collections.map((collection) => (
                              <li key={collection.slug}>
                                <Link
                                  to={`/collections/${collection.slug}`}
                                  onClick={() => setCollectionsOpen(false)}
                                  className="group flex items-center justify-between gap-2 border border-white/10 px-3 py-2.5 transition-colors hover:border-gold/50 hover:bg-white/[0.04]"
                                >
                                  <span>
                                    <span className="block font-serif text-sm text-white transition-colors group-hover:text-champagne">
                                      {collection.title}
                                    </span>
                                    <span className="mt-0.5 block text-[0.65rem] text-white/55">{collection.eyebrow}</span>
                                  </span>
                                  <span className="text-xs tracking-[0.2em] text-gold/70">{collection.index}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Link
                          to="/#concierge"
                          onClick={() => setCollectionsOpen(false)}
                          className="mt-5 flex items-center justify-between border-t border-white/10 px-2 pt-4 text-xs uppercase tracking-[0.18em] text-champagne transition-colors hover:text-white"
                        >
                          Browse all gifts <Arrow kind="right" />
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className="group relative py-2 font-serif text-[0.95rem] tracking-wide text-white/85 transition-colors hover:text-champagne"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LuxButton href="/#contact" variant="outline" className="!px-5 !py-3">
              Get a Quote <Arrow />
            </LuxButton>
          </div>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center text-champagne lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} strokeWidth={1.25} /> : <Menu size={24} strokeWidth={1.25} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0 top-full z-40 h-[calc(100svh-var(--nav-h))] overflow-y-auto bg-black lg:hidden"
          >
            <ul className="flex flex-col px-6 pt-6">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/10"
                  data-collections-dropdown={item.label === "Collections" ? "" : undefined}
                >
                  {item.label === "Collections" ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={collectionsOpen}
                        onClick={() => setCollectionsOpen((value) => !value)}
                        className="flex w-full items-center justify-between py-5 text-left font-serif text-3xl text-white"
                      >
                        {item.label}
                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                          className={`text-gold transition-transform ${collectionsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {collectionsOpen && (
                        <div className="pb-6">
                          <div className="mb-5 flex w-fit rounded-full border border-gold/35 bg-night p-1">
                            {giftModes.map(({ id, label, Icon }) => (
                              <button
                                key={id}
                                type="button"
                                aria-pressed={giftMode === id}
                                onClick={() => {
                                  setGiftMode(id);
                                  setActivePersonalizedMenu(null);
                                  setActiveCorporateMenu("Corporate Diwali Gifts");
                                }}
                                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 font-serif text-xs transition-colors ${
                                  giftMode === id ? "bg-gold-deep text-white" : "text-white/70 hover:text-white"
                                }`}
                              >
                                <Icon size={14} strokeWidth={1.6} aria-hidden="true" />
                                {label}
                              </button>
                            ))}
                          </div>
                          {giftMode === "personalized" ? (
                            <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
                              {personalizedLinks.map((category) => (
                                <li
                                  key={category.label}
                                  className={(category.submenu || category.megaMenu) && activePersonalizedMenu === category.label ? "col-span-2" : undefined}
                                >
                                  {category.submenu || category.megaMenu ? (
                                    <button
                                      type="button"
                                      aria-expanded={activePersonalizedMenu === category.label}
                                      onClick={() => setActivePersonalizedMenu((active) => active === category.label ? null : category.label)}
                                      className="flex min-h-12 w-full items-center justify-between gap-2 border border-white/10 px-3 py-2 text-left text-xs uppercase tracking-[0.06em] text-white/80"
                                    >
                                      <span>{category.label}</span>
                                      {category.isNew && (
                                        <span className="bg-gold-deep px-1.5 py-0.5 text-[0.5rem] text-white">NEW</span>
                                      )}
                                      <ChevronDown size={13} className={`shrink-0 text-gold/70 transition-transform ${activePersonalizedMenu === category.label ? "rotate-180" : ""}`} aria-hidden="true" />
                                    </button>
                                  ) : (
                                    <Link
                                      to={category.href}
                                      onClick={() => {
                                        setCollectionsOpen(false);
                                        setOpen(false);
                                      }}
                                      className="flex min-h-12 items-center justify-between gap-2 border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.06em] text-white/80"
                                    >
                                      <span>{category.label}</span>
                                      {category.isNew && (
                                        <span className="bg-gold-deep px-1.5 py-0.5 text-[0.5rem] text-white">NEW</span>
                                      )}
                                    </Link>
                                  )}
                                  {(category.submenu || category.megaMenu) && activePersonalizedMenu === category.label && (
                                    category.megaMenu ? (
                                      <div id="personalized-category-submenu" className="mt-2 space-y-4 border-l border-gold/40 py-2 pl-4">
                                        {category.megaMenu.map((column) => (
                                          <section key={column.title}>
                                            <h3 className="mb-1 font-serif text-xs uppercase tracking-wide text-gold">{column.title}</h3>
                                            <ul className="space-y-1">
                                              {column.links.map((subitem) => (
                                                <li key={subitem.label}>
                                                  <Link
                                                    to={subitem.href}
                                                    onClick={() => {
                                                      setCollectionsOpen(false);
                                                      setOpen(false);
                                                      setActivePersonalizedMenu(null);
                                                    }}
                                                    className="block py-1.5 text-sm text-white/75 hover:text-champagne"
                                                  >
                                                    {subitem.label}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          </section>
                                        ))}
                                      </div>
                                    ) : (
                                      <ul id="personalized-category-submenu" className="mt-2 space-y-1 border-l border-gold/40 py-2 pl-4">
                                        {category.submenu?.map((subitem) => (
                                          <li key={subitem.label}>
                                            <Link
                                              to={subitem.href}
                                              onClick={() => {
                                                setCollectionsOpen(false);
                                                setOpen(false);
                                                setActivePersonalizedMenu(null);
                                              }}
                                              className="block py-1.5 text-sm text-white/75 hover:text-champagne"
                                            >
                                              {subitem.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    ))}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <>
                              <div className="mb-3 flex flex-wrap gap-2">
                                {corporateNavigation.map((category) => (
                                  category.href ? (
                                    <Link
                                      key={category.label}
                                      to={category.href}
                                      onClick={() => {
                                        setCollectionsOpen(false);
                                        setOpen(false);
                                      }}
                                      className="border border-white/10 px-2.5 py-2 text-[0.6rem] uppercase tracking-wide text-white/75"
                                    >
                                      {category.label}
                                    </Link>
                                  ) : (
                                    <button
                                      key={category.label}
                                      type="button"
                                      aria-expanded={activeCorporateMenu === category.label}
                                      onClick={() => setActiveCorporateMenu(category.label)}
                                      className={`border px-2.5 py-2 text-[0.6rem] uppercase tracking-wide ${
                                        activeCorporateMenu === category.label
                                          ? "border-gold text-champagne"
                                          : "border-white/10 text-white/75"
                                      }`}
                                    >
                                      {category.label}
                                    </button>
                                  )
                                ))}
                              </div>
                              {activeCorporateMenu === "Corporate Diwali Gifts" ? (
                                <ul className="grid grid-cols-2 gap-3">
                                  {giftModes.find(({ id }) => id === "corporate")!.categories.map((category) => (
                                    <li key={category.label}>
                                      <Link
                                        to={corporateCategoryHref(category.label)}
                                        onClick={() => {
                                          setCollectionsOpen(false);
                                          setOpen(false);
                                        }}
                                        className="flex items-center gap-3 border border-white/10 p-2"
                                      >
                                        <img src={category.image.src} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                                        <span className="text-sm text-white/80">{category.label}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : activeCorporateMenu in corporateMegaMenus ? (
                                <div className="space-y-4">
                                  {corporateMegaMenus[activeCorporateMenu as keyof typeof corporateMegaMenus].map((column) => (
                                    <section key={column.title}>
                                      <h3 className="mb-1 font-serif text-xs uppercase tracking-wide text-gold">{column.title}</h3>
                                      <ul className="grid grid-cols-2 gap-x-3">
                                        {column.links.map((label) => (
                                          <li key={label}>
                                            <Link
                                              to={corporateCategoryHref(label)}
                                              onClick={() => {
                                                setCollectionsOpen(false);
                                                setOpen(false);
                                              }}
                                              className="block py-1.5 text-sm text-white/75 hover:text-champagne"
                                            >
                                              {label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </section>
                                  ))}
                                </div>
                              ) : null}
                            </>
                          )}
                          {giftMode === "corporate" && (
                            <ul className="mt-3 space-y-2">
                              {collections.map((collection) => (
                                <li key={collection.slug}>
                                  <Link
                                    to={`/collections/${collection.slug}`}
                                    onClick={() => {
                                      setCollectionsOpen(false);
                                      setOpen(false);
                                    }}
                                    className="block border border-white/10 px-4 py-3 font-serif text-base text-white"
                                  >
                                    {collection.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-5 font-serif text-3xl text-white">
                      {item.label}
                      <span className="text-base text-gold">→</span>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="px-6 py-10" onClick={() => setOpen(false)}>
              <LuxButton href="/#contact" className="w-full" magnetic={false}>
                Get a Quote <Arrow />
              </LuxButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
