import { useEffect } from "react";
import { site } from "./site";

/**
 * Per-page <head> management — the Vite equivalent of the Next.js
 * `metadata` exports (title, description, canonical, robots, Open Graph).
 * Defaults for the home page live in index.html.
 */
export type PageSeo = {
  title?: string;
  description?: string;
  /** Path relative to site root, e.g. "/collections/executive-luxury" */
  canonical?: string;
  robots?: string;
  image?: string;
  imageAlt?: string;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageSeo({ title, description, canonical, robots, image, imageAlt }: PageSeo) {
  useEffect(() => {
    const fullTitle = title ? (title === site.title ? title : `${title} | ${site.name}`) : site.title;
    const desc = description ?? site.description;
    const url = canonical ? `${site.url}${canonical}` : site.url;
    const img = image ?? `${site.url}/brand/logo.png`;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", robots ?? "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    if (imageAlt) upsertMeta("property", "og:image:alt", imageAlt);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
  }, [title, description, canonical, robots, image, imageAlt]);
}
