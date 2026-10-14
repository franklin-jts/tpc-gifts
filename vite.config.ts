import { defineConfig, loadEnv, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { validateEnquiry, type EnquiryPayload } from "./src/lib/validation";

/**
 * POST /api/enquiry — mirrors the former Next.js route handler.
 * Re-validates, drops honeypot submissions, and forwards JSON to
 * ENQUIRY_WEBHOOK_URL with an optional bearer token. Returns 2xx ONLY when
 * the webhook confirms receipt. Available in `vite dev` and `vite preview`.
 */
function enquiryApi(): Plugin {
  const handle = (webhook: string | undefined, token: string | undefined): Connect.NextHandleFunction => {
    return async (req, res, next) => {
      if (req.method !== "POST" || req.url !== "/api/enquiry") return next();

      const json = (body: object, status: number) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      let body: EnquiryPayload;
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return json({ error: "Invalid request." }, 400);
      }

      if (body.website) return json({ error: "Invalid request." }, 400);
      if (body.source !== "enquiry-form" && body.source !== "gift-concierge")
        return json({ error: "Invalid request." }, 400);

      const fieldErrors = validateEnquiry(body);
      if (Object.keys(fieldErrors).length)
        return json({ error: "Please check the highlighted fields.", fieldErrors }, 422);

      if (!webhook) {
        console.error("[enquiry] ENQUIRY_WEBHOOK_URL is not configured — enquiry not delivered.");
        return json({ error: "Our enquiry service is being set up. Please try again later." }, 503);
      }

      const reference = `TPC-${Date.now().toString(36).toUpperCase()}`;
      const { website: _hp, ...clean } = body;
      void _hp;

      try {
        const upstream = await fetch(webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ reference, receivedAt: new Date().toISOString(), ...clean }),
          signal: AbortSignal.timeout(10_000),
        });
        if (!upstream.ok) {
          console.error("[enquiry] webhook responded", upstream.status);
          return json({ error: "We couldn't send your enquiry just now. Please try again shortly." }, 502);
        }
        return json({ ok: true, reference }, 200);
      } catch (err) {
        console.error("[enquiry] webhook failed", err);
        return json({ error: "We couldn't send your enquiry just now. Please try again shortly." }, 502);
      }
    };
  };

  const attach = (server: { middlewares: Connect.Server }) => {
    const env = loadEnv(process.env.NODE_ENV || "development", fileURLToPath(new URL(".", import.meta.url)), "");
    server.middlewares.use(handle(env.ENQUIRY_WEBHOOK_URL, env.ENQUIRY_WEBHOOK_TOKEN));
  };

  return {
    name: "tpc-enquiry-api",
    configureServer: attach,
    configurePreviewServer: attach as unknown as Plugin["configurePreviewServer"],
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), enquiryApi()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { host: true },
  preview: { host: true },
});
