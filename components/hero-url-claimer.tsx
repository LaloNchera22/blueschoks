"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function HeroUrlClaimer() {
  const [shopName, setShopName] = useState("")
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopName) {
      setError(true)
      return
    }
    // Redirige al registro pasando el nombre de la tienda como parámetro
    router.push(`/register?shop=${encodeURIComponent(shopName)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 mt-8 lg:mt-4"
    >
      {/* Input Container estilo Linktree */}
      <div className={`relative flex-1 w-full group ${error ? "mb-6 sm:mb-0" : ""}`}>
        <div
          className={`flex w-full items-center rounded-lg border-2 ${
            error ? "border-red-500" : "border-slate-200"
          } bg-white px-4 h-14 lg:h-12 transition-all focus-within:border-black focus-within:shadow-md`}
        >
          <span className="text-slate-400 font-medium shrink-0 select-none mr-1">
            blueshocks.com/
          </span>
          <input
            type="text"
            value={shopName}
            onChange={(e) => {
              setShopName(e.target.value.replace(/\s+/g, "").toLowerCase())
              if (error) setError(false)
            }}
            placeholder="tu-marca"
            className="flex-1 border-0 bg-transparent p-0 text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:ring-0 focus:outline-none w-full"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        {error && (
          <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium ml-1">
            Agrega tu subdominio para continuar
          </p>
        )}
      </div>

      {/* Botón Principal (Desktop & Mobile) */}
      <Button
        type="submit"
        className="h-14 lg:h-12 px-8 rounded-lg font-bold text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all w-full sm:w-auto shrink-0"
      >
        Empezar Gratis
      </Button>
    </form>
  )
}
