import { Link } from "react-router-dom";
import { site } from "@/lib/site";

/**
 * Renders the ORIGINAL logo file exactly as supplied — fixed aspect ratio,
 * no recolouring or cropping. Size is controlled by height only.
 */
export function Logo({ className = "h-10 md:h-12", priority = false, linked = true }: { className?: string; priority?: boolean; linked?: boolean }) {
  const img = (
    <img
      src={site.logo.src}
      alt={site.logo.alt}
      width={site.logo.width}
      height={site.logo.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={`${className} w-auto select-none`}
      style={{ aspectRatio: `${site.logo.width} / ${site.logo.height}` }}
    />
  );
  return linked ? (
    <Link to="/#top" aria-label={`${site.name} — home`} className="inline-flex shrink-0">
      {img}
    </Link>
  ) : (
    img
  );
}
