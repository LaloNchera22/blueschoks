import { redirect } from "next/navigation"
import { getProfile, getUser } from "@/utils/user-data"
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  const profile = await getProfile()

  return (
    <DashboardLayoutClient
       // CORRECCIÓN CRÍTICA: Usamos username, que es donde guardamos el link real
       shopUrl={profile?.username || ""} 
       userEmail={user.email || ""}
       isPro={profile?.is_pro ?? false}
       subscriptionEnd={profile?.subscription_end_date ?? null}
    >
       {children}
    </DashboardLayoutClient>
  )
}