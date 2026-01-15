'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // 1. Iniciar sesión en Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Correo o contraseña incorrectos." }
  }

  // 2. Limpiar caché y redirigir al Dashboard
  revalidatePath("/", "layout")
  return redirect("/dashboard")
}