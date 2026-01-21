import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/utils/supabase/server'
import { DesignConfig } from '@/lib/types/design-system'
import { CartProvider } from '@/components/shop/cart-context'
import StoreClient from './store-client'
import { DEFAULT_DESIGN } from '@/utils/design-sanitizer'

// --- 2. GENERATE METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, design_title_text, design_subtitle_text, avatar_url, theme_config, design_config')
    .eq('slug', slug)
    .single()

  if (!profile) return { title: 'Tienda no encontrada' }

  // Prioritize design_config (new source), fall back to theme_config (legacy)
  const rawConfig = (profile.design_config || profile.theme_config) as unknown as Partial<DesignConfig> | null

  // Use optional chaining carefully
  const title = rawConfig?.profile?.shopName || profile.shop_name || 'Tienda'
  const desc = rawConfig?.profile?.bio || profile.design_subtitle_text || 'Bienvenido a mi tienda'
  const image = rawConfig?.profile?.avatarUrl || profile.avatar_url

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: image ? [{ url: image }] : []
    }
  }
}

// --- 3. PAGE COMPONENT ---
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, design_config') // Explicitly select design_config to ensure it's available even if * misses it due to types
    .eq('slug', slug)
    .single()

  if (!profile) {
    return notFound()
  }

  // 2. Fetch Products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .eq('stock', 1) // Solo productos en stock
    .order('created_at', { ascending: false })

  // 3. Adapt Design Config (Merge)
  // Prioritize design_config (new source), fall back to theme_config (legacy)
  const rawConfig = (profile.design_config || profile.theme_config) as unknown as Partial<DesignConfig> | null

  const config: DesignConfig = {
    colors: {
      background: rawConfig?.colors?.background || DEFAULT_DESIGN.colors.background,
      text: rawConfig?.colors?.text || DEFAULT_DESIGN.colors.text,
      primary: rawConfig?.colors?.primary || DEFAULT_DESIGN.colors.primary,
      cardBackground: rawConfig?.colors?.cardBackground || DEFAULT_DESIGN.colors.cardBackground,
    },
    fonts: {
      heading: rawConfig?.fonts?.heading || DEFAULT_DESIGN.fonts.heading,
      body: rawConfig?.fonts?.body || DEFAULT_DESIGN.fonts.body,
    },
    profile: {
      shopName: rawConfig?.profile?.shopName || profile.shop_name || DEFAULT_DESIGN.profile.shopName,
      bio: rawConfig?.profile?.bio || DEFAULT_DESIGN.profile.bio,
      avatarUrl: rawConfig?.profile?.avatarUrl || profile.avatar_url || DEFAULT_DESIGN.profile.avatarUrl,
      displayName: rawConfig?.profile?.displayName
    },
    socialLinks: Array.isArray(rawConfig?.socialLinks) ? rawConfig.socialLinks : DEFAULT_DESIGN.socialLinks,
    checkout: {
      whatsappNumber: rawConfig?.checkout?.whatsappNumber || DEFAULT_DESIGN.checkout.whatsappNumber,
      currency: rawConfig?.checkout?.currency || DEFAULT_DESIGN.checkout.currency,
      showQuantitySelector: rawConfig?.checkout?.showQuantitySelector ?? DEFAULT_DESIGN.checkout.showQuantitySelector,
      cartButtonText: rawConfig?.checkout?.cartButtonText || DEFAULT_DESIGN.checkout.cartButtonText,
      buttonStyle: rawConfig?.checkout?.buttonStyle || DEFAULT_DESIGN.checkout.buttonStyle,
    },
    cardStyle: {
      borderRadius: rawConfig?.cardStyle?.borderRadius ?? DEFAULT_DESIGN.cardStyle.borderRadius,
      buttonColor: rawConfig?.cardStyle?.buttonColor || DEFAULT_DESIGN.cardStyle.buttonColor,
      buttonTextColor: rawConfig?.cardStyle?.buttonTextColor || DEFAULT_DESIGN.cardStyle.buttonTextColor,
      priceColor: rawConfig?.cardStyle?.priceColor || DEFAULT_DESIGN.cardStyle.priceColor,
      titleColor: rawConfig?.cardStyle?.titleColor || DEFAULT_DESIGN.cardStyle.titleColor,
    }
  }

  return (
    <CartProvider>
      <StoreClient
        profile={profile}
        products={products || []}
        config={config}
      />
    </CartProvider>
  )
}
