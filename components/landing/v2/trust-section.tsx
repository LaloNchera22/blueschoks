import { Diamond, Zap, Droplet, Pentagon } from "lucide-react"

export function TrustSection() {
  return (
    <section className="py-8 border-y border-white/5 bg-surface-dark/50 overflow-hidden w-full">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">CONFIADO POR MARCAS MODERNAS</p>
        <div className="relative flex overflow-x-hidden group w-full">
            <div className="flex gap-12 whitespace-nowrap px-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 w-full justify-center flex-wrap">
                <div className="flex items-center gap-2 text-white">
                    <Diamond className="w-5 h-5" />
                    <span className="font-bold text-lg font-display">Luxe</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold text-lg font-display">BoltShift</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                    <Droplet className="w-5 h-5" />
                    <span className="font-bold text-lg font-display">Clear</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                    <Pentagon className="w-5 h-5" />
                    <span className="font-bold text-lg font-display">Global</span>
                </div>
            </div>
        </div>
    </section>
  )
}
