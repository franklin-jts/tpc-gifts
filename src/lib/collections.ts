import { images, type SiteImage } from "./images";

export type Collection = {
  slug: string;
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  image: SiteImage;
  /** Long-form copy for the collection page */
  intro: string;
  ideas: { title: string; text: string }[];
  idealFor: string[];
};

export const collections: Collection[] = [
  {
    slug: "executive-luxury",
    index: "I",
    title: "Executive Luxury",
    eyebrow: "Executive Corporate Gifts",
    description:
      "Discover premium executive gifts for CEOs, founders, directors and business leaders. Explore sophisticated corporate gift ideas designed to recognise leadership, celebrate achievements and strengthen professional relationships.",
    image: images.executive,
    intro:
      "Gifts for the people who set the direction of a business should feel considered, not catalogued. Our executive gifting brief begins with the recipient — their role, the relationship and the moment you want to mark — and ends with a presentation worthy of the boardroom.",
    ideas: [
      { title: "Desk & Writing", text: "Refined writing instruments, leather desk accessories and objects that earn a permanent place in the office." },
      { title: "Leather & Travel", text: "Portfolios, document holders and travel pieces for leaders who are always between meetings." },
      { title: "Gourmet Curations", text: "Considered selections of artisanal food and beverages, presented in keepsake boxes." },
      { title: "Personalised Keepsakes", text: "Engraved or monogrammed pieces that make a milestone or appointment personal." },
    ],
    idealFor: ["CXO & board gifting", "Leadership milestones", "Partner and investor appreciation", "Senior client relationships"],
  },
  {
    slug: "bespoke-creations",
    index: "II",
    title: "Bespoke Creations",
    eyebrow: "Customised Corporate Gifts",
    description:
      "Create customised corporate gifts that reflect your brand identity. From personalised gift boxes and branded accessories to specially curated gifting experiences, every detail is designed around your business.",
    image: images.bespoke,
    intro:
      "When a gift carries your name, every detail speaks for your brand. Bespoke projects start with your identity — colours, tone, story — and translate it into curated contents, tasteful branding and packaging that is opened slowly.",
    ideas: [
      { title: "Branded Gift Boxes", text: "Custom-printed or foil-detailed boxes designed around your brand guidelines." },
      { title: "Curated Kits", text: "Welcome kits, launch kits and campaign kits assembled around a single idea." },
      { title: "Personalisation", text: "Names, messages and monograms that turn a branded gift into a personal one." },
      { title: "Bulk Programmes", text: "Consistent quality and presentation across larger corporate gifting volumes." },
    ],
    idealFor: ["Brand launches", "Employee welcome kits", "Conference & event kits", "Bulk corporate gifts"],
  },
  {
    slug: "memorable-moments",
    index: "III",
    title: "Memorable Moments",
    eyebrow: "Corporate Gifts for Events & Occasions",
    description:
      "Explore premium gifting solutions for corporate events, employee celebrations, client appreciation, festive occasions and business milestones.",
    image: images.moments,
    intro:
      "Occasions give gifting its meaning. Whether it is Diwali, a year-end celebration, an offsite or a company anniversary, we shape gifts around the moment so they feel timely, generous and unmistakably yours.",
    ideas: [
      { title: "Festive Gifting", text: "Diwali corporate gifts, Christmas and New Year hampers styled for the season." },
      { title: "Event Gifting", text: "Gifts for conferences, offsites, award nights and guest experiences." },
      { title: "Employee Celebrations", text: "Work anniversaries, rewards and recognition moments across your teams." },
      { title: "Client Appreciation", text: "Thoughtful gestures that mark renewals, launches and long partnerships." },
    ],
    idealFor: ["Diwali & festive gifting", "Corporate events", "Work anniversaries", "Client appreciation"],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export const occasions = [
  {
    key: "leadership",
    title: "Leadership Gifts",
    text: "Premium gifts for CEOs, founders, executives and senior leadership teams.",
    image: images.leadership,
    occasion: "Leadership Gifting",
  },
  {
    key: "client",
    title: "Client Appreciation Gifts",
    text: "Thoughtfully curated business gifts that celebrate partnerships and strengthen client relationships.",
    image: images.executive,
    occasion: "Client Appreciation",
  },
  {
    key: "festive",
    title: "Festive Corporate Gifting",
    text: "Premium Diwali gifts, Christmas corporate gifts, New Year gift hampers and festive gifting solutions.",
    image: images.hero,
    occasion: "Festive Gifting",
  },
  {
    key: "employee",
    title: "Employee Recognition Gifts",
    text: "Customised employee welcome kits, work anniversary gifts, rewards and employee appreciation gifts.",
    image: images.employee,
    occasion: "Employee Recognition",
  },
] as const;

export const occasionOptions = [
  "Corporate Event",
  "Employee Recognition",
  "Client Appreciation",
  "Festive Gifting",
  "Welcome Kit",
  "Leadership Gifting",
  "Other",
] as const;

export const budgetOptions = [
  "₹500–₹1,000",
  "₹1,000–₹2,500",
  "₹2,500–₹5,000",
  "₹5,000–₹10,000",
  "₹10,000+",
  "Custom Budget",
] as const;
