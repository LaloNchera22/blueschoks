import { redirect } from "next/navigation"
import AppSidebar from "@/components/dashboard-sidebar" 
import { getProfile, getUser } from "@/utils/user-data"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Verificar Sesión
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  // 2. Obtener datos
  const profile = await getProfile()

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Pasamos el slug Y EL EMAIL del usuario */}
      <AppSidebar 
          shopUrl={profile?.slug || ""} 
          userEmail={user.email || ""} // <--- AQUÍ PASAMOS EL EMAIL
      />

      <main className="flex-1 overflow-y-auto h-full relative">
        {children}
      </main>
      
    </div>
  )
}