import { notFound } from "next/navigation"
import { CartProvider } from "@/components/shop/cart-context"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import { unstable_cache } from "next/cache"
import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import { getSafeTheme } from "@/lib/data/get-safe-theme"

// Configuración segura para el cliente (No usa cookies, solo la llave pública)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// -----------------------------------------------------------------------------
// FUNCIONES DE CACHÉ
// -----------------------------------------------------------------------------

// REFACTOR: Now utilizes getSafeTheme logic indirectly or directly.
// Since getSafeTheme fetches the profile, we can use it here.
// However, to maintain the existing cache behavior and ensuring we get the FULL profile
// (getSafeTheme returns { config, profile }), we wrap it.

const getShopSafeCached = async (slug: string) => {
  return unstable_cache(
    async () => {
      // Use our new safe utility.
      // It uses a fresh client internally or we could pass one if updated.
      // For now, getSafeTheme uses its own client logic.
      const { config, profile } = await getSafeTheme(slug, 'slug');
      
      if (!profile) return null;

      // We attach the safe config back to the profile object
      // so the UI components that read `profile.theme_config` get the safe version.
      // This is crucial because existing components might still read from profile.
      return {
        ...profile,
        theme_config: config
      }
    },
    [`shop-data-safe-${slug}`],
    { tags: [`shop:${slug}`], revalidate: 3600 }
  )()
}

const getProductsCached = async (shopId: string) => {
  return unstable_cache(
    async () => {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", shopId)
        .eq("stock", 1) // Solo productos disponibles
        .order("created_at", { ascending: false })
      
      return data
    },
    [`shop-products-${shopId}`],
    { tags: [`products:${shopId}`], revalidate: 3600 }
  )()
}

// -----------------------------------------------------------------------------
// METADATA
// -----------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShopSafeCached(slug)

  if (!shop) return { title: "Tienda no encontrada" }

  return {
    title: shop.design_title_text || shop.shop_name || "Catálogo Online",
    description: shop.design_subtitle_text || "Mira mis productos disponibles.",
    openGraph: {
      images: [{ url: shop.avatar_url || "/og-placeholder.png" }],
    },
  }
}

// -----------------------------------------------------------------------------
// PÁGINA PRINCIPAL
// -----------------------------------------------------------------------------
export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 1. Buscamos la tienda usando el SLUG de la URL (versión SEGURA)
  const shop = await getShopSafeCached(slug)

  // 2. Si no existe la tienda con ese nombre, mostramos 404
  if (!shop) return notFound()

  // 3. Buscamos sus productos
  const products = await getProductsCached(shop.id)
  const safeProducts = products || []

  return (
    <CartProvider>
      <CatalogoInteractivo 
          products={safeProducts} 
          shop={shop} 
      />
    </CartProvider>
  )
}
