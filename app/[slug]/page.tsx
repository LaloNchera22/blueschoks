import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/utils/supabase/server'
import { DesignConfig } from '@/lib/types/design-system'
import { CartProvider } from '@/components/shop/cart-context'
import StoreClient from './store-client'
import { DEFAULT_DESIGN, sanitizeDesign } from '@/utils/design-sanitizer'

// --- 2. GENERATE METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()

  // 1. Fetch Store First (Source of Truth for Slugs)
  const { data: store } = await supabase
    .from('stores')
    .select('owner_id, shop_name')
    .eq('slug', slug)
    .single()

  if (!store) return { title: 'Tienda no encontrada' }

  // 2. Fetch Profile Details
  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, design_title_text, design_subtitle_text, avatar_url, theme_config, design_config')
    .eq('id', store.owner_id)
    .single()

  if (!profile) return { title: 'Tienda no encontrada' }

  // Prioritize design_config (new source), fall back to theme_config (legacy)
  const config = (profile.design_config || profile.theme_config) as unknown as DesignConfig

  // Title Precedence: Design Config -> Store Settings -> Profile -> Default
  const title = config?.profile?.shopName || store.shop_name || profile.shop_name || 'Mi Tienda'
  const desc = config?.profile?.bio || profile.design_subtitle_text || 'Bienvenido a mi tienda'
  const avatar = config?.profile?.avatarUrl || profile.avatar_url || ''

  // Resolve background color (prioritize config, then legacy field, then default)
  // We don't default here because the API route has its own default if missing,
  // but passing a clean value is better.
  const bgColor = config?.colors?.background || profile.design_bg_color || '#1a472a'

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  // Use query param format as requested
  const ogImageUrl = `${baseUrl}/api/og?username=${slug}`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: ogImageUrl }]
    }
  }
}

// --- 3. PAGE COMPONENT ---
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()

  // 1. Fetch Store First (Source of Truth for Slugs)
  const { data: store } = await supabase
    .from('stores')
    .select('owner_id, shop_name')
    .eq('slug', slug)
    .single()

  if (!store) {
    return notFound()
  }

  // 2. Fetch Profile (using owner_id from store)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, design_config') // Explicitly select design_config to ensure it's available even if * misses it due to types
    .eq('id', store.owner_id)
    .single()

  if (!profile) {
    return notFound()
  }

  // 3. Fetch Products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .eq('stock', 1) // Solo productos en stock
    .order('created_at', { ascending: false })

  const isPro = profile.is_pro || false;

  // 3. Adapt Design Config (Merge)
  // Prioritize design_config (new source), fall back to theme_config (legacy)
  // If NOT PRO, we force null to trigger default design (Basic)
  const rawConfig = isPro
    ? (profile.design_config || profile.theme_config) as unknown as Partial<DesignConfig> | null
    : null;

  // Use the robust sanitizer to ensure all fields (avatarShape, styles, etc.) are preserved correctly
  const config = sanitizeDesign(rawConfig, profile);

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
