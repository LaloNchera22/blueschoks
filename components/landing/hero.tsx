import { HeroUrlClaimer } from "@/components/hero-url-claimer"

export function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-4 text-center py-20 lg:py-0">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-8 lg:mb-4 shadow-sm">
          <span>✨ La nueva forma de vender online</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl lg:text-4xl font-black tracking-tighter text-[#0F172A] mb-6 lg:mb-4 leading-[1.1]">
          Tu Tienda Online <br />
          En 30 Segundos.
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-slate-500 max-w-xl mb-10 lg:mb-4 leading-relaxed mx-auto font-medium">
          Crea tu catálogo digital, comparte el link y recibe pedidos directamente en tu WhatsApp. Sin comisiones.
        </p>

        {/* Input Component */}
        <div className="w-full mb-2">
            <HeroUrlClaimer />
        </div>

        <p className="text-xs text-slate-400 mt-3 font-medium mb-10 lg:mb-0">
          Prueba gratis. No se requiere tarjeta de crédito.
        </p>

      </div>
    </section>
  )
}
