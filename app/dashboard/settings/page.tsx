import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import SettingsForm from "./settings-form" // Importamos el formulario nuevo

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Verificar Usuario
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/login")
  }

  // 2. Obtener Datos del Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // 3. Empaquetar datos para el formulario
  const initialData = {
    shop_name: profile?.shop_name || "",
    slug: profile?.slug || "",
    whatsapp: profile?.whatsapp || "",
    email: user.email || ""
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Configuración
        </h1>
        <p className="text-slate-500 mt-1">
            Administra la identidad y contacto de tu tienda.
        </p>
      </div>

      {/* Renderizamos el Formulario Cliente */}
      <SettingsForm initialData={initialData} />

    </div>
  )
}