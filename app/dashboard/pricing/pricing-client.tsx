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

  // Determine current plan
  let currentPlan = "Free"
  if (isPro) {
    if (subscriptionEnd) {
      currentPlan = "Mensual" // Default assumption for subscription based plans
    } else {
      currentPlan = "Lifetime"
    }
  }

  const renderAction = (planName: string, buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined = "default", customClass?: string) => {
    if (currentPlan === planName) {
       return (
         <div className="w-full py-2 bg-green-100 text-green-700 font-bold text-center rounded-md border border-green-200 uppercase text-xs tracking-wider">
           Tu Plan Actual
         </div>
       )
    }

    // Special styling for Lifetime button if passed
    if (customClass) {
        return (
            <Button className={customClass} onClick={() => handleSubscribe(planName)}>
              Comprar ahora
            </Button>
        )
    }

    return (
      <Button className="w-full" onClick={() => handleSubscribe(planName)} variant={buttonVariant}>
         Suscribirse
      </Button>
    )
  }

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
        <Card className="flex flex-col relative">
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
            {renderAction("Mensual", "outline")}
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
             {renderAction("Anual")}
          </CardFooter>
        </Card>

        {/* Lifetime Plan */}
        <Card className="flex flex-col relative border-2 border-amber-400 bg-amber-50/10 dark:bg-amber-900/10">
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
            {renderAction("Lifetime", undefined, "w-full bg-amber-400 hover:bg-amber-500 text-amber-950")}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
