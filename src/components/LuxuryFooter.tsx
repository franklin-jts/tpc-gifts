import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import { GoldDivider } from "./ui/GoldDivider";

const links = [
  { label: "Home", href: "/#top" },
  { label: "Corporate Gifts", href: "/#collections" },
  { label: "Executive Gifts", href: "/collections/executive-luxury" },
  { label: "Customised Gifts", href: "/collections/bespoke-creations" },
  { label: "Festive Gifts", href: "/collections/memorable-moments" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function LuxuryFooter() {
  return (
    <footer className="border-t border-gold/20 bg-black px-5 pb-10 pt-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-16 md:h-20" />
            <p className="mt-6 font-serif text-2xl italic text-champagne">{site.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Premium corporate gifts, customised gift boxes and executive gifting for businesses in Bengaluru and across India.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <p className="eyebrow">Explore</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-white/75 transition-colors hover:text-champagne">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow">Connect</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={site.url} className="text-white/75 hover:text-champagne">{site.displayUrl}</a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-champagne">{s.label}</a>
                </li>
              ))}
              <li>
                <Link to="/#contact" className="text-champagne hover:underline">Request a quotation →</Link>
              </li>
            </ul>
          </div>
        </div>

        <GoldDivider className="mt-16" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
          <p>© 2026 The Presentation Company. All Rights Reserved.</p>
          <ul className="flex gap-6">
            <li><Link to="/privacy-policy" className="hover:text-champagne">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-champagne">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
