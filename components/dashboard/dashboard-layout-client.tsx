"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import AppSidebar from "@/components/dashboard-sidebar"
import { StickyHeader } from "@/components/dashboard/sticky-header"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()
  const isDesignPage = pathname?.startsWith("/dashboard/design")

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden">
      <AppSidebar
        shopUrl={shopUrl}
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        isPro={isPro}
        subscriptionEnd={subscriptionEnd}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={cn(
          "flex-1 h-full relative flex flex-col transition-all duration-300",
          isDesignPage ? "overflow-hidden" : "overflow-y-auto"
        )}
      >
        <StickyHeader isSidebarOpen={isSidebarOpen} onOpen={() => setIsSidebarOpen(true)} />

        {children}
      </main>
    </div>
  )
}
