/**
 * Reference imagery from the brief (Unsplash).
 * Before launch: confirm licensing for commercial use, then optionally run
 * `npm run images:download` to self-host them in /public/images and set
 * USE_LOCAL_IMAGES to true. Check that every alt text still matches its photo.
 */
const USE_LOCAL_IMAGES = false;

const remote = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=2400`;

function img(key: string, id: string, alt: string) {
  return { src: USE_LOCAL_IMAGES ? `/images/${key}.jpg` : remote(id), alt, id, key };
}

export const images = {
  hero: img("hero", "1549465220-1a8b9238cd48", "Elegantly wrapped premium gift box with ribbon in soft, warm light"),
  executive: img("executive", "1513201099705-a9746e1e201f", "Curated luxury gift boxes prepared for executive corporate gifting"),
  bespoke: img("bespoke", "1607082348824-0a96f2a4b9da", "Customised gift packaging prepared for a branded corporate gift"),
  moments: img("moments", "1492684223066-81342ee5ff30", "Guests celebrating together at a corporate event"),
  unboxing: img("unboxing", "1607344645866-009c320b63e0", "Hands opening a premium gift box to reveal a curated gift"),
  // The brief listed an incomplete ID (photo-1523275335684); the full Unsplash ID is used here.
  leadership: img("leadership", "1523275335684-37898b6baf30", "Classic wristwatch presented as a premium leadership gift"),
  employee: img("employee", "1497366754035-f200968a6e72", "Modern office workspace representing employee recognition gifting"),
  cta: img("cta", "1512909006721-3d6018887383", "Beautifully wrapped festive gifts arranged with warm lights"),
};

export type SiteImage = (typeof images)[keyof typeof images];
