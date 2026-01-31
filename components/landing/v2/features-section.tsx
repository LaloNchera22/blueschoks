import { BarChart, CreditCard, Package, Globe, TrendingUp, Wallet, LayoutGrid, Earth } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="px-4 pb-20 w-full">
        <h2 className="text-2xl font-bold text-white mb-8 text-center font-display">Todo lo que necesitas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Analytics */}
            <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-24 h-24 text-primary" />
                </div>
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <BarChart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Panel de Analíticas</h3>
                <p className="text-slate-400 text-sm">Rastrea visitas, ventas y productos top en tiempo real.</p>
            </div>

            {/* Payments */}
            <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet className="w-24 h-24 text-primary" />
                </div>
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Pagos Fáciles</h3>
                <p className="text-slate-400 text-sm">Acepta tarjetas, transferencias y pagos locales al instante.</p>
            </div>

            {/* Inventory */}
            <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <LayoutGrid className="w-24 h-24 text-primary" />
                </div>
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Inventario Inteligente</h3>
                <p className="text-slate-400 text-sm">Actualización automática de stock con cada pedido.</p>
            </div>

            {/* Domain */}
            <div className="group relative p-6 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-colors overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Earth className="w-24 h-24 text-primary" />
                </div>
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Dominio Personalizado</h3>
                <p className="text-slate-400 text-sm">Conecta tu propio dominio para un look profesional.</p>
            </div>
        </div>
    </section>
  )
}
