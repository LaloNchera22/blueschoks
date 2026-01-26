'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// ESQUEMA "RELAJADO": Acepta todo como string opcional.
// Ya no validamos .email() ni .min(10) aquí para evitar bloqueos.
const settingsSchema = z.object({
  shopName: z.string().optional(),
  slug: z.string().optional(),
  countryCode: z.string().optional(),
  localPhone: z.string().optional(),
  email: z.string().optional(),
})

export type SettingsState = {
  message?: string | null
  error?: string | null
  success?: boolean
}

export async function updateSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: "Sesión expirada. Recarga la página." }

  // 1. Extracción Segura
  // Convertimos inputs vacíos o nulos en undefined
  const getString = (key: string) => {
    const val = formData.get(key)
    if (!val || typeof val !== 'string') return undefined
    return val.trim() === '' ? undefined : val.trim()
  }

  const rawData = {
    shopName: getString("shopName"),
    slug: getString("slug"), 
    countryCode: getString("countryCode"),
    localPhone: getString("localPhone"),
    email: getString("email"),
  }

  // 2. Validación (Ahora nunca fallará por formato)
  const validated = settingsSchema.safeParse(rawData)
  if (!validated.success) {
    console.error("Error Zod:", validated.error)
    return { error: "Error interno de formato." }
  }

  const { shopName, slug: rawSlug, countryCode, localPhone, email } = validated.data

  // 3. Preparar Updates
  const updates: any = {
    updated_at: new Date().toISOString(),
  }

  // A) Nombre de Tienda
  if (shopName) updates.shop_name = shopName

  // B) Link Personalizado (Slug -> Username)
  if (rawSlug) {
    const cleanLink = rawSlug.toLowerCase()
      .replace(/\s+/g, '-')       // Espacios -> guiones
      .replace(/[^a-z0-9-]/g, '') // Solo caracteres válidos
    
    if (cleanLink.length > 0) {
      updates.username = cleanLink 
    }
  }

  // C) WhatsApp (Limpieza manual)
  if (localPhone) {
    const code = countryCode ? countryCode.replace('+', '') : '52'
    const cleanPhone = (code + localPhone).replace(/\D/g, '') // Quitar letras
    if (cleanPhone.length > 5) {
        updates.whatsapp = cleanPhone
    }
  }

  try {
    // 4. Guardar en Base de Datos
    // Intentamos guardar siempre que haya usuario
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (updateError) {
      console.error("DB Error:", updateError)
      if (updateError.code === '23505') return { error: "Ese Link de tienda ya está en uso." }
      return { error: "Error al guardar. Intenta de nuevo." }
    }

    // 5. Email (Solo si parece un email válido y cambió)
    if (email && email.includes('@') && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: email })
        if (emailError) {
             console.log("Error email:", emailError)
             // No retornamos error fatal, solo aviso
        }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    
    // Revalidar tienda pública si cambió el link
    if (updates.username) {
        revalidatePath(`/${updates.username}`)
    }

    return { success: true, message: "Cambios guardados." }

  } catch (err: any) {
    console.error("Error General:", err)
    return { error: "Ocurrió un error inesperado." }
  }
}