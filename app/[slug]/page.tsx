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

  // 1. Fetch Profile First (New Source of Truth for URL via Username)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', slug)
    .single()

  if (!profile) return { title: 'Tienda no encontrada - BlueShocks' }

  // 2. Fetch Store Details (Secondary, for fallback shop_name)
  const { data: store } = await supabase
    .from('stores')
    .select('shop_name')
    .eq('owner_id', profile.id)
    .single()

  // 3. Resolve Config
  // Ensure we match the page logic regarding PRO status and sanitization
  const isPro = profile.is_pro || false;
  const rawConfig = isPro
    ? (profile.design_config || profile.theme_config) as unknown as Partial<DesignConfig> | null
    : null;

  // Use robust sanitizer with fallback to profile/store data
  const profileWithFallback = {
    ...profile,
    shop_name: profile.shop_name || store?.shop_name
  };

  const config = sanitizeDesign(rawConfig, profileWithFallback);

  const shopName = config.profile.shopName || 'Mi Tienda';
  const bio = config.profile.bio;
  const avatarUrl = config.profile.avatarUrl;

  const title = `${shopName} | BlueShocks`;
  // Fallback description as requested
  const description = bio || 'Visita mi catálogo online y haz tu pedido por WhatsApp.';

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const ogRoute = `${baseUrl}/api/og?username=${slug}`;

  // Logic: User uploaded logo (avatarUrl) -> Use it. Else -> BlueShocks default (api/og or static).
  // We prioritize the user's avatar if available.
  const images = avatarUrl ? [avatarUrl] : [{ url: ogRoute }];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    }
  }
}

// --- 3. PAGE COMPONENT ---
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()

  // 1. Fetch Profile First (New Source of Truth for URL via Username)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, design_config') // Explicitly select design_config to ensure it's available even if * misses it due to types
    .eq('username', slug)
    .single()

  if (!profile) {
    console.log('Buscando usuario:', slug);
    console.log('Error de DB (profile):', profileError);
    return notFound()
  }

  // 2. Fetch Store (Secondary, for fallback data)
  const { data: store } = await supabase
    .from('stores')
    .select('shop_name')
    .eq('owner_id', profile.id)
    .single()

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
