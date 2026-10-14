/**
 * Central brand + business configuration.
 * Only add VERIFIED business details here — they feed the footer and the
 * schema.org structured data. Empty values are simply not rendered.
 */
export const site = {
  name: "The Presentation Company",
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) || "https://www.thepresentationcompany.in").replace(/\/$/, ""),
  displayUrl: "www.thepresentationcompany.in",
  tagline: "The Art of Meaningful Gifting.",
  title: "Premium Corporate Gifts in India | The Presentation Company",
  description:
    "Discover premium corporate gifts, customised gift boxes, executive gifts and corporate gifting solutions in India. Explore The Presentation Company.",

  /**
   * Logo — drop the ORIGINAL logo file into /public/brand/ and update these
   * three values to match its real pixel size. The component never crops,
   * recolours or stretches it.
   */
  logo: {
    src: "/brand/logo.svg", // replace with "/brand/logo.png" once uploaded
    width: 600,
    height: 200,
    alt: "The Presentation Company",
  },

  /** WhatsApp number, digits only in international format. Empty hides the CTA. */
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || "",

  /** Add verified profiles only, e.g. { label: "Instagram", href: "https://instagram.com/…" } */
  social: [] as { label: "Instagram" | "LinkedIn" | "Facebook" | "YouTube" | "X"; href: string }[],
} as const;

export const nav = [
  { label: "Home", href: "/#top" },
  { label: "Collections", href: "/#collections" },
  { label: "About Us", href: "/#about" },
  { label: "Gift Concierge", href: "/#concierge" },
  { label: "How It Works", href: "/#process" },
  { label: "Contact Us", href: "/#contact" },
] as const;
