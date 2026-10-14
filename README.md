# The Presentation Company — Website (Vite)

Premium corporate gifting landing page built with **Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion for React + React Three Fiber**. This is the exact same UI/behaviour as the original Next.js build, ported to a fully client-side Vite app.

## Run it

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:5173 (dev server + /api/enquiry middleware)
npm run build && npm run preview   # production build, then serve it locally
```

Requires Node 20+.

## Before launch — three things only you can supply

1. **Logo** — the original logo was not included in the build. Put the file in `public/brand/` (e.g. `logo.png`) and update `site.logo` in `src/lib/site.ts` with its path and real pixel width/height. The current `brand/logo.svg` is a plain text placeholder.
2. **Enquiry destination** — set `ENQUIRY_WEBHOOK_URL` (see `.env.example`). Until it is set, the forms validate fully but return a clear "service being set up" message instead of a fake success.
3. **Verified business details** — social links and an optional WhatsApp number (`VITE_WHATSAPP_NUMBER`). Empty values are simply hidden. Nothing (address, phone, reviews, ratings, clients) has been invented.

Also replace the placeholder text on `/privacy-policy` and `/terms` (both are `noindex` until then).

## What changed from the Next.js version

| Next.js | Vite |
| --- | --- |
| `app/` routes (App Router) | `react-router-dom` routes in `src/App.tsx` — `/`, `/collections/:slug`, `/privacy-policy`, `/terms`, `*` → 404 |
| `next/image` (AVIF/WebP, `fill`) | plain `<img>` with `absolute inset-0 h-full w-full object-cover`; hero is `fetchPriority="high"`, the rest lazy-load |
| `next/font/google` (self-hosted) | Bree Serif from Google Fonts and Buffalo from CDNFonts, loaded in `index.html` and mapped to the global `--font-*` variables |
| `next/link` | `react-router-dom` `Link`; a `ScrollManager` reproduces hash-scroll (`/#contact`) and top-reset behaviour |
| `next/dynamic` (3D gift box) | `React.lazy` + `Suspense`; still loads only on desktop with a fine pointer, WebGL and motion allowed, after browser idle, and pauses off-screen |
| `metadata` exports | static SEO in `index.html` + `usePageSeo()` (`src/lib/seo.ts`) per page (title, description, canonical, robots, OG/Twitter) |
| `app/robots.ts`, `app/sitemap.ts` | static `public/robots.txt`, `public/sitemap.xml` |
| `app/api/enquiry/route.ts` | Vite plugin middleware (`vite.config.ts`) with identical logic, active in `vite dev` **and** `vite preview` |

Everything else — every component, all copy, Tailwind theme (`src/index.css`), animations, the Gift Concierge rules engine, validation, accessibility (skip link, ARIA, keyboard navigation, `prefers-reduced-motion`) — is a 1:1 port.

## Enquiries on static hosting

The `/api/enquiry` middleware only exists under `vite dev` / `vite preview`. If you deploy `dist/` to static hosting (Netlify, Vercel static, Cloudflare Pages, S3…):

- Set `VITE_ENQUIRY_WEBHOOK_URL` (and optionally `VITE_ENQUIRY_WEBHOOK_TOKEN`) so the browser posts directly to your webhook (Zapier/Make, HubSpot/Zoho, Google Apps Script, your backend). The webhook must allow CORS. Client and middleware re-run the same validation in `src/lib/validation.ts`.
- Or add a serverless function that reuses the logic in `vite.config.ts` and keep the `/api/enquiry` path.
- The visitor only sees "Thank you" when a 2xx response confirms receipt.

Deep links (`/collections/…`) need an SPA fallback (all three hosts above do this by default via `/* → index.html`).

## Images

`src/lib/images.ts` uses the Unsplash references from the brief. Confirm commercial licensing before launch; to self-host, run `npm run images:download`, then set `USE_LOCAL_IMAGES = true`.

## Typography

- **Bree Serif** — regular text and headings
- **Buffalo** — decorative script accents

## SEO

- One `<h1>`: "Premium Corporate Gifting in India, Beautifully Presented" (visible hero eyebrow)
- Each section's keyword `<h2>` is a visible gold eyebrow above its display line
- Canonical, Open Graph/Twitter cards, JSON-LD (Organization, WebSite, Service on every page; BreadcrumbList on collection pages), static `sitemap.xml` and `robots.txt`

## Structure

```
index.html          fonts, default SEO meta, global JSON-LD
public/             brand/logo.svg, robots.txt, sitemap.xml
src/
  App.tsx           router, scroll manager, skip link, MotionConfig
  pages/            Home, CollectionPage, PrivacyPolicy, Terms, NotFound
  components/       AnnouncementBar, LuxuryNavbar, CinematicHero, GiftBox3D, GiftBoxStatic,
                    BrandMarquee, BrandPhilosophy, SignatureCollections, UnboxingExperience,
                    GiftingOccasions, GiftConcierge, GiftingProcess, PremiumCTA, EnquiryForm,
                    LuxuryFooter, Logo, JsonLd, Providers, ui/*
  lib/              site config, images, collections, concierge rules, validation, enquiry client, seo
vite.config.ts      plugins + /api/enquiry dev/preview middleware
```
