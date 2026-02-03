"use server"

import { createClient } from "@/utils/supabase/server"
import { DesignConfig } from "@/lib/types/design-system"
import { ThemeConfig } from "@/lib/types/theme-config"
import { revalidatePath, revalidateTag } from "next/cache"

export async function saveDesignConfig(config: DesignConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  try {
    const { data: store } = await supabase
      .from('stores')
      .select('slug')
      .eq('owner_id', user.id)
      .single()

    const { error } = await supabase
      .from('stores')
      .update({
        config: config,
        updated_at: new Date().toISOString()
      })
      .eq('owner_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'page')

    if (store?.slug) {
      // ⚡ LA CLAVE: Limpiar caché de TODAS las rutas posibles
      revalidatePath(`/${store.slug}`)       // Limpia la tienda específica
      revalidatePath('/[slug]', 'page')        // Limpia la ruta dinámica
    }

    // Force global revalidation to ensure stale data is purged
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    console.error('Error saving design config:', error)
    return { success: false, error }
  }
}

export async function saveThemeConfig(config: ThemeConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  try {
    // Get slug for revalidation
    const { data: store } = await supabase
      .from('stores')
      .select('slug')
      .eq('owner_id', user.id)
      .single()

    const { error } = await supabase
      .from('stores')
      .update({
        config: config, // Assuming theme_config maps to config in the new schema, or we should leave it broken if not used.
        // But to be safe, if this is called, it likely intends to save visual config.
        updated_at: new Date().toISOString()
      })
      .eq('owner_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'layout')

    if (store?.slug) {
      // Revalidate the specific shop page
      revalidatePath(`/${store.slug}`, 'layout')
      // Invalidate the shop data cache
      // revalidateTag(`shop:${store.slug}`, 'max')
    }

    // Force global revalidation to ensure stale data is purged
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    console.error('Error saving theme config:', error)
    return { success: false, error }
  }
}
