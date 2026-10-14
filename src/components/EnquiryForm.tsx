import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { occasionOptions, budgetOptions } from "@/lib/collections";
import { validateEnquiry, emailHint, type EnquiryPayload, type FieldErrors } from "@/lib/validation";
import { submitEnquiry } from "@/lib/enquiry";
import { site } from "@/lib/site";
import { SectionHeading } from "./ui/SectionHeading";
import { LuxButton, Arrow } from "./ui/LuxButton";

type Values = Omit<EnquiryPayload, "source" | "preferences">;
const empty: Required<Pick<Values, "fullName" | "companyName" | "email" | "phone" | "occasion" | "quantity" | "budget" | "deliveryLocation" | "message" | "website">> = {
  fullName: "", companyName: "", email: "", phone: "", occasion: "", quantity: "", budget: "", deliveryLocation: "", message: "", website: "",
};
type Key = keyof typeof empty;

export function EnquiryForm() {
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [reference, setReference] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Pre-select occasion when arriving from an occasion card (/?occasion=…#contact)
  const { search } = useLocation();
  useEffect(() => {
    const o = new URLSearchParams(search).get("occasion");
    if (o && (occasionOptions as readonly string[]).includes(o)) setV((p) => ({ ...p, occasion: o }));
  }, [search]);

  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = k === "quantity" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value;
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const payload: EnquiryPayload = { source: "enquiry-form", ...v };
    const errs = validateEnquiry(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setStatus("submitting");
    setServerMsg("");
    const res = await submitEnquiry(payload, abortRef.current.signal);
    if (res.ok) {
      setReference(res.reference);
      setStatus("success");
      setV(empty);
    } else {
      setStatus("error");
      setServerMsg(res.error);
      if (res.fieldErrors) setErrors(res.fieldErrors as FieldErrors);
    }
  };

  const field = (k: Key, label: string, el: React.ReactNode, wide = false) => (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`eq-${k}`} className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
        {label} {k !== "message" && <span className="text-gold" aria-hidden="true">*</span>}
      </label>
      {el}
      {errors[k] && <p id={`eq-${k}-err`} className="mt-1 text-xs text-[#f0a58f]">{errors[k]}</p>}
      {k === "email" && !errors.email && emailHint(v.email) && <p className="mt-1 text-xs text-muted">{emailHint(v.email)}</p>}
    </div>
  );
  const common = (k: Key) => ({
    id: `eq-${k}`,
    name: k,
    value: v[k],
    onChange: set(k),
    className: "field",
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `eq-${k}-err` : undefined,
    "aria-required": k !== "message",
  });

  const wa = site.whatsapp
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello, I'd like to enquire about corporate gifting with The Presentation Company.")}`
    : null;

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-night px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            seo="Corporate Gifting in Bengaluru & Across India"
            display={[<>Let&apos;s Create</>, <span key="s" className="script-glow text-[1.15em]">Something Special.</span>]}
          />
          <p className="mt-8 max-w-md leading-relaxed text-muted">
            Tell us about your audience, occasion and timeline. Our gifting team will respond with curated options, customisation
            ideas and a detailed quotation.
          </p>
          <ul className="mt-10 space-y-4 text-sm text-white/75">
            {["Executive & leadership gifting", "Client appreciation & festive hampers", "Employee welcome kits & recognition", "Bulk and event gifting"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="text-[10px] text-gold" aria-hidden="true">✦</span>{t}
              </li>
            ))}
          </ul>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex min-h-12 items-center gap-3 border border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-gold hover:text-champagne">
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>
          )}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="ok" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-gold/30 p-10 text-center md:p-16">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold text-gold"><Check /></div>
                <h3 className="mt-6 font-serif text-4xl">Thank you.</h3>
                <p className="mx-auto mt-4 max-w-md text-muted">Your enquiry has been received. Our gifting team will be in touch shortly.</p>
                {reference && <p className="mt-4 text-xs tracking-[0.2em] text-champagne">REFERENCE · {reference}</p>}
                <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-xs uppercase tracking-[0.25em] text-champagne hover:underline">Send another enquiry</button>
              </motion.div>
            ) : (
              <motion.form key="form" ref={formRef} noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby="eq-note">
                {field("fullName", "Full name", <input {...common("fullName")} autoComplete="name" />)}
                {field("companyName", "Company name", <input {...common("companyName")} autoComplete="organization" />)}
                {field("email", "Business email", <input {...common("email")} type="email" autoComplete="email" />)}
                {field("phone", "Mobile number", <input {...common("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />)}
                {field("occasion", "Gifting occasion",
                  <select {...common("occasion")}>
                    <option value="" disabled>Select an occasion</option>
                    {occasionOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>)}
                {field("quantity", "Estimated quantity", <input {...common("quantity")} inputMode="numeric" pattern="[0-9]*" />)}
                {field("budget", "Budget per gift",
                  <select {...common("budget")}>
                    <option value="" disabled>Select a budget</option>
                    {budgetOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>)}
                {field("deliveryLocation", "Delivery location", <input {...common("deliveryLocation")} autoComplete="address-level2" placeholder="e.g. Bengaluru" />)}
                {field("message", "Message", <textarea {...common("message")} rows={4} maxLength={2000} placeholder="Tell us about your recipients, timelines or branding needs" />, true)}

                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

                <div className="sm:col-span-2">
                  {status === "error" && <p role="alert" className="mb-6 border-l-2 border-[#e07a5f] pl-4 text-sm text-[#f0a58f]">{serverMsg}</p>}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <p id="eq-note" className="text-xs text-white/45">Fields marked <span className="text-gold">*</span> are required.</p>
                    <LuxButton type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"} className="disabled:opacity-60">
                      {status === "submitting" ? (<><Loader2 className="animate-spin" size={16} /> Sending…</>) : (<>Request a Custom Quotation <Arrow /></>)}
                    </LuxButton>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
