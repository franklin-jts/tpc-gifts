import { AnnouncementBar } from "@/components/AnnouncementBar";
import { LuxuryNavbar } from "@/components/LuxuryNavbar";
import { CinematicHero } from "@/components/CinematicHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { BrandPhilosophy } from "@/components/BrandPhilosophy";
import { SignatureCollections } from "@/components/SignatureCollections";
import { UnboxingExperience } from "@/components/UnboxingExperience";
import { GiftingOccasions } from "@/components/GiftingOccasions";
import { GiftConcierge } from "@/components/GiftConcierge";
import { GiftingProcess } from "@/components/GiftingProcess";
import { PremiumCTA } from "@/components/PremiumCTA";
import { EnquiryForm } from "@/components/EnquiryForm";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { usePageSeo } from "@/lib/seo";
import { site } from "@/lib/site";

export default function Home() {
  usePageSeo({ title: site.title, description: site.description, canonical: "/" });

  return (
    <>
      <AnnouncementBar />
      <LuxuryNavbar />
      <main id="main">
        <CinematicHero />
        <BrandMarquee />
        <BrandPhilosophy />
        <SignatureCollections />
        <UnboxingExperience />
        <GiftingOccasions />
        <GiftConcierge />
        <GiftingProcess />
        <PremiumCTA />
        <EnquiryForm />
      </main>
      <LuxuryFooter />
    </>
  );
}
