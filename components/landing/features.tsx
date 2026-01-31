import { BarChart3, CreditCard, Boxes, Globe } from "lucide-react"

export function Features() {
  return (
    <section className="px-4 pb-20 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Todo lo que necesitas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Panel de Analíticas */}
        <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Panel de Analíticas</h3>
          <p className="text-slate-400 text-sm">Rastrea visitas, ventas y productos top en tiempo real.</p>
        </div>

        {/* Pagos Fáciles */}
        <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Pagos Fáciles</h3>
          <p className="text-slate-400 text-sm">Acepta tarjetas, transferencias y pagos locales al instante.</p>
        </div>

        {/* Inventario Inteligente */}
        <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Boxes className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
            <Boxes className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Inventario Inteligente</h3>
          <p className="text-slate-400 text-sm">Actualización automática de stock con cada pedido.</p>
        </div>

        {/* Dominio Personalizado */}
        <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Dominio Personalizado</h3>
          <p className="text-slate-400 text-sm">Conecta tu propio dominio para un look profesional.</p>
        </div>
      </div>
    </section>
  )
}
