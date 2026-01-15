import { getProfile } from "@/utils/user-data"
import { Check, Star, Zap, Infinity as InfinityIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function SubscriptionPage() {
  const profile = await getProfile()

  if (profile?.is_pro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-full shadow-lg">
            <Star className="w-12 h-12 text-yellow-700 fill-yellow-700" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">¡Eres PRO!</h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto">
              Tienes acceso ilimitado a todas las funciones premium. Gracias por tu apoyo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto space-y-12 pb-20">

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Desbloquea todo el potencial
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a ti y lleva tu tienda al siguiente nivel.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">

        {/* MONTHLY */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-500 mb-4">Mensual</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$99</span>
                <span className="text-slate-500 font-medium">MXN/mes</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 min-h-[40px]">
                Ideal para empezar y probar todas las funciones sin compromiso.
            </p>
            <Button className="w-full mb-8 font-bold" variant="outline">
                Elegir Mensual
            </Button>
            <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Todo incluido</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Cancela cuando quieras</li>
            </ul>
        </div>

        {/* ANNUAL */}
        <div className="border-2 border-slate-900 rounded-2xl p-8 bg-white shadow-xl relative md:scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
                Más Popular
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                Anual <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$699</span>
                <span className="text-slate-500 font-medium">MXN/año</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 min-h-[40px]">
                Ahorra 40% comparado con el plan mensual. El favorito de los emprendedores.
            </p>
            <Button className="w-full mb-8 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11">
                Elegir Anual
            </Button>
            <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> <strong>Ahorras $489 MXN</strong></li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Todo incluido</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Soporte prioritario</li>
            </ul>
        </div>

        {/* LIFETIME */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-500 mb-4">Lifetime</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$1999</span>
                <span className="text-slate-500 font-medium">MXN</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 min-h-[40px]">
                Pago único. Acceso de por vida a todas las actualizaciones futuras.
            </p>
            <Button className="w-full mb-8 font-bold" variant="outline">
                Elegir Lifetime
            </Button>
             <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Sin mensualidades</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Acceso de por vida</li>
                <li className="flex gap-3"><InfinityIcon className="w-5 h-5 text-purple-500 shrink-0" /> Futuras Actualizaciones</li>
            </ul>
        </div>

      </div>
    </div>
  )
}
