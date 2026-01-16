import { redirect } from "next/navigation"
import AppSidebar from "@/components/dashboard-sidebar" 
import { getProfile, getUser } from "@/utils/user-data"

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
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar 
          shopUrl={profile?.slug || ""} 
          userEmail={user.email || ""} 
      />
      <main className="flex-1 overflow-y-auto h-full relative">
        {children}
      </main>
    </div>
  )
}