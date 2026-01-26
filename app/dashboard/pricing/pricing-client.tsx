"use client"

import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingClientProps {
  isPro: boolean
  subscriptionEnd: string | null
}

export default function PricingClient({ isPro, subscriptionEnd }: PricingClientProps) {
  const handleSubscribe = (plan: string) => {
    console.log(`Subscribing to plan: ${plan}`)
    alert(`Has seleccionado el plan: ${plan}`)
  }

  // Logic to determine current plan
  // If isPro is true but no expiration date, it's likely Lifetime.
  // If isPro is true and has expiration date, we assume Monthly (or Annual, but defaulting to Monthly for UI match if not specified).
  const isLifetime = isPro && !subscriptionEnd
  const isMonthly = isPro && !!subscriptionEnd
  // We don't have enough info to strictly distinguish Annual from Monthly without 'interval' data,
  // so we'll treat subscription as Monthly for the visual badge unless we add more logic later.

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Elige el plan perfecto para tu negocio
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Desbloquea todo el potencial de tu tienda con nuestras opciones de suscripción flexibles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Monthly Plan */}
        <Card className={`flex flex-col relative ${isMonthly ? "ring-2 ring-primary ring-offset-2" : ""}`}>
          <CardHeader>
            <CardTitle className="text-xl">Mensual</CardTitle>
            <CardDescription>Ideal para empezar</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="space-y-3">
              {[
                "Productos ilimitados",
                "Personalización básica",
                "Soporte por email",
                "Analíticas básicas"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {isMonthly ? (
               <Button className="w-full bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 cursor-default opacity-100" disabled>
                 Tu Plan Actual
               </Button>
            ) : (
               <Button
                 className="w-full"
                 variant="outline"
                 onClick={() => handleSubscribe("Mensual")}
                 disabled={isPro} // Disable if already pro (even if lifetime)
               >
                 {isPro ? "Incluido" : "Suscribirse"}
               </Button>
            )}
          </CardFooter>
        </Card>

        {/* Annual Plan */}
        <Card className="flex flex-col relative border-primary shadow-lg scale-105 z-10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary hover:bg-primary">Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Anual</CardTitle>
            <CardDescription>Ahorra con facturación anual</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6">
              <span className="text-4xl font-bold">$599</span>
              <span className="text-muted-foreground">/año</span>
            </div>
            <ul className="space-y-3">
              {[
                "Todo lo del plan Mensual",
                "Personalización total",
                "Prioridad en soporte",
                "Analíticas avanzadas",
                "Dominio personalizado"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {/* Note: We don't have an isAnnual check yet, so this button is standard unless we treat isMonthly as generic Subscription */}
             <Button
               className="w-full"
               onClick={() => handleSubscribe("Anual")}
               disabled={isPro}
             >
               {isPro ? "Incluido" : "Suscribirse"}
             </Button>
          </CardFooter>
        </Card>

        {/* Lifetime Plan */}
        <Card className={`flex flex-col relative border-2 border-amber-400 bg-amber-50/10 dark:bg-amber-900/10 ${isLifetime ? "ring-2 ring-amber-500 ring-offset-2" : ""}`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-500 border-none">Mejor Valor</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">De por vida</CardTitle>
            <CardDescription>Un solo pago, acceso para siempre</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6">
              <span className="text-4xl font-bold">$1999</span>
              <span className="text-muted-foreground">/único</span>
            </div>
            <ul className="space-y-3">
              {[
                "Acceso de por vida",
                "Sin cuotas mensuales",
                "Todas las funciones futuras",
                "Soporte VIP directo",
                "Badge de Fundador"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {isLifetime ? (
               <Button className="w-full bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200 cursor-default opacity-100" disabled>
                 Tu Plan Actual
               </Button>
            ) : (
               <Button
                 className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950"
                 onClick={() => handleSubscribe("Lifetime")}
                 disabled={isPro}
               >
                 {isPro ? "Ya eres PRO" : "Comprar ahora"}
               </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
