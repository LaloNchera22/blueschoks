import { createClient } from "@/utils/supabase/server"
import { DEFAULT_THEME_CONFIG, ThemeConfig } from "@/lib/types/theme-config"
import DesignClient from "@/components/dashboard/design/design-client"
import { redirect } from "next/navigation"

// Define SAFE_DEFAULTS with the required structure
const SAFE_DEFAULTS = DEFAULT_THEME_CONFIG;

export default async function DesignPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
     return <div>Perfil no encontrado</div>
  }

  const isPro = profile.is_pro || false

  // 1. Get raw config from profile or empty object
  let rawConfig: Partial<ThemeConfig> = profile.theme_config || {};

  // 2. Legacy Migration Support:
  // If rawConfig is empty, attempt to populate it from legacy columns
  // so we don't lose the user's previous design settings.
  if (Object.keys(rawConfig).length === 0) {
      const legacyFont = (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim();

      rawConfig = {
          global: {
              backgroundValue: profile.design_bg_color
          },
          header: {
              title: {
                  color: profile.design_title_color,
                  fontFamily: legacyFont
              },
              subtitle: {
                  fontFamily: legacyFont
              }
          }
      } as Partial<ThemeConfig>;
  }

  // 3. Fail-Safe Deep Merge Strategy
  // We explicitly merge nested objects to ensure no property is missing or null.
  const safeConfig: ThemeConfig = {
    ...SAFE_DEFAULTS,
    ...rawConfig,

    header: {
      ...SAFE_DEFAULTS.header,
      ...(rawConfig.header || {}),
      // Deep merge for title to ensure font/color/size/bold exist
      title: {
        ...SAFE_DEFAULTS.header.title,
        ...(rawConfig.header?.title || {})
      },
      // Deep merge for subtitle
      subtitle: {
        ...SAFE_DEFAULTS.header.subtitle,
        ...(rawConfig.header?.subtitle || {})
      },
      // Deep merge for bio
      bio: {
        ...SAFE_DEFAULTS.header.bio,
        ...(rawConfig.header?.bio || {})
      },
      // Ensure socialLinks is always an array
      socialLinks: Array.isArray(rawConfig.header?.socialLinks)
        ? rawConfig.header!.socialLinks
        : SAFE_DEFAULTS.header.socialLinks
    },

    cards: {
      ...SAFE_DEFAULTS.cards,
      ...(rawConfig.cards || {}),
      productTitle: {
        ...SAFE_DEFAULTS.cards.productTitle,
        ...(rawConfig.cards?.productTitle || {})
      },
      productPrice: {
        ...SAFE_DEFAULTS.cards.productPrice,
        ...(rawConfig.cards?.productPrice || {})
      },
      quantitySelector: {
        ...SAFE_DEFAULTS.cards.quantitySelector,
        ...(rawConfig.cards?.quantitySelector || {})
      },
      addButton: {
        ...SAFE_DEFAULTS.cards.addButton,
        ...(rawConfig.cards?.addButton || {})
      }
    },

    global: {
      ...SAFE_DEFAULTS.global,
      ...(rawConfig.global || {})
    }
  };

  const { data: products } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)

  return (
    <DesignClient
      initialShopData={profile}
      initialProducts={products || []}
      initialThemeConfig={safeConfig}
      isPro={isPro}
    />
  )
}
