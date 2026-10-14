/**
 * Gift Concierge — deterministic rules engine.
 * No AI, no live inventory, no prices: it maps a buyer's choices to a curated
 * gifting direction that the team then turns into a real quotation.
 */

export const audiences = ["CXOs & Founders", "Clients & Partners", "Employees", "Event Guests"] as const;
export const budgets = ["₹500–₹1,000", "₹1,000–₹2,500", "₹2,500–₹5,000", "₹5,000–₹10,000", "₹10,000+", "Custom Budget"] as const;
export const styles = ["Luxury & Premium", "Innovative & Tech", "Sustainable", "Personalised", "Lifestyle", "Bespoke"] as const;
export const conciergeOccasions = ["Corporate Event", "Employee Recognition", "Client Appreciation", "Festive Gifting", "Welcome Kit", "Other"] as const;

export type Audience = (typeof audiences)[number];
export type Budget = (typeof budgets)[number];
export type Style = (typeof styles)[number];
export type ConciergeOccasion = (typeof conciergeOccasions)[number];

export type ConciergeAnswers = {
  audience: Audience;
  budget: Budget;
  style: Style;
  quantity: number;
  occasion: ConciergeOccasion;
};

export type Recommendation = {
  name: string;
  tagline: string;
  summary: string;
  categories: string[];
  concepts: string[];
  presentation: string;
  notes: string[];
};

type Tier = "essential" | "refined" | "premium" | "signature" | "open";

const tierOf = (b: Budget): Tier =>
  ({
    "₹500–₹1,000": "essential",
    "₹1,000–₹2,500": "refined",
    "₹2,500–₹5,000": "premium",
    "₹5,000–₹10,000": "signature",
    "₹10,000+": "signature",
    "Custom Budget": "open",
  })[b] as Tier;

const STYLE_BASE: Record<Style, { name: string; tagline: string; summary: string; categories: Record<Exclude<Tier, "open">, string[]> }> = {
  "Luxury & Premium": {
    name: "The Prestige Collection",
    tagline: "Quiet luxury, unmistakably considered.",
    summary: "Refined materials, classic forms and a presentation that feels like an occasion in itself.",
    categories: {
      essential: ["Premium stationery sets", "Artisanal tea & coffee boxes", "Fine-finish desk accessories"],
      refined: ["Leather card holders & wallets", "Signature writing instruments", "Gourmet curations"],
      premium: ["Leather portfolios & travel pieces", "Premium drinkware sets", "Curated luxury hampers"],
      signature: ["Heirloom-quality leather goods", "Statement desk objects", "Signature luxury hampers"],
    },
  },
  "Innovative & Tech": {
    name: "The Future-Forward Collection",
    tagline: "Smart gifts for people who move fast.",
    summary: "Useful, well-designed technology that earns a place in the everyday — chosen for quality, not novelty.",
    categories: {
      essential: ["Wireless charging accessories", "Cable & desk organisers", "Smart bottles"],
      refined: ["Power banks with premium finish", "Wireless audio accessories", "Tech travel pouches"],
      premium: ["Premium audio", "Smart desk setups", "Tech travel kits"],
      signature: ["Flagship audio & wearables", "Executive tech kits", "Design-led smart home pieces"],
    },
  },
  Sustainable: {
    name: "The Conscious Luxury Collection",
    tagline: "Beautiful gifts with a lighter footprint.",
    summary: "Natural materials, artisan craft and reusable packaging — sustainability presented without compromise.",
    categories: {
      essential: ["Plantable stationery", "Organic tea & spice boxes", "Bamboo desk essentials"],
      refined: ["Handcrafted artisan pieces", "Organic gourmet curations", "Reusable drinkware"],
      premium: ["Artisan-made home décor", "Sustainable leather alternatives", "Zero-waste hampers"],
      signature: ["Heritage craft collections", "Statement artisan objects", "Conscious luxury hampers"],
    },
  },
  Personalised: {
    name: "The Signature Experience",
    tagline: "A gift that could only be theirs.",
    summary: "Names, monograms and messages that turn a corporate gift into a personal gesture.",
    categories: {
      essential: ["Monogrammed notebooks", "Personalised drinkware", "Name-engraved desk pieces"],
      refined: ["Engraved writing instruments", "Monogrammed leather accessories", "Personal message cards"],
      premium: ["Personalised leather collections", "Custom keepsake boxes", "Engraved premium sets"],
      signature: ["Bespoke engraved heirlooms", "Personalised luxury hampers", "One-of-a-kind keepsakes"],
    },
  },
  Lifestyle: {
    name: "The Lifestyle Edit",
    tagline: "Gifts for life beyond the desk.",
    summary: "Wellness, home and leisure pieces that feel generous and get used long after the occasion.",
    categories: {
      essential: ["Wellness essentials", "Gourmet treats", "Home fragrance"],
      refined: ["Self-care sets", "Coffee & tea rituals", "Home & table pieces"],
      premium: ["Wellness hampers", "Weekend & travel kits", "Premium home collections"],
      signature: ["Luxury wellness curations", "Entertaining & barware sets", "Statement home pieces"],
    },
  },
  Bespoke: {
    name: "The Bespoke Atelier",
    tagline: "Designed from a blank page, around your brand.",
    summary: "A fully custom gifting concept — contents, branding and packaging built around your story.",
    categories: {
      essential: ["Custom-branded kits", "Branded packaging", "Curated themed boxes"],
      refined: ["Custom curated hampers", "Brand-story gift sets", "Custom packaging inserts"],
      premium: ["Fully bespoke gift boxes", "Co-designed brand collections", "Experience-led kits"],
      signature: ["Signature bespoke programmes", "Collector-grade presentation boxes", "Commissioned pieces"],
    },
  },
};

const AUDIENCE_CONCEPTS: Record<Audience, string[]> = {
  "CXOs & Founders": ["An understated gift with one exceptional hero piece", "A handwritten note from your leadership"],
  "Clients & Partners": ["A gift that reflects the partnership, not just your logo", "Subtle co-branding with a personal message"],
  Employees: ["A gift they will use every day", "Recognition messaging that feels personal at scale"],
  "Event Guests": ["A memorable keepsake tied to the event theme", "Easy-to-carry presentation for guests on the move"],
};

const OCCASION_DETAIL: Record<ConciergeOccasion, { concept: string; presentation: string }> = {
  "Corporate Event": { concept: "Event-themed curation that extends the experience", presentation: "Event-coordinated packaging with a custom insert card" },
  "Employee Recognition": { concept: "Milestone messaging for anniversaries and achievements", presentation: "Recognition box with a personalised message card" },
  "Client Appreciation": { concept: "A thank-you gift sized to the relationship", presentation: "Signature gift box with a hand-finished message" },
  "Festive Gifting": { concept: "Seasonal curation for Diwali, Christmas or New Year", presentation: "Festive-styled packaging with seasonal detailing" },
  "Welcome Kit": { concept: "An onboarding kit that introduces your culture", presentation: "Branded welcome box designed for first-day unboxing" },
  Other: { concept: "A concept shaped around your brief", presentation: "Presentation tailored once we understand the occasion" },
};

export function recommend(a: ConciergeAnswers): Recommendation {
  const base = STYLE_BASE[a.style];
  const tier = tierOf(a.budget);

  const categories =
    tier === "open"
      ? [...base.categories.refined.slice(0, 2), ...base.categories.signature.slice(0, 2)]
      : base.categories[tier];

  const occ = OCCASION_DETAIL[a.occasion];
  const concepts = [occ.concept, ...AUDIENCE_CONCEPTS[a.audience]];

  const notes: string[] = [];
  if (tier === "open") notes.push("Share your budget with us and we'll shape options around it.");
  if (a.quantity >= 250) notes.push("For larger volumes, earlier planning gives more choice in customisation and packaging.");
  if (a.quantity > 0 && a.quantity < 10) notes.push("Small, high-touch orders are ideal for deeper personalisation.");
  if (a.audience === "CXOs & Founders" && (tier === "essential" || tier === "refined"))
    notes.push("For senior recipients, we'll focus the budget on one standout piece and its presentation.");

  return {
    name: base.name,
    tagline: base.tagline,
    summary: base.summary,
    categories,
    concepts,
    presentation: occ.presentation,
    notes,
  };
}
