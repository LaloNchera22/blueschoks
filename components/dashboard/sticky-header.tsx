"use client"

import { PanelLeftOpen } from "lucide-react"

interface StickyHeaderProps {
  isSidebarOpen: boolean
  onOpen: () => void
}

export function StickyHeader({ isSidebarOpen, onOpen }: StickyHeaderProps) {
  return (
    <div className={`
        absolute top-4 left-4 z-50 transition-opacity duration-300
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
