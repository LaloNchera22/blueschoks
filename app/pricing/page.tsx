import { Check, ArrowRight } from "lucide-react"; // Agregamos ArrowRight
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Elige tu Plan</h1>
        <p className="text-slate-600">Desbloquea tu tienda y empieza a vender hoy mismo.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Plan Mensual */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Mensual</h3>
          <div className="text-4xl font-bold mt-4 mb-6">$99 <span className="text-sm font-normal text-slate-500">/mes</span></div>
          <ul className="space-y-3 mb-8 text-slate-600">
            <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> Tienda en línea completa</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> Productos ilimitados</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-green-500" /> Panel de administración</li>
          </ul>
          <button className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition">
            Elegir Mensual
          </button>
        </div>

        {/* Plan Anual (Destacado) */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">MÁS POPULAR</div>
          <h3 className="text-xl font-semibold text-indigo-600">Anual</h3>
          <div className="text-4xl font-bold mt-4 mb-6">$699 <span className="text-sm font-normal text-slate-500">/año</span></div>
          <p className="text-sm text-green-600 font-medium mb-6">Ahorras 2 meses</p>
          <ul className="space-y-3 mb-8 text-slate-600">
            <li className="flex gap-2"><Check className="w-5 h-5 text-indigo-600" /> Todo lo del plan mensual</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-indigo-600" /> Dominio personalizado</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-indigo-600" /> Soporte prioritario</li>
          </ul>
          <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
            Elegir Anual
          </button>
        </div>

        {/* Plan Lifetime */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-white">
          <h3 className="text-xl font-semibold text-white">De por vida</h3>
          <div className="text-4xl font-bold mt-4 mb-6">$1,999 <span className="text-sm font-normal text-slate-400">/único</span></div>
          <p className="text-sm text-slate-400 mb-6">Pago único, acceso para siempre</p>
          <ul className="space-y-3 mb-8 text-slate-300">
            <li className="flex gap-2"><Check className="w-5 h-5 text-white" /> Acceso de por vida</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-white" /> Sin pagos recurrentes</li>
            <li className="flex gap-2"><Check className="w-5 h-5 text-white" /> Actualizaciones futuras</li>
          </ul>
          <button className="w-full py-3 px-4 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-100 transition">
            Elegir Lifetime
          </button>
        </div>
      </div>
      
      {/* --- BOTÓN NUEVO: CONTINUAR GRATIS --- */}
      <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Link 
          href="/dashboard" 
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          Continuar con Plan Gratuito
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-xs text-slate-400 mt-2">Funciones limitadas · 5% de comisión por venta</p>
      </div>

    </div>
  )
}