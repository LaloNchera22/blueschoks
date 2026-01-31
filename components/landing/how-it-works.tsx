import { Package, Share2, ShoppingBag } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="px-4 py-16 w-full max-w-lg mx-auto">
      <div className="flex flex-col gap-2 mb-10 text-center">
        <h2 className="text-2xl font-bold text-white">Cómo funciona</h2>
        <p className="text-slate-400 text-sm">De la idea a los ingresos en tres simples pasos.</p>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Linea vertical conectora */}
        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/80 via-primary/20 to-transparent z-0"></div>

        {/* Paso 1: Crea */}
        <div className="relative z-10 flex gap-5 items-start group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark border border-primary/30 shadow-[0_0_10px_rgba(13,89,242,0.1)] text-primary">
              <Package className="w-7 h-7" />
            </div>
          </div>
          <div className="pt-2">
            <h3 className="text-lg font-bold text-white mb-1">Crea</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Agrega productos, precios y personaliza tu tienda al instante.</p>
          </div>
        </div>

        {/* Paso 2: Comparte */}
        <div className="relative z-10 flex gap-5 items-start group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark border border-primary/30 shadow-[0_0_10px_rgba(13,89,242,0.1)] text-primary">
              <Share2 className="w-7 h-7" />
            </div>
          </div>
          <div className="pt-2">
            <h3 className="text-lg font-bold text-white mb-1">Comparte</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Envía el link único de tu tienda por WhatsApp, Instagram o donde sea.</p>
          </div>
        </div>

        {/* Paso 3: Vende */}
        <div className="relative z-10 flex gap-5 items-start group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark border border-primary/30 shadow-[0_0_10px_rgba(13,89,242,0.1)] text-primary">
              <ShoppingBag className="w-7 h-7" />
            </div>
          </div>
          <div className="pt-2">
            <h3 className="text-lg font-bold text-white mb-1">Vende</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Recibe pedidos directamente en WhatsApp y gestiónalos desde tu panel.</p>
          </div>
        </div>

      </div>
    </section>
  )
}
