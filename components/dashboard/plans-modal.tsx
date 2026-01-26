"use client"

import { Check, Crown, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PlansModalProps {
  isOpen: boolean
  onClose: () => void
  isPro: boolean
  expirationDate?: string | null
}

export function PlansModal({ isOpen, onClose, isPro, expirationDate }: PlansModalProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0 bg-transparent border-none shadow-none">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-center text-slate-900">
              Elige el plan ideal para tu negocio
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 w-full">
            {/* FREE PLAN COLUMN */}
            <div className="p-8 border-r border-slate-100 flex flex-col relative bg-slate-50/50">
            {!isPro && (
              <div className="absolute top-4 right-4">
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tu Plan Actual
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Gratuito</h3>
              <p className="text-slate-500 text-sm">Todo lo necesario para empezar a vender.</p>
            </div>

            <div className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
              $0 <span className="text-base font-normal text-slate-400">/mes</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {[
                "1 Tienda Personalizada",
                "Hasta 3 Productos",
                "Pagos con Stripe (5% comisión)",
                "Diseños Básicos",
                "Soporte por Email"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-slate-600" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-auto">
               {/* Spacer or Button if needed, currently just display */}
            </div>
          </div>

            {/* PRO PLAN COLUMN */}
            <div className="p-8 bg-slate-900 text-white relative flex flex-col overflow-hidden">
            {/* Background Gradient/Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {isPro && expirationDate && (
               <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                 <p className="text-[10px] text-amber-200 font-medium">
                   Vence: {formatDate(expirationDate)}
                 </p>
               </div>
            )}

            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Crown size={14} /> Recomendado
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Plan PRO</h3>
              <p className="text-slate-400 text-sm">Potencia tu negocio sin límites.</p>
            </div>

            <div className="text-3xl font-black text-white mb-8 tracking-tight relative z-10">
              $199 <span className="text-base font-normal text-slate-500">/mes</span>
            </div>

            <div className="space-y-4 mb-8 flex-1 relative z-10">
              {[
                "Productos Ilimitados",
                "0% Comisiones de Plataforma",
                "Diseños Premium & Personalización Total",
                "Dominio Personalizado",
                "Soporte Prioritario 24/7",
                "Analíticas Avanzadas"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-slate-900 font-bold" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-auto relative z-10">
               {!isPro && (
                 <a
                   href="/dashboard/pricing"
                   className="block w-full py-3 bg-amber-500 text-slate-900 font-bold text-center rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                 >
                   Actualizar a PRO
                 </a>
               )}
               {isPro && (
                 <div className="w-full py-3 bg-slate-800 text-slate-400 font-medium text-center rounded-xl border border-slate-700">
                   Plan Activo
                 </div>
               )}
            </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
