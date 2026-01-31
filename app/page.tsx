import { NavbarV2 } from "@/components/landing/v2/navbar-v2"
import { HeroV2 } from "@/components/landing/v2/hero-v2"
import { TrustSection } from "@/components/landing/v2/trust-section"
import { HowItWorksSection } from "@/components/landing/v2/how-it-works-section"
import { FeaturesSection } from "@/components/landing/v2/features-section"
import { AppPreviewSection } from "@/components/landing/v2/app-preview-section"
import { FooterActionBar } from "@/components/landing/v2/footer-action-bar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-dark text-white font-display antialiased overflow-x-hidden selection:bg-primary/30">
      <NavbarV2 />
      <main className="relative flex flex-col w-full max-w-lg mx-auto min-h-screen bg-background-dark pt-0">
        <HeroV2 />
        <TrustSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AppPreviewSection />
      </main>
      <FooterActionBar />
    </div>
  )
}
