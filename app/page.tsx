import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroUrlClaimer } from "@/components/hero-url-claimer"

export default function LandingPage() {
  return (
    // 'h-screen' fuerza la altura exacta de la ventana. 'overflow-hidden' evita el scroll.
    <div className="h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-hidden">
      
      {/* Navbar: Compacta (py-4) para ganar espacio */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full shrink-0 z-50">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="w-8 h-8 bg-[#0F172A] text-white rounded-md flex items-center justify-center text-lg">B</div>
          BLUESHOCKS
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#0F172A] transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/register">
            <Button className="font-bold rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 h-9 px-5 text-sm">
              Empezar Gratis
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content: Centrado verticalmente con flex-1 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto w-full">
        
        {/* Contenedor central */}
        <div className="flex flex-col items-center w-full transform -translate-y-4"> {/* Pequeño ajuste visual hacia arriba */}

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-5 shadow-sm">
              <span>✨ La nueva forma de vender online</span>
            </div>

            {/* Título: Tamaños ajustados para no comerse toda la pantalla en laptops */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#0F172A] mb-4 leading-[1.05]">
              Tu Tienda Online <br />
              En 30 Segundos.
            </h1>

            {/* Subtítulo */}
            <p className="text-base md:text-lg text-slate-500 max-w-xl mb-8 leading-relaxed mx-auto font-medium">
              Crea tu catálogo digital, comparte el link y recibe pedidos directamente en tu WhatsApp. Sin comisiones.
            </p>

            {/* Input Component */}
            <div className="w-full mb-2">
                <HeroUrlClaimer />
            </div>

            <p className="text-xs text-slate-400 mt-3 font-medium mb-10">
              Prueba gratis. No se requiere tarjeta de crédito.
            </p>

            {/* Grid Benefits: Versión Compacta Horizontal */}
            <div className="grid md:grid-cols-3 gap-4 w-full text-left max-w-5xl">
                {/* Card 1 */}
                <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Súper Rápido</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-snug">Sube productos desde tu celular en segundos. Optimizado para velocidad.</p>
                </div>
                
                {/* Card 2 */}
                <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Sin Comisiones</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-snug">Tus ganancias son 100% tuyas. No cobramos comisiones ocultas.</p>
                </div>

                {/* Card 3 */}
                <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Pagos Flexibles</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-snug">Acuerda el pago directo con tu cliente vía WhatsApp o efectivo.</p>
                </div>
            </div>

        </div>

      </main>

      {/* Footer minimalista pegado al fondo */}
      <footer className="py-3 text-center text-[10px] sm:text-xs font-medium text-slate-400 border-t border-slate-100 bg-white shrink-0">
         © 2026 BlueShocks Inc.
      </footer>
    </div>
  )
}