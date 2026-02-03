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

  // 1. Generación y Limpieza del Slug
  // Si no hay slug explícito, lo generamos desde el nombre de la tienda
  const rawSlug = slugRaw || shopName
  const username = rawSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  // 2. Creación del usuario con metadatos
  // Pasamos los datos extra en options.data para que el Trigger de Supabase capture first_name, last_name, etc.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        shop_name: shopName,
        username: username,
        whatsapp: phone // ¡Importante no perder este dato!
      }
    },
  })

  // 3. Manejo de errores
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
