import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Brands } from "@/components/landing/brands"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { PreviewSection } from "@/components/landing/preview-section"
import { StickyCTA } from "@/components/landing/sticky-cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-sans text-white overflow-x-hidden selection:bg-primary/30">
      <Navbar />
      <main className="relative flex flex-col w-full mx-auto min-h-screen bg-background-dark pt-20 pb-20">
        <Hero />
        <Brands />
        <HowItWorks />
        <Features />
        <PreviewSection />
      </main>
      <StickyCTA />
    </div>
  )
}
