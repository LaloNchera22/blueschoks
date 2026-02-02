import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="h-full flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-y-auto overflow-x-hidden lg:h-screen lg:overflow-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center lg:justify-evenly">
        <Hero />
        <div className="w-full">
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  )
}
