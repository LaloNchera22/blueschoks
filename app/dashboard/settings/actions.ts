'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export type SettingsState = {
  message?: string | null
  error?: string | null
  success?: boolean
}

export async function updateSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: "No autorizado" }

  const shopName = formData.get("shopName") as string
  const rawSlug = formData.get("slug") as string
  
  // LOGICA NUEVA PARA WHATSAPP
  const countryCode = formData.get("countryCode") as string
  const localPhone = formData.get("localPhone") as string
  
  // Unimos el código (+52) con el número (123...) para guardar algo como "52123..."
  // Quitamos el símbolo "+" para que quede limpio en la base de datos
  const whatsapp = (countryCode.replace('+', '') + localPhone).trim()

  const slug = rawSlug?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

  const email = formData.get("email") as string

  if (!shopName || !slug) {
    return { error: "Nombre y Link son obligatorios." }
  }

  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        shop_name: shopName,
        whatsapp: whatsapp,
        slug: slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      if (updateError.code === '23505') return { error: "Este Link ya está ocupado. Elige otro." }
      throw updateError
    }

    // UPDATE EMAIL
    if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: email })
        if (emailError) {
             return { error: "Error al actualizar correo: " + emailError.message }
        }
        // Nota: Si el correo requiere confirmación, Supabase enviará un correo a la nueva dirección.
        // El cambio no se refleja hasta confirmar.
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    revalidatePath(`/shop/${slug}`)

    return { success: true, message: "Cambios guardados correctamente." }

  } catch (err) {
    console.error(err)
    return { error: "Error al guardar cambios." }
  }
}
