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
    // Obtenemos username (slug) de profiles para la revalidación
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({
        // @ts-ignore: ThemeConfig structure might differ from DesignConfig, casting to any to allow save.
        theme_config: config as any
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'page')

    if (profile?.username) {
      // ⚡ LA CLAVE: Limpiar caché de TODAS las rutas posibles
      revalidatePath(`/${profile.username}`)       // Limpia la tienda específica
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
    // Get username for revalidation
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({
        // @ts-ignore: ThemeConfig structure might differ from DesignConfig, casting to any to allow save.
        theme_config: config as any
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'layout')

    if (profile?.username) {
      // Revalidate the specific shop page
      revalidatePath(`/${profile.username}`, 'layout')
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
