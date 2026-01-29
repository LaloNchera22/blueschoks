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

  // Obtenemos el perfil actual para comparar cambios
  // Esto es vital para evitar errores de unicidad si el slug no ha cambiado,
  // y para evitar bloqueos de RLS si intentamos escribir lo mismo.
  const { data: currentStore } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // 1. SHOP NAME
  if (shopName && shopName.trim() !== "") {
    const cleanShopName = shopName.trim()
    if (!currentStore || cleanShopName !== currentStore.shop_name) {
      updates.shop_name = cleanShopName
    }
  }

  // 2. SLUG
  // Relajamos validación: permitimos letras, números y guiones.
  // Solo actualizamos si es diferente al actual.
  if (rawSlug && rawSlug.trim() !== "") {
    const cleanSlug = rawSlug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    if (cleanSlug.length > 0) {
       if (!currentStore || cleanSlug !== currentStore.slug) {
         updates.slug = cleanSlug
       }
    }
  }

  // 3. WHATSAPP
  if (countryCode && localPhone && localPhone.trim() !== "") {
    const cleanPhone = (countryCode.replace('+', '') + localPhone).trim()
    if (!currentStore || cleanPhone !== currentStore.whatsapp) {
      updates.whatsapp = cleanPhone
    }
  }

  try {
    // Solo hacemos update si hay algo más que updated_at
    // OJO: Si solo cambió updated_at, igual podríamos querer guardarlo,
    // pero para eficiencia, si no hay cambios reales de datos, podemos saltar o solo updatear fecha.
    // En este caso, si el objeto updates tiene mas de 1 llave, significa que hubo cambio de datos.

    // Si NO hay currentStore (caso raro), forzamos update.
    const hasDataChanges = Object.keys(updates).length > 1;

    if (hasDataChanges || !currentStore) {
      const { data, error: updateError } = await supabase
        .from("stores")
        .update(updates)
        .eq("owner_id", user.id)
        .select()

      if (updateError) {
        if (updateError.code === '23505') return { error: "Este Link ya está ocupado. Elige otro." }
        throw updateError
      }

      if (!data || data.length === 0) {
        throw new Error("No se encontró la tienda para actualizar")
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

    // Lógica de revalidación de caché (Slug)
    let finalSlug = updates.slug;

    if (!finalSlug) {
        // Si no se actualizó el slug, usamos el actual.
        finalSlug = currentStore?.slug;
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
