'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveDesignAction(formData: any, themeConfig: any) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('No autorizado');
  }

  // --- SANITIZATION ---
  // Ensure backgroundImage is a valid string URL or null.
  if (themeConfig.backgroundImage && (typeof themeConfig.backgroundImage !== 'string' || !themeConfig.backgroundImage.startsWith('http'))) {
    themeConfig.backgroundImage = undefined;
  }

  // Ensure borderRadius is safe
  if (themeConfig.cardStyle) {
    const r = themeConfig.cardStyle.borderRadius;
    if (typeof r !== 'number' && typeof r !== 'string') {
        themeConfig.cardStyle.borderRadius = 16;
    }
  }

  const updateData: any = {
      theme_config: themeConfig,
      updated_at: new Date().toISOString()
  };

  // Update shop_name if present in the config
  if (themeConfig.profile?.shopName) {
      updateData.shop_name = themeConfig.profile.shopName;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id);

  if (error) throw error;

  return { success: true };
}
