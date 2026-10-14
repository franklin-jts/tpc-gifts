import { RevealLines } from "./Reveal";

/**
 * SEO pattern used site-wide: the keyword-rich <h2> is a visible gold eyebrow,
 * and the dramatic display line beneath it is styled text. Nothing is hidden.
 */
export function SectionHeading({
  seo,
  display,
  align = "left",
  className = "",
  id,
}: {
  seo: string;
  display: React.ReactNode[];
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      <h2 id={id} className="eyebrow">
        {seo}
      </h2>
      <p className="mt-6 font-serif text-[2.6rem] leading-[1.02] tracking-[-0.01em] text-white sm:text-6xl lg:text-7xl">
        <RevealLines lines={display} />
      </p>
    </div>
  );
}
