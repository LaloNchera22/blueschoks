import { HeroUrlClaimer } from "@/components/hero-url-claimer"

export function Hero() {
  return (
    <section className="relative px-4 py-32 flex flex-col items-center text-center overflow-hidden w-full bg-background-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-hero-glow pointer-events-none opacity-80"></div>
      <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-blue-400">v2.0 ya está aquí</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Lanza tu tienda de WhatsApp en <span className="text-primary">30 Segundos</span>.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Sin código. Únete a más de 10,000 emprendedores modernos que venden más rápido que nunca.
        </p>

        {/* Input Component */}
        <div className="w-full mt-4">
            <HeroUrlClaimer />
        </div>

        <p className="text-xs text-slate-500 mt-2">Prueba gratis de 14 días • Sin tarjeta de crédito</p>
      </div>
    </section>
  )
}
