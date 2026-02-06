'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { DesignConfig } from '@/lib/types/design-system';
import { sanitizeDesign } from '@/utils/design-sanitizer';

export async function getDesignConfigAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado');
  }

  // Use Admin Client to bypass potential RLS issues with specific columns
  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('shop_name, avatar_url, theme_config, design_config')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching design config:', error);
    throw new Error('Error al cargar la configuración de diseño');
  }

  return data;
}

export async function saveDesignConfigAction(config: DesignConfig) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado');
  }

  // --- CRITICAL SANITIZATION START ---
  // We strictly sanitize the incoming config to ensure no junk data or huge payloads
  // pollute the database or cause revalidation crashes.
  const sanitizedConfig = sanitizeDesign(config);

  // Explicit check for background image safety (redundant but safe)
  if (sanitizedConfig.backgroundImage && (typeof sanitizedConfig.backgroundImage !== 'string' || !sanitizedConfig.backgroundImage.startsWith('http'))) {
    console.warn('⚠️ Sanitized invalid backgroundImage:', sanitizedConfig.backgroundImage);
    sanitizedConfig.backgroundImage = undefined;
  }
  // --- CRITICAL SANITIZATION END ---

  // Use Admin Client to bypass potential RLS issues
  const adminSupabase = await createAdminClient();
  const { error } = await adminSupabase
    .from('profiles')
    .update({
      shop_name: sanitizedConfig.profile.shopName,
      theme_config: sanitizedConfig,
      design_config: null,
      background_image: sanitizedConfig.backgroundImage || null,
      avatar_border_color: sanitizedConfig.profile.avatarBorderColor || null
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error saving design config:', error);
    throw new Error('Error al guardar el diseño');
  }

  try {
    revalidatePath('/dashboard/design');
    revalidatePath('/[slug]', 'page');
    revalidatePath('/', 'layout');
  } catch (e) {
    console.warn("⚠️ Error revalidating paths (non-critical):", e);
    // We do NOT throw here, as the save was successful.
  }

  return { success: true };
}
