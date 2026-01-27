import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    // Se eliminó 'h-screen' y 'overflow-hidden' para permitir scroll natural.
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
