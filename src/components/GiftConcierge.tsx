import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Loader2, RotateCcw } from "lucide-react";
import {
  audiences, budgets, styles, conciergeOccasions, recommend,
  type Audience, type Budget, type Style, type ConciergeOccasion,
} from "@/lib/concierge";
import { validateEnquiry, emailHint, type EnquiryPayload, type FieldErrors } from "@/lib/validation";
import { submitEnquiry } from "@/lib/enquiry";
import { SectionHeading } from "./ui/SectionHeading";
import { LuxButton, Arrow } from "./ui/LuxButton";

type Answers = { audience?: Audience; budget?: Budget; customBudget: string; style?: Style; quantity: string; occasion?: ConciergeOccasion };
const STEPS = ["Who are you gifting?", "Select your budget", "Select your gifting style", "How many gifts?", "What's the occasion?"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

function Options<T extends string>({ name, options, value, onChange, cols = "sm:grid-cols-2" }: { name: string; options: readonly T[]; value?: T; onChange: (v: T) => void; cols?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = options.length;
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n : -1;
    if (next >= 0) {
      e.preventDefault();
      refs.current[next]?.focus();
      onChange(options[next]);
    }
  };
  return (
    <div role="radiogroup" aria-label={name} className={`grid grid-cols-1 gap-3 ${cols}`}>
      {options.map((o, i) => {
        const active = value === o;
        return (
          <button
            key={o}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || (!value && i === 0) ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange(o)}
            className={`group flex min-h-14 items-center justify-between gap-4 border px-5 py-4 text-left transition-all duration-400 ${
              active ? "border-gold bg-gold/10 text-white" : "border-white/12 text-white/80 hover:border-gold/50 hover:text-white"
            }`}
          >
            <span className="font-serif text-lg">{o}</span>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${active ? "border-gold bg-gold text-black" : "border-white/30"}`}>
              {active && <Check size={12} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function GiftConcierge() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ customBudget: "", quantity: "" });
  const [phase, setPhase] = useState<"quiz" | "result" | "lead" | "sent">("quiz");
  const panelRef = useRef<HTMLDivElement>(null);

  const qty = Number(a.quantity);
  const stepValid = [!!a.audience, !!a.budget, !!a.style, Number.isInteger(qty) && qty >= 1 && qty <= 999999, !!a.occasion][step];

  const rec = useMemo(
    () =>
      a.audience && a.budget && a.style && a.occasion && qty > 0
        ? recommend({ audience: a.audience, budget: a.budget, style: a.style, quantity: qty, occasion: a.occasion })
        : null,
    [a, qty],
  );

  const focusPanel = () => requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  const next = () => {
    if (!stepValid) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setPhase("result");
    focusPanel();
  };
  const back = () => {
    if (phase !== "quiz") setPhase(phase === "lead" ? "result" : "quiz");
    else setStep(Math.max(0, step - 1));
    focusPanel();
  };
  const restart = () => {
    setA({ customBudget: "", quantity: "" });
    setStep(0);
    setPhase("quiz");
    focusPanel();
  };

  const progress = phase === "quiz" ? step / STEPS.length : 1;

  return (
    <section id="concierge" aria-labelledby="concierge-title" className="relative overflow-hidden bg-night px-5 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(214,166,77,0.10),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="concierge-title"
            seo="Discover Your Perfect Corporate Gift"
            display={[<>The Perfect Gift</>, <span key="b" className="script-glow text-[1.15em]">Begins With You.</span>]}
          />
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Discover personalised corporate gifting ideas based on your audience, occasion, budget and gifting preferences.
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
            Five quick questions. You&apos;ll get a curated gifting direction — then our team prepares a tailored quotation with
            products, customisation and packaging options.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative border border-gold/25 bg-black/60 p-6 backdrop-blur-sm sm:p-10">
            <span className="pointer-events-none absolute -left-px -top-px h-6 w-6 border-l border-t border-gold" />
            <span className="pointer-events-none absolute -bottom-px -right-px h-6 w-6 border-b border-r border-gold" />

            {/* progress */}
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-muted">
              <span>{phase === "quiz" ? `Step ${step + 1} of ${STEPS.length}` : phase === "sent" ? "Enquiry sent" : "Your recommendation"}</span>
              {(phase !== "quiz" || step > 0) && phase !== "sent" && (
                <button type="button" onClick={back} className="inline-flex items-center gap-2 py-2 hover:text-champagne">
                  <ArrowLeft size={14} /> Back
                </button>
              )}
            </div>
            <div className="mt-3 h-px w-full bg-white/10" role="progressbar" aria-label="Concierge progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <motion.div className="h-px bg-gold" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8, ease }} />
            </div>

            <div ref={panelRef} tabIndex={-1} className="mt-8 outline-none" aria-live="polite">
              <AnimatePresence mode="wait">
                {phase === "quiz" && (
                  <motion.div key={`s${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease }}>
                    <h3 className="font-serif text-3xl text-white md:text-4xl">{STEPS[step]}</h3>
                    <div className="mt-8">
                      {step === 0 && <Options name={STEPS[0]} options={audiences} value={a.audience} onChange={(v) => setA({ ...a, audience: v })} />}
                      {step === 1 && (
                        <>
                          <Options name={STEPS[1]} options={budgets} value={a.budget} onChange={(v) => setA({ ...a, budget: v })} />
                          {a.budget === "Custom Budget" && (
                            <label className="mt-6 block">
                              <span className="text-xs uppercase tracking-[0.2em] text-muted">Your budget per gift (optional)</span>
                              <input className="field" inputMode="text" placeholder="e.g. ₹15,000" value={a.customBudget} onChange={(e) => setA({ ...a, customBudget: e.target.value })} />
                            </label>
                          )}
                        </>
                      )}
                      {step === 2 && <Options name={STEPS[2]} options={styles} value={a.style} onChange={(v) => setA({ ...a, style: v })} />}
                      {step === 3 && (
                        <div>
                          <label htmlFor="cq-qty" className="text-xs uppercase tracking-[0.2em] text-muted">Number of gifts required</label>
                          <input
                            id="cq-qty"
                            className="field font-serif !text-4xl"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            value={a.quantity}
                            onChange={(e) => setA({ ...a, quantity: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                            onKeyDown={(e) => e.key === "Enter" && next()}
                          />
                          <div className="mt-6 flex flex-wrap gap-2">
                            {[25, 50, 100, 250, 500, 1000].map((n) => (
                              <button key={n} type="button" onClick={() => setA({ ...a, quantity: String(n) })} className={`min-h-11 border px-4 text-sm transition-colors ${a.quantity === String(n) ? "border-gold text-champagne" : "border-white/15 text-white/70 hover:border-gold/50"}`}>
                                {n.toLocaleString("en-IN")}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {step === 4 && <Options name={STEPS[4]} options={conciergeOccasions} value={a.occasion} onChange={(v) => setA({ ...a, occasion: v })} />}
                    </div>
                    <div className="mt-10 flex justify-end">
                      <LuxButton onClick={next} disabled={!stepValid} className="disabled:cursor-not-allowed disabled:opacity-40" magnetic={false}>
                        {step === STEPS.length - 1 ? "Reveal My Recommendation" : "Continue"} <Arrow kind="right" />
                      </LuxButton>
                    </div>
                  </motion.div>
                )}

                {phase === "result" && rec && (
                  <motion.div key="result" initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease }}>
                    <p className="eyebrow">Curated for you</p>
                    <h3 className="mt-4 font-serif text-4xl text-gold shimmer md:text-5xl">{rec.name}</h3>
                    <p className="mt-2 script-glow text-3xl">{rec.tagline}</p>
                    <p className="mt-6 leading-relaxed text-muted">{rec.summary}</p>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                      <div>
                        <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-champagne">Suggested categories</h4>
                        <ul className="mt-4 space-y-3">
                          {rec.categories.map((c, i) => (
                            <motion.li key={c} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex gap-3 text-sm text-white/85">
                              <span className="text-gold" aria-hidden="true">✦</span>{c}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-champagne">Gifting concepts</h4>
                        <ul className="mt-4 space-y-3">
                          {rec.concepts.map((c, i) => (
                            <motion.li key={c} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }} className="flex gap-3 text-sm text-white/85">
                              <span className="text-gold" aria-hidden="true">✦</span>{c}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/75">
                      <span className="text-champagne">Presentation · </span>{rec.presentation}
                      {rec.notes.map((n) => <p key={n} className="mt-2 text-muted">{n}</p>)}
                    </div>

                    <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                      <div><dt className="inline">For: </dt><dd className="inline text-white/80">{a.audience}</dd></div>
                      <div><dt className="inline">Budget: </dt><dd className="inline text-white/80">{a.budget === "Custom Budget" && a.customBudget ? a.customBudget : a.budget}</dd></div>
                      <div><dt className="inline">Quantity: </dt><dd className="inline text-white/80">{qty.toLocaleString("en-IN")}</dd></div>
                      <div><dt className="inline">Occasion: </dt><dd className="inline text-white/80">{a.occasion}</dd></div>
                    </dl>

                    <p className="mt-6 text-xs text-white/45">Product availability, customisation options and pricing are confirmed in your quotation.</p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <LuxButton onClick={() => { setPhase("lead"); focusPanel(); }} magnetic={false}>
                        Get My Customised Quotation <Arrow />
                      </LuxButton>
                      <button type="button" onClick={restart} className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-champagne">
                        <RotateCcw size={14} /> Start again
                      </button>
                    </div>
                  </motion.div>
                )}

                {phase === "lead" && rec && (
                  <motion.div key="lead" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
                    <ConciergeLeadForm
                      recommendation={rec.name}
                      preferences={{
                        audience: a.audience!,
                        budget: a.budget === "Custom Budget" && a.customBudget ? `Custom: ${a.customBudget}` : a.budget!,
                        style: a.style!,
                        quantity: qty,
                        occasion: a.occasion!,
                        recommendation: rec.name,
                      }}
                      onSent={() => { setPhase("sent"); focusPanel(); }}
                    />
                  </motion.div>
                )}

                {phase === "sent" && (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease }} className="py-10 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold text-gold"><Check /></div>
                    <h3 className="mt-6 font-serif text-4xl">Thank you.</h3>
                    <p className="mx-auto mt-4 max-w-sm text-muted">Your preferences have reached our gifting team. We&apos;ll be in touch with your customised quotation.</p>
                    <button type="button" onClick={restart} className="mt-8 text-xs uppercase tracking-[0.25em] text-champagne hover:underline">Explore another idea</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConciergeLeadForm({ recommendation, preferences, onSent }: { recommendation: string; preferences: Record<string, string | number>; onSent: () => void }) {
  const [v, setV] = useState({ fullName: "", companyName: "", email: "", phone: "", deliveryLocation: "", deliveryDate: "", website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const payload: EnquiryPayload = { source: "gift-concierge", ...v, preferences };
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setV({ ...v, [k]: e.target.value });
    if (errors[k as keyof FieldErrors]) setErrors({ ...errors, [k]: undefined });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateEnquiry(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("submitting");
    setServerError("");
    const res = await submitEnquiry(payload);
    if (res.ok) onSent();
    else {
      setStatus("error");
      setServerError(res.error);
      if (res.fieldErrors) setErrors(res.fieldErrors as FieldErrors);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const F = ({ k, label, type = "text", autoComplete, inputMode, min }: { k: keyof typeof v; label: string; type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; min?: string }) => {
    const err = errors[k as keyof FieldErrors];
    return (
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">{label}</span>
        <input name={k} type={type} className="field" value={v[k]} onChange={set(k)} autoComplete={autoComplete} inputMode={inputMode} min={min} aria-invalid={!!err} aria-describedby={err ? `cq-${k}-err` : undefined} />
        {err && <span id={`cq-${k}-err`} className="mt-1 block text-xs text-[#f0a58f]">{err}</span>}
        {k === "email" && !err && emailHint(v.email) && <span className="mt-1 block text-xs text-muted">{emailHint(v.email)}</span>}
      </label>
    );
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <p className="eyebrow">Your quotation</p>
      <h3 className="mt-3 font-serif text-3xl md:text-4xl">
        Let&apos;s bring <span className="text-gold italic">{recommendation}</span> to life.
      </h3>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {F({ k: "fullName", label: "Your name", autoComplete: "name" })}
        {F({ k: "companyName", label: "Company name", autoComplete: "organization" })}
        {F({ k: "email", label: "Work email", type: "email", autoComplete: "email" })}
        {F({ k: "phone", label: "Phone number", type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {F({ k: "deliveryLocation", label: "Delivery city", autoComplete: "address-level2" })}
        {F({ k: "deliveryDate", label: "Required delivery date", type: "date", min: today })}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      {status === "error" && <p role="alert" className="mt-6 border-l-2 border-[#e07a5f] pl-4 text-sm text-[#f0a58f]">{serverError}</p>}
      <div className="mt-10">
        <LuxButton type="submit" disabled={status === "submitting"} magnetic={false} className="disabled:opacity-60">
          {status === "submitting" ? (<><Loader2 className="animate-spin" size={16} /> Sending…</>) : (<>Get My Customised Quotation <Arrow /></>)}
        </LuxButton>
      </div>
    </form>
  );
}
