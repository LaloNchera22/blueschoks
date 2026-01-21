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
    const { data: profile } = await supabase
      .from('profiles')
      .select('slug')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({
        design_config: config,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'layout')

    if (profile?.slug) {
      // Revalidate the shop page path
      revalidatePath(`/${profile.slug}`, 'layout')
      // Invalidate the shop data cache
      // @ts-expect-error - revalidateTag in this canary version might require 2 args
      revalidateTag(`shop:${profile.slug}`, 'layout')
    }

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('slug')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({
        theme_config: config,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/design', 'layout')

    if (profile?.slug) {
      // Revalidate the specific shop page
      revalidatePath(`/${profile.slug}`, 'layout')
      // Invalidate the shop data cache
      // @ts-expect-error - revalidateTag in this canary version might require 2 args
      revalidateTag(`shop:${profile.slug}`, 'layout')
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving theme config:', error)
    return { success: false, error }
  }
}
