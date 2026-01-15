import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { CartProvider } from "@/components/shop/cart-context"
// IMPORTAMOS EL COMPONENTE VISUAL
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import { cache } from "react"

// Esto asegura que la tienda siempre muestre los cambios frescos, no caché vieja.
export const revalidate = 0;

const getShop = cache(async (slug: string) => {
  const supabase = await createClient()
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
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getShop(slug)
  return {
    title: data?.design_title_text || data?.shop_name || "Catálogo",
  }
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 1. OBTENER TIENDA + DISEÑO PERSONALIZADO
  const shop = await getShop(slug)

  if (!shop) return notFound()

  const supabase = await createClient()

  // 2. OBTENER PRODUCTOS
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", shop.id)
    .gt("stock", 0) // Filtramos productos sin stock (ocultos)
    .order("created_at", { ascending: false })

  // 3. FILTRAR DUPLICADOS PARA EVITAR ERRORES DE KEY
  const uniqueProducts = products ? Array.from(new Map(products.map(p => [p.id, p])).values()) : []

  return (
    <CartProvider>
      {/* 4. PASAMOS DATOS LIMPIOS AL COMPONENTE VISUAL (DISEÑO LINKTREE) */}
      <CatalogoInteractivo products={uniqueProducts} shop={shop} />
    </CartProvider>
  )
}
