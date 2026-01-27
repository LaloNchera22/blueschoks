"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-3 sm:px-6 py-4 max-w-full mx-auto w-full shrink-0 z-50">
      <div className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tighter">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0F172A] text-white rounded-md flex items-center justify-center text-base sm:text-lg">B</div>
        BLUESHOCKS
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/login" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-[#0F172A] transition-colors whitespace-nowrap">
          Iniciar Sesión
        </Link>
        <Link href="/register">
          <Button className="font-bold rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 h-8 px-2 text-[10px] sm:text-sm sm:h-9 sm:px-5">
            Empezar Gratis
          </Button>
        </Link>
      </div>
    </nav>
  )
}
