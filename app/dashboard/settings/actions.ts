'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
  shopName: z.string().optional(),
  slug: z.string().optional(),
  countryCode: z.string().optional(),
  localPhone: z.string().regex(/^\d+$/, "Solo números").min(10, "Mínimo 10 dígitos").optional().or(z.literal('')),
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

  // Helper para extraer string o undefined (evitando null que rompe Zod .optional())
  const getString = (key: string) => {
    const val = formData.get(key)
    return typeof val === 'string' ? val : undefined
  }

  const rawData = {
    shopName: getString("shopName"),
    slug: getString("slug"),
    countryCode: getString("countryCode"),
    localPhone: getString("localPhone"),
    email: getString("email"),
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

    // Si cambio el slug, invalidamos la cache del nuevo y el viejo...
    // pero como no tenemos el viejo facilmente a mano (sin otra query),
    // y el usuario va a ser redirigido al nuevo slug, lo importante es invalidar
    // las tags de los datos.

    // Necesitamos invalidar la tag del slug ACTUAL (que puede ser el nuevo o el viejo).
    // Si el slug cambió, 'updates.slug' tiene el nuevo.
    // Pero si NO cambió, 'updates.slug' no existe.
    // Necesitamos saber el slug final vigente para invalidar su caché de datos.

    // Estrategia: Obtener el slug final.
    let finalSlug = updates.slug;

    if (!finalSlug) {
        // Si no se actualizó el slug, necesitamos el actual de la base de datos.
        // Podríamos hacer una query, o asumir que si no cambió,
        // cualquier cambio en shop_name debe reflejarse en el slug actual.
        const { data: currentProfile } = await supabase.from('profiles').select('slug').eq('id', user.id).single();
        finalSlug = currentProfile?.slug;
    }

    if (finalSlug) {
        revalidatePath(`/${finalSlug}`, 'page')
        revalidateTag(`shop:${finalSlug}`, 'max')
    }

    return { success: true, message: "Cambios guardados correctamente." }

  } catch (err) {
    console.error(err)
    return { error: "Error al guardar cambios." }
  }
}
