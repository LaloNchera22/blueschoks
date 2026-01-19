import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/utils/supabase/server'
import { DesignConfig } from '@/lib/types/design-system'
import { CartProvider } from '@/components/shop/cart-context'
import StoreClient from './store-client'

// --- 1. CONFIGURACIÓN POR DEFECTO (Robustez) ---
const DEFAULT_DESIGN: DesignConfig = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#000000',
    cardBackground: '#f4f4f5'
  },
  fonts: {
    heading: 'inter',
    body: 'inter'
  },
  profile: {
    shopName: 'Mi Tienda',
    bio: '',
    avatarUrl: ''
  },
  socialLinks: []
}

// --- 2. GENERATE METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, design_title_text, design_subtitle_text, avatar_url, theme_config')
    .eq('slug', slug)
    .single()

  if (!profile) return { title: 'Tienda no encontrada' }

  // Intentar sacar datos del nuevo config, fallback al viejo/DB
  const config = profile.theme_config as unknown as DesignConfig
  const title = config?.profile?.shopName || profile.shop_name || 'Tienda'
  const desc = config?.profile?.bio || profile.design_subtitle_text || 'Bienvenido a mi tienda'
  const image = config?.profile?.avatarUrl || profile.avatar_url

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
    .select('*')
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
  // Casting 'theme_config' to DesignConfig since DB types might imply it's ThemeConfig (legacy) or generic JSON
  // We use the new DEFAULT_DESIGN to ensure strict typing for the UI
  const rawConfig = profile.theme_config as unknown as Partial<DesignConfig> | null

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
    socialLinks: Array.isArray(rawConfig?.socialLinks) ? rawConfig.socialLinks : DEFAULT_DESIGN.socialLinks
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
