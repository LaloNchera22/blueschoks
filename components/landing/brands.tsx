import { Gem, Zap, Droplet, Hexagon } from "lucide-react"

export function Brands() {
  return (
    <section className="py-8 border-y border-white/5 bg-surface-dark/50 overflow-hidden w-full">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
        CONFIADO POR MARCAS MODERNAS
      </p>
      <div className="relative flex overflow-x-hidden group w-full">
        <div className="flex gap-12 whitespace-nowrap px-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 w-full justify-center flex-wrap text-white">
          <div className="flex items-center gap-2">
            <Gem className="w-6 h-6" />
            <span className="font-bold text-lg">Luxe</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            <span className="font-bold text-lg">BoltShift</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="w-6 h-6" />
            <span className="font-bold text-lg">Clear</span>
          </div>
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6" />
            <span className="font-bold text-lg">Global</span>
          </div>
        </div>
      </div>
    </section>
  )
}
