import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server' // Usa el cliente normal para lectura pública
import { DesignConfig } from '@/lib/types/design-system'
import { CartProvider } from '@/components/shop/cart-context'
import StoreClient from './store-client'
import { sanitizeDesign } from '@/utils/design-sanitizer'

// --- 2. GENERATE METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, design_title_text, design_subtitle_text, avatar_url, theme_config, design_config')
    .eq('username', slug) // <--- CORRECCIÓN 1: Buscamos por username
    .single()

  if (!profile) return { title: 'Tienda no encontrada' }

  const config = (profile.design_config || profile.theme_config) as unknown as DesignConfig
  const title = config?.profile?.shopName || profile.shop_name || 'Mi Tienda'
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
  const supabase = await createClient()

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, design_config')
    .eq('username', slug) // <--- CORRECCIÓN 2: Buscamos por username (donde guardaste el link)
    .single()

  if (!profile) {
    return notFound()
  }

  // 2. Fetch Products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true) // Solo activos
    .order('created_at', { ascending: false })

  const isPro = profile.is_pro || false;

  // 3. Adapt Design Config
  const rawConfig = isPro
    ? (profile.design_config || profile.theme_config) as unknown as Partial<DesignConfig> | null
    : null;

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