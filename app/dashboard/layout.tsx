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
       shopUrl={profile?.username || ""} 
       userEmail={user.email || ""}
       isPro={profile?.is_pro ?? false}
       // 👇 CORRECCIÓN AQUÍ: Agregamos "(profile as any)" para evitar el error de TypeScript
       subscriptionEnd={(profile as any)?.subscription_end_date ?? null}
    >
       {children}
    </DashboardLayoutClient>
  )
}