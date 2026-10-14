import { Link } from "react-router-dom";
import { usePageSeo } from "@/lib/seo";

export default function NotFound() {
  usePageSeo({ title: "Page Not Found", robots: "noindex, follow" });

  return (
    <main className="grid min-h-svh place-items-center bg-night px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl">This page has been <span className="script-glow">unwrapped</span>.</h1>
        <p className="mt-4 text-muted">The page you were looking for doesn&apos;t exist.</p>
        <Link to="/" className="mt-10 inline-block border border-gold px-8 py-4 text-xs font-semibold tracking-[0.25em] text-gold hover:bg-gold hover:text-black">
          RETURN HOME
        </Link>
      </div>
    </main>
  );
}
