"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Link as LinkIcon } from "lucide-react"

export function HeroUrlClaimer() {
  const [shopName, setShopName] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopName) return
    // Redirige al registro pasando el nombre de la tienda como parámetro
    router.push(`/register?shop=${encodeURIComponent(shopName)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      <div className="w-full p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl flex items-center group focus-within:border-primary/50 transition-colors">
        <div className="pl-4 text-slate-500 group-focus-within:text-primary transition-colors">
          <LinkIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value.replace(/\s+/g, '').toLowerCase())}
          placeholder="tunombre.store/..."
          className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-slate-500 text-sm py-3 px-3 outline-none"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(13,89,242,0.4)] transition-all whitespace-nowrap"
        >
          Crear
        </button>
      </div>
    </form>
  )
}
