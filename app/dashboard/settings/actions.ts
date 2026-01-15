'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
  shopName: z.string().optional(),
  slug: z.string().optional(),
  countryCode: z.string().optional(),
  localPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export type SettingsState = {
  message?: string | null
  error?: string | null
  success?: boolean
}

export async function updateSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: "No autorizado" }

  const rawData = {
    shopName: formData.get("shopName") as string,
    slug: formData.get("slug") as string,
    countryCode: formData.get("countryCode") as string,
    localPhone: formData.get("localPhone") as string,
    email: formData.get("email") as string,
  }

  const validated = settingsSchema.safeParse(rawData)

  if (!validated.success) {
    return { error: "Datos inválidos. Revisa el formato." }
  }

  const { shopName, slug: rawSlug, countryCode, localPhone, email } = validated.data

  const updates: any = {
    updated_at: new Date().toISOString(),
  }

  // Solo actualizamos si el valor no está vacío.
  // Esto permite actualizaciones parciales:
  // Si el usuario edita solo el nombre, el slug puede venir vacío (si no se ha configurado antes)
  // y lo ignoramos en lugar de intentar guardar "".

  if (shopName && shopName.trim() !== "") {
    updates.shop_name = shopName.trim()
  }

  if (rawSlug && rawSlug.trim() !== "") {
    updates.slug = rawSlug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  }

  if (countryCode && localPhone && localPhone.trim() !== "") {
    updates.whatsapp = (countryCode.replace('+', '') + localPhone).trim()
  }

  try {
    // Solo hacemos update si hay algo más que updated_at
    if (Object.keys(updates).length > 1) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (updateError) {
        if (updateError.code === '23505') return { error: "Este Link ya está ocupado. Elige otro." }
        throw updateError
      }
    }

    // UPDATE EMAIL
    if (email && email.trim() !== "" && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: email })
        if (emailError) {
             return { error: "Error al actualizar correo: " + emailError.message }
        }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")
    if (updates.slug) {
        revalidatePath(`/shop/${updates.slug}`)
    }

    return { success: true, message: "Cambios guardados correctamente." }

  } catch (err) {
    console.error(err)
    return { error: "Error al guardar cambios." }
  }
}
