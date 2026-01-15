"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  // Si tienes un campo de nombre en el formulario, descomenta esto:
  // const fullName = formData.get("fullName") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Esto es importante para que redirija bien tras confirmar el correo
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      // data: { full_name: fullName } // Si guardas datos extra
    },
  })

  if (error) {
    // Si falla, redirige con error (puedes manejarlo mejor en el UI después)
    return redirect("/register?message=No se pudo registrar el usuario")
  }

  revalidatePath("/", "layout")
  
  // Dependiendo de tu config de Supabase, puede que requieras confirmación de email
  // Si NO requiere confirmación inmediata, mándalo al dashboard:
  return redirect("/dashboard")
}