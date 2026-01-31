"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Link as LinkIcon } from "lucide-react"

export function HeroV2() {
  const [shopName, setShopName] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopName) return
    router.push(`/register?shop=${encodeURIComponent(shopName)}`)
  }

  return (
    <section className="relative px-4 py-12 flex flex-col items-center text-center overflow-hidden pt-28 sm:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-hero-glow pointer-events-none opacity-80"></div>
        <div className="relative z-10 flex flex-col gap-6 items-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-medium text-[#60a5fa]">v2.0 ya está aquí</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-display">
                Lanza tu tienda de WhatsApp en <span className="text-primary">30 Segundos</span>.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs mx-auto">
                Sin código. Únete a más de 10,000 emprendedores modernos que venden más rápido que nunca.
            </p>
            <form onSubmit={handleSubmit} className="w-full mt-4 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl flex items-center group/input focus-within:border-primary/50 transition-colors">
                <div className="pl-4 text-slate-500 group-focus-within/input:text-primary transition-colors">
                    <LinkIcon className="text-[20px]" />
                </div>
                <input
                    className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-slate-500 text-sm py-3 px-3 outline-none"
                    placeholder="tunombre.store/..."
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value.replace(/\s+/g, '').toLowerCase())}
                />
                <button type="submit" className="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(13,89,242,0.4)] transition-all whitespace-nowrap">
                    Crear
                </button>
            </form>
            <p className="text-xs text-slate-500 mt-2">Prueba gratis de 14 días • Sin tarjeta de crédito</p>
        </div>
    </section>
  )
}
