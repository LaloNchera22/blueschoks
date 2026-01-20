import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full shrink-0 z-50">
      <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
        <div className="w-8 h-8 bg-[#0F172A] text-white rounded-md flex items-center justify-center text-lg">B</div>
        BLUESHOCKS
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#0F172A] transition-colors">
          Iniciar Sesión
        </Link>
        <Link href="/register">
          <Button className="font-bold rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 h-9 px-5 text-sm">
            Empezar Gratis
          </Button>
        </Link>
      </div>
    </nav>
  )
}
