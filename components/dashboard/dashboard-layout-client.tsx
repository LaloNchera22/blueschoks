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
        {/* Open Button - Visible only when closed */}
        <div className={`
            absolute top-4 left-4 z-50 transition-opacity duration-300
            ${!isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Abrir menú"
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}
