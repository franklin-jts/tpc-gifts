/** Shared validation — used by the client forms and re-run on the server. */

export type EnquiryPayload = {
  source: "enquiry-form" | "gift-concierge";
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  occasion?: string;
  quantity?: string;
  budget?: string;
  deliveryLocation?: string;
  deliveryDate?: string;
  message?: string;
  preferences?: Record<string, string | number>;
  /** Honeypot — must stay empty */
  website?: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|rediffmail|icloud)\./i;

export function normalisePhone(v: string) {
  return v.replace(/[\s\-()]/g, "");
}

export function validateEnquiry(p: EnquiryPayload): FieldErrors {
  const e: FieldErrors = {};
  const s = (v?: string) => (v ?? "").trim();

  if (s(p.fullName).length < 2) e.fullName = "Please enter your full name.";
  if (s(p.companyName).length < 2) e.companyName = "Please enter your company name.";

  if (!EMAIL_RE.test(s(p.email))) e.email = "Please enter a valid business email.";

  const phone = normalisePhone(s(p.phone));
  // Indian mobile (10 digits starting 6–9, optional +91/0) or any international number with 8–15 digits
  if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(phone) && !/^\+\d{8,15}$/.test(phone))
    e.phone = "Please enter a valid mobile number.";

  if (p.source === "enquiry-form") {
    if (!s(p.occasion)) e.occasion = "Please choose an occasion.";
    if (!/^\d{1,6}$/.test(s(p.quantity)) || Number(p.quantity) < 1) e.quantity = "Please enter an estimated quantity.";
    if (!s(p.budget)) e.budget = "Please choose a budget per gift.";
    if (s(p.deliveryLocation).length < 2) e.deliveryLocation = "Please enter a delivery location.";
  } else {
    if (s(p.deliveryLocation).length < 2) e.deliveryLocation = "Please enter a delivery city.";
    if (!s(p.deliveryDate)) e.deliveryDate = "Please choose a delivery date.";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(s(p.deliveryDate)) < today) e.deliveryDate = "Delivery date can't be in the past.";
    }
  }

  if (s(p.message).length > 2000) e.message = "Please keep your message under 2,000 characters.";
  return e;
}

/** Non-blocking hint — a personal address is allowed, we just nudge. */
export function emailHint(email: string) {
  return FREE_MAIL.test(email) ? "A work email helps us respond faster." : "";
}
