import { site } from "@/lib/site";

/* Only verified details are emitted: no address, phone, reviews or ratings are invented. */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo.src}`,
    slogan: site.tagline,
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/#corporate-gifting`,
    serviceType: "Corporate gifting",
    name: "Premium Corporate Gifting Solutions",
    description:
      "Premium corporate gifts, customised gift boxes, executive gifts, festive corporate gift hampers and employee welcome kits for businesses in India.",
    provider: { "@id": `${site.url}/#organization` },
    areaServed: [{ "@type": "Country", name: "India" }, { "@type": "City", name: "Bengaluru" }],
    audience: { "@type": "BusinessAudience", audienceType: "Corporate buyers, HR, procurement and leadership teams" },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
