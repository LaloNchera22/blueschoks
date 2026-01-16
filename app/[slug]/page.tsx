import { notFound } from "next/navigation"
import { CartProvider } from "@/components/shop/cart-context"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import { unstable_cache } from "next/cache"
import { Metadata } from "next"
// 👇 CAMBIO CLAVE: Usamos la librería base de Supabase, no la de Next.js
import { createClient } from "@supabase/supabase-js"

// Configuración segura para el cliente (No usa cookies, solo la llave pública)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// -----------------------------------------------------------------------------
// FUNCIONES DE CACHÉ (Optimizadas para velocidad)
// -----------------------------------------------------------------------------

const getShopCached = async (slug: string) => {
  return unstable_cache(
    async () => {
      // Creamos un cliente "limpio" y anónimo solo para esta lectura
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data } = await supabase
        .from("profiles")
        .select("*") // Traemos todo el perfil (diseño, whatsapp, etc)
        .eq("slug", slug)
        .single()
      
      return data
    },
    [`shop-data-${slug}`], // Llave única del caché
    { tags: [`shop:${slug}`], revalidate: 3600 } // Se actualiza cada hora
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
        .eq("stock", 1) // Solo productos disponibles (stock > 0 o 1)
        .order("created_at", { ascending: false })
      
      return data
    },
    [`shop-products-${shopId}`],
    { tags: [`products:${shopId}`], revalidate: 3600 }
  )()
}

// -----------------------------------------------------------------------------
// METADATA (Para que se vea bonito en WhatsApp/Facebook)
// -----------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShopCached(slug)

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

  // 1. Buscamos la tienda usando el SLUG de la URL
  const shop = await getShopCached(slug)

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