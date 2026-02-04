'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { DesignConfig } from '@/lib/types/design-system';

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
    .select('shop_name, avatar_url, theme_config, design_config, background_image, avatar_border_color')
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
  // Ensure backgroundImage is a valid string URL or null.
  if (config.backgroundImage && (typeof config.backgroundImage !== 'string' || !config.backgroundImage.startsWith('http'))) {
    console.warn('⚠️ Sanitized invalid backgroundImage:', config.backgroundImage);
    config.backgroundImage = undefined;
  }

  // Ensure borderRadius is safe
  if (config.cardStyle) {
    const r = config.cardStyle.borderRadius;
    // If it's not a number and not a string, or if it's an object/array, reset it.
    if (typeof r !== 'number' && typeof r !== 'string') {
        console.warn('⚠️ Sanitized invalid borderRadius:', r);
        config.cardStyle.borderRadius = 16;
    }
  }
  // --- CRITICAL SANITIZATION END ---

  // Use Admin Client to bypass potential RLS issues
  const adminSupabase = await createAdminClient();
  const { error } = await adminSupabase
    .from('profiles')
    .update({
      theme_config: config,
      design_config: null,
      background_image: typeof config.backgroundImage === 'string' ? config.backgroundImage : null,
      avatar_border_color: config.profile.avatarBorderColor || null
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error saving design config:', error);
    throw new Error('Error al guardar el diseño');
  }

  revalidatePath('/dashboard/design');
  revalidatePath('/[slug]', 'page');
  revalidatePath('/', 'layout');

  return { success: true };
}
