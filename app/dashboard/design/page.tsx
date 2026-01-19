import { createClient } from "@/utils/supabase/server"
import { DEFAULT_THEME_CONFIG, ThemeConfig } from "@/lib/types/theme-config"
import DesignClient from "@/components/dashboard/design/design-client"
import { redirect } from "next/navigation"

// Define DEFAULT_CONFIG as requested to ensure a robust fallback structure
// This is the source of truth for the default structure if the database returns null
const DEFAULT_CONFIG = DEFAULT_THEME_CONFIG;

export default async function DesignPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile and products
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
     return <div>Perfil no encontrado</div>
  }

  const isPro = profile.is_pro || false

  // LOGIC TO HARDEN NULL VALUES
  // We determine the config to use on the server side to prevent client crashes
  let configToUse: ThemeConfig = DEFAULT_CONFIG;

  if (profile.theme_config && Object.keys(profile.theme_config).length > 0) {
      // Trust the database if it has content
      configToUse = profile.theme_config as ThemeConfig;
  } else {
      // If null or empty, assign DEFAULT_CONFIG immediately (with migration logic if needed)
      // Here we include the migration logic to preserve legacy settings if they exist
      configToUse = {
          ...DEFAULT_CONFIG,
          global: {
              ...DEFAULT_CONFIG.global,
              backgroundValue: profile.design_bg_color || DEFAULT_CONFIG.global.backgroundValue,
          },
          header: {
              ...DEFAULT_CONFIG.header,
              title: {
                  ...DEFAULT_CONFIG.header.title,
                  color: profile.design_title_color || DEFAULT_CONFIG.header.title.color,
                  // Fallback font from legacy `design_font`
                  fontFamily: (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim(),
              },
              subtitle: {
                  ...DEFAULT_CONFIG.header.subtitle,
                  // Assume same font or default
                  fontFamily: (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim(),
              }
          }
      }
  }

  const { data: products } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)

  return (
    <DesignClient
      initialShopData={profile}
      initialProducts={products || []}
      initialThemeConfig={configToUse}
      isPro={isPro}
    />
  )
}
