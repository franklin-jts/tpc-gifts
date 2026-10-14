import { Link } from "react-router-dom";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { LuxuryNavbar } from "@/components/LuxuryNavbar";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { usePageSeo } from "@/lib/seo";

// TODO: replace with the company's approved legal text before launch. Kept out of search until then.
export default function Terms() {
  usePageSeo({ title: "Terms & Conditions", canonical: "/terms", robots: "noindex, follow" });

  return (
    <>
      <AnnouncementBar />
      <LuxuryNavbar />
      <main id="main" className="bg-night px-5 py-24 md:px-8 md:py-32">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">Terms &amp; Conditions</h1>
          <p className="mt-8 leading-relaxed text-muted">
            This page is being finalised. For any questions in the meantime, please{" "}
            <Link to="/#contact" className="text-champagne underline underline-offset-4">contact us</Link>.
          </p>
        </article>
      </main>
      <LuxuryFooter />
    </>
  );
}
