"use client"

import { useState } from "react"
import { PanelLeftOpen } from "lucide-react"
import AppSidebar from "@/components/dashboard-sidebar"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  shopUrl: string
  userEmail: string
}

export default function DashboardLayoutClient({
  children,
  shopUrl,
  userEmail,
}: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar
        shopUrl={shopUrl}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto h-full relative flex flex-col transition-all duration-300">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            title={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <PanelLeftOpen size={20} />
          </button>
        </header>

        {children}
      </main>
    </div>
  )
}
