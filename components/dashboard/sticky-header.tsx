"use client"

import { PanelLeftOpen } from "lucide-react"

interface StickyHeaderProps {
  isSidebarOpen: boolean
  onOpen: () => void
}

export function StickyHeader({ isSidebarOpen, onOpen }: StickyHeaderProps) {
  return (
    <div className={`
        fixed top-0 left-0 w-full h-16 bg-white z-40 border-b border-slate-200 flex items-center px-4 shadow-sm
        md:absolute md:top-4 md:left-4 md:w-auto md:h-auto md:bg-transparent md:border-none md:shadow-none md:p-0
        transition-all duration-300
        ${!isSidebarOpen ? "md:opacity-100 md:pointer-events-auto" : "md:opacity-0 md:pointer-events-none"}
    `}>
      <button
        onClick={onOpen}
        suppressHydrationWarning={true}
        className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        title="Abrir menú"
      >
        <PanelLeftOpen size={20} />
      </button>

      {/* Texto opcional para móvil */}
      <span className="ml-3 font-bold text-slate-800 md:hidden">Menu</span>
    </div>
  )
}
