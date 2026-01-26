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

  // ❌ HE BORRADO EL BLOQUE QUE DECÍA: if (!profile?.is_pro) redirect("/pricing")
  // Ahora los usuarios gratuitos PUEDEN entrar.

  return (
    <DashboardLayoutClient
       shopUrl={profile?.slug || ""}
       userEmail={user.email || ""}
       isPro={profile?.is_pro ?? false}
       subscriptionEnd={profile?.subscription_end_date ?? null}
    >
       {children}
    </DashboardLayoutClient>
  )
}