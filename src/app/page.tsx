import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PitchBanner } from "@/components/layout/PitchBanner";
import { CatalogSection } from "@/components/sections/CatalogSection";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { SimulatorSection } from "@/components/sections/SimulatorSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { SimulatorBridge } from "@/components/simulator/SimulatorBridge";
import { getGoogleReviews } from "@/lib/google-reviews";

export default async function Home() {
  const google = await getGoogleReviews();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-gold-500 px-4 py-2 font-semibold text-ink-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <PitchBanner />
      <Header />
      <SimulatorBridge>
        <main id="conteudo">
          <Hero />
          <SimulatorSection />
          <CatalogSection />
          <Highlights />
          <SocialProof google={google} />
          <Faq />
          <Contact />
        </main>
      </SimulatorBridge>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
