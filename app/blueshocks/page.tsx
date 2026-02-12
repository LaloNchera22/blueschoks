import type { Metadata } from "next"
import { Navbar } from "@/components/blueshocks/navbar"
import { Hero } from "@/components/blueshocks/hero"
import { UnifyFinances } from "@/components/blueshocks/unify-finances"
import { CurrencyMarquee } from "@/components/blueshocks/currency-marquee"
import { Card3DSection } from "@/components/blueshocks/card-3d-section"
import { Footer } from "@/components/blueshocks/footer"

export const metadata: Metadata = {
  title: "BlueShocks Wallet - One app for all needs",
  description: "The financial app for the modern world. Manage, save, and spend with confidence.",
}

export default function BlueShocksLanding() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#ff3b30] selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <UnifyFinances />
      <CurrencyMarquee />
      <Card3DSection />
      <Footer />
    </main>
  )
}
