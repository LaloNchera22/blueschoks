import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden lg:h-screen lg:overflow-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-6">
        <Hero />
        <div className="w-full lg:h-full lg:flex lg:flex-col lg:justify-center">
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  )
}
