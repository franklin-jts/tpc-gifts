import { validateEnquiry, type EnquiryPayload } from "./validation";

export type SubmitResult = { ok: true; reference?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const SERVICE_UNAVAILABLE = "Our enquiry service is being set up. Please try again later.";
const SEND_FAILED = "We couldn't send your enquiry just now. Please try again shortly.";

const asJson = (init: RequestInit, token?: string): RequestInit => ({
  ...init,
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {}),
  },
});

/**
 * Client-side API abstraction.
 * 1. Tries the /api/enquiry middleware (available in `vite dev` / `vite preview`).
 * 2. On static hosting (no API route) falls back to posting straight to
 *    VITE_ENQUIRY_WEBHOOK_URL from the browser.
 * Success is only reported when a 2xx response confirms receipt.
 */
export async function submitEnquiry(payload: EnquiryPayload, signal?: AbortSignal): Promise<SubmitResult> {
  const body = JSON.stringify({ ...payload, page: typeof window !== "undefined" ? window.location.href : undefined });

  // —— 1. Server route (dev / preview) ——
  try {
    const res = await fetch("/api/enquiry", asJson({ method: "POST", body, signal }));
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = (await res.json().catch(() => ({}))) as { reference?: string; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok) return { ok: true, reference: data.reference };
      return { ok: false, error: data.error || SEND_FAILED, fieldErrors: data.fieldErrors };
    }
    // Non-JSON (e.g. SPA fallback returning index.html) → fall through.
  } catch (err) {
    if ((err as Error).name === "AbortError") return { ok: false, error: "Request cancelled." };
    // Network error → try the direct-webhook path below.
  }

  // —— 2. Static-hosting fallback: post straight to the webhook ——
  const webhook = import.meta.env.VITE_ENQUIRY_WEBHOOK_URL as string | undefined;
  const token = import.meta.env.VITE_ENQUIRY_WEBHOOK_TOKEN as string | undefined;
  if (!webhook) return { ok: false, error: SERVICE_UNAVAILABLE };

  const errs = validateEnquiry(payload);
  if (Object.keys(errs).length) return { ok: false, error: "Please check the highlighted fields.", fieldErrors: errs };
  if (payload.website) return { ok: false, error: "Invalid request." };

  const reference = `TPC-${Date.now().toString(36).toUpperCase()}`;
  const { website: _hp, ...clean } = payload;
  void _hp;

  try {
    const res = await fetch(
      webhook,
      asJson({ method: "POST", body: JSON.stringify({ reference, receivedAt: new Date().toISOString(), ...clean }), signal }, token),
    );
    if (!res.ok) return { ok: false, error: SEND_FAILED };
    return { ok: true, reference };
  } catch (err) {
    if ((err as Error).name === "AbortError") return { ok: false, error: "Request cancelled." };
    return { ok: false, error: "We couldn't reach our server. Please check your connection and try again." };
  }
}
