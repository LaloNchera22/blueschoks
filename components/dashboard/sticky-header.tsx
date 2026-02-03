"use client"

import { PanelLeftOpen } from "lucide-react"

interface StickyHeaderProps {
  isSidebarOpen: boolean
  onOpen: () => void
}

export function StickyHeader({ isSidebarOpen, onOpen }: StickyHeaderProps) {
  return (
    <div className={`
        sticky top-0 left-0 z-50 w-full h-16 flex items-center px-4 bg-white/95 backdrop-blur border-b border-slate-200/50 transition-opacity duration-300
        md:absolute md:top-4 md:left-4 md:z-50 md:w-auto md:h-auto md:bg-transparent md:border-none md:block md:p-0
        ${!isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    `}>
      <button
        onClick={onOpen}
        suppressHydrationWarning={true}
        className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        title="Abrir menú"
      >
        <PanelLeftOpen size={20} />
      </button>
    </div>
  )
}
