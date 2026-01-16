import { createAdminClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { CartProvider } from "@/components/shop/cart-context"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import { unstable_cache } from "next/cache"
import { Metadata } from "next"

// CACHING STRATEGY:
// We use unstable_cache to cache database results.
// Tags are used for on-demand invalidation via Server Actions.
// 1M Users Readiness: This prevents the DB from being hit on every page view.

const getShopCached = async (slug: string) => {
  return unstable_cache(
    async () => {
      const supabase = await createAdminClient()
      const { data } = await supabase
        .from("profiles")
        .select(`
          id,
          shop_name,
          whatsapp,
          email,
          avatar_url,
          design_bg_color,
          design_title_text,
          design_subtitle_text,
          design_title_color,
          design_font,
          design_card_style
        `)
        .eq("slug", slug)
        .single()
      return data
    },
    [`shop-data-${slug}`], // Cache Key
    { tags: [`shop:${slug}`], revalidate: 3600 } // Revalidate every hour or on tag invalidation
  )()
}

const getProductsCached = async (shopId: string) => {
  return unstable_cache(
    async () => {
      const supabase = await createAdminClient()
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", shopId)
        .gt("stock", 0)
        .order("created_at", { ascending: false })
      return data
    },
    [`shop-products-${shopId}`],
    { tags: [`products:${shopId}`], revalidate: 3600 }
  )()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShopCached(slug)

  if (!shop) return { title: "Tienda no encontrada" }

  const title = shop.design_title_text || shop.shop_name || "Catálogo"
  const description = shop.design_subtitle_text || "Explora nuestros productos exclusivos."
  const image = shop.avatar_url || "/og-placeholder.png" // Fallback image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 1. OBTENER TIENDA (Cached)
  const shop = await getShopCached(slug)

  if (!shop) return notFound()

  // 2. OBTENER PRODUCTOS (Cached)
  const products = await getProductsCached(shop.id)

  // 3. JSON-LD STRUCTURED DATA FOR SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shop.shop_name,
    description: shop.design_subtitle_text,
    image: shop.avatar_url,
    telephone: shop.whatsapp,
    url: `https://tutienda.com/${slug}`, // Ideally use env var for base URL
  }

  // 4. FILTRAR DUPLICADOS PARA EVITAR ERRORES DE KEY
  // (Aunque la BD debería devolver únicos por ID, esto es una capa extra de seguridad)
  const uniqueProducts = products ? Array.from(new Map(products.map(p => [p.id, p])).values()) : []

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CatalogoInteractivo products={uniqueProducts} shop={shop} />
    </CartProvider>
  )
}
