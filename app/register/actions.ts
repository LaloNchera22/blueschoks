"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const shopName = formData.get("shopName") as string
  const phone = formData.get("phone") as string
  const slugRaw = formData.get("slug")?.toString() || ""

  // 1. Limpieza del input
  const username = slugRaw.trim().toLowerCase()

  // 2. Check preventivo
  // Verificamos si el slug ya existe en la tabla profiles antes de intentar crear el usuario
  if (username) {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return redirect("/register?message=Este nombre de tienda ya está ocupado. Por favor intenta con otro.");
    }
  }

  const fullName = `${firstName} ${lastName}`.trim()

  // 3. Creación del usuario con metadatos
  // Pasamos los datos extra en options.data para que el Trigger de Supabase cree el perfil
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        username: username,
        shop_name: shopName,
        whatsapp: phone
      }
    },
  })

  // 4. Manejo de errores (Doble seguridad)
  if (error) {
    // Si el error devuelto contiene el código 23505 (unique_violation)
    if (error.code === '23505' || error.message?.includes('unique')) {
      return redirect("/register?message=Este nombre de tienda ya está ocupado. Por favor intenta con otro.")
    }
    return redirect("/register?message=No se pudo registrar el usuario")
  }

  revalidatePath("/", "layout")
  
  return redirect("/dashboard")
}
