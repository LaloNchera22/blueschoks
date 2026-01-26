"use client"

import { useState } from "react"
import AppSidebar from "@/components/dashboard-sidebar"
import { StickyHeader } from "@/components/dashboard/sticky-header"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  shopUrl: string
  userEmail: string
  isPro: boolean
}

export default function DashboardLayoutClient({
  children,
  shopUrl,
  userEmail,
  isPro,
}: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar
        shopUrl={shopUrl}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        isPro={isPro}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto h-full relative flex flex-col transition-all duration-300">
        <StickyHeader isSidebarOpen={isSidebarOpen} onOpen={() => setIsSidebarOpen(true)} />

        {children}
      </main>
    </div>
  )
}
