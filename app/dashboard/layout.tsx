import { redirect } from "next/navigation"
import AppSidebar from "@/components/dashboard-sidebar" 
import { getProfile, getUser } from "@/utils/user-data"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Verificar Sesión (Si no hay usuario, al login)
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  // 2. Obtener datos del perfil
  const profile = await getProfile()

  // ---------------------------------------------------------
  // 3. EL FILTRO DE PAGO (PAYWALL) - NUEVO CÓDIGO
  // ---------------------------------------------------------
  // Si el usuario no es PRO (o no tiene perfil aún), 
  // lo expulsamos del Dashboard y lo mandamos a ver los precios.
  if (!profile?.is_pro) {
    redirect("/pricing")
  }

  // 4. Si pasa el filtro (es PRO), le mostramos el Dashboard
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar intacto con tu configuración actual */}
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