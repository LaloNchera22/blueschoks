"use server"

import { createClient } from "@/utils/supabase/server"
import { DesignConfig } from "@/lib/types/design-system"
import { ThemeConfig } from "@/lib/types/theme-config"
import { revalidatePath } from "next/cache"

export async function saveDesignConfig(config: DesignConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        design_config: config,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design')
    revalidatePath('/[slug]', 'page') // Revalidate the shop page
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
    const { error } = await supabase
      .from('profiles')
      .update({
        theme_config: config,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design')
    revalidatePath('/[slug]', 'page') // Revalidate the shop page
    return { success: true }
  } catch (error) {
    console.error('Error saving theme config:', error)
    return { success: false, error }
  }
}
