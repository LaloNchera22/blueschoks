"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 p-4 bg-background-dark/90 backdrop-blur-lg border-t border-white/5">
        <div className="max-w-lg mx-auto w-full flex gap-3">
            <Link href="/login" className="flex-1">
                <button className="w-full bg-white/10 hover:bg-white/15 text-white font-bold h-12 rounded-xl transition-colors border border-white/10 text-sm sm:text-base">
                    Iniciar Sesión
                </button>
            </Link>
            <Link href="/register" className="flex-[2]">
                <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                    Empezar Prueba Gratis
                    <ArrowRight className="w-5 h-5" />
                </button>
            </Link>
        </div>
    </div>
  )
}
