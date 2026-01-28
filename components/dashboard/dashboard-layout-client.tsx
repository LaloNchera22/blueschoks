"use client"

import { useState, useEffect } from "react"
import AppSidebar from "@/components/dashboard-sidebar"
import { StickyHeader } from "@/components/dashboard/sticky-header"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  shopUrl: string
  userEmail: string
  isPro: boolean
  subscriptionEnd: string | null
}

export default function DashboardLayoutClient({
  children,
  shopUrl,
  userEmail,
  isPro,
  subscriptionEnd,
}: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    // Check screen size on mount to close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [])

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar
        shopUrl={shopUrl}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        isPro={isPro}
        subscriptionEnd={subscriptionEnd}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto h-full relative flex flex-col transition-all duration-300 pt-16 md:pt-0">
        <StickyHeader isSidebarOpen={isSidebarOpen} onOpen={() => setIsSidebarOpen(true)} />

        {children}
      </main>
    </div>
  )
}
