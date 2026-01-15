'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// Definimos el estado de retorno
export type State = {
  error?: string | null
  message?: string | null
}

export async function completeOnboarding(prevState: State, formData: FormData): Promise<State> {
  console.log("--> INICIANDO ONBOARDING SERVER ACTION") // Log para depurar

  const supabase = await createClient()

  // 1. Obtener usuario
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.log("Error: Usuario no autenticado")
    return redirect("/login")
  }

  // 2. Obtener datos
  const storeName = formData.get("storeName") as string
  const rawSlug = formData.get("slug") as string

  console.log("Datos recibidos:", { storeName, rawSlug })

  if (!storeName || !rawSlug) {
    return { error: "Por favor llena todos los campos." }
  }

  // 3. Limpiar Slug
  const cleanSlug = rawSlug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (cleanSlug.length < 3) {
    return { error: "El link es muy corto (mínimo 3 letras)." }
  }

  // 4. GUARDAR EN SUPABASE
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      store_name: storeName,
      slug: cleanSlug,
    })
    .eq("id", user.id)

  if (updateError) {
    console.error("ERROR SUPABASE:", updateError) // Mira esto en tu terminal si falla
    if (updateError.code === '23505') {
       return { error: "Ese link ya existe. Prueba con otro." }
    }
    return { error: "Error al guardar en la base de datos." }
  }

  console.log("--> EXITO: Datos guardados. Redirigiendo...")
  
  // 5. Redirección exitosa
  return redirect("/dashboard")
}