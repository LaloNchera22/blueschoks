import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Oferta Especial - BlueShocks Pro",
  description: "Crea tu catálogo profesional y deja de saturar a tus clientes. Oferta exclusiva: 1er mes por solo $49 MXN.",
}

export default function PromoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100">

      {/* Simplified Header - Logo Only */}
      <header className="flex items-center justify-center py-6 px-4 w-full border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#0F172A] text-white rounded-md flex items-center justify-center text-lg">B</div>
          BLUESHOCKS
        </Link>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12 sm:py-20 text-center">
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 shadow-sm">
            <span>✨ Cupón MITIENDA aplicado automáticamente</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-5xl font-black tracking-tighter text-[#0F172A] mb-6 leading-[1.1] max-w-3xl">
            Vender por internet no debería ser deporte de contacto.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed mx-auto font-medium">
            Obtén tu catálogo profesional y deja de saturar a tus clientes. <br className="hidden sm:block"/>
            <span className="text-slate-900 font-bold">Oferta exclusiva: 1er mes por solo $49 MXN.</span>
          </p>

          {/* Pricing Display */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-slate-400 line-through text-lg font-medium">$199 MXN</span>
            <span className="text-3xl font-black text-[#0F172A]">$49 MXN</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">AHORRAS 75%</span>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-lg bg-[#0F172A] text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all"
          >
            <Link href="/register?coupon=MITIENDA">
              Canjear Oferta de $49 MXN
            </Link>
          </Button>

          <p className="text-xs text-slate-400 mt-4 font-medium">
            Oferta válida solo para nuevos usuarios. Cancelación en cualquier momento.
          </p>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100 mt-auto">
        <p>© {new Date().getFullYear()} BlueShocks. Todos los derechos reservados.</p>
      </footer>

    </div>
  )
}
