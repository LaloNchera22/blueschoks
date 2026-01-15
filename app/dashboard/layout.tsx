import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import AppSidebar from "@/components/dashboard-sidebar" 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Verificar Sesión
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/login")
  }

  // 2. Obtener datos
  const { data: profile } = await supabase
    .from("profiles")
    .select("slug")
    .eq("id", user.id)
    .single()

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