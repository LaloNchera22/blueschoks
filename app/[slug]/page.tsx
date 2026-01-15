import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { CartProvider } from "@/components/shop/cart-context"
// IMPORTAMOS EL COMPONENTE VISUAL
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"

// Esto asegura que la tienda siempre muestre los cambios frescos, no caché vieja.
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("shop_name, design_title_text").eq("slug", slug).single()
  return { 
    title: data?.design_title_text || data?.shop_name || "Catálogo",
  }
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. OBTENER TIENDA + DISEÑO PERSONALIZADO
  // Aquí agregamos todas las columnas nuevas que creamos en la base de datos
  const { data: shop } = await supabase
    .from("profiles")
    .select(`
      id, 
      shop_name, 
      whatsapp, 
      email,
      design_bg_color,
      design_title_text,
      design_subtitle_text,
      design_title_color,
      design_font,
      design_card_style
    `)
    .eq("slug", slug)
    .single()

  if (!shop) return notFound()

  // 2. OBTENER PRODUCTOS
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", shop.id)
    .order("created_at", { ascending: false })

  return (
    <CartProvider>
      {/* 3. PASAMOS TODOS LOS DATOS (SHOP) AL COMPONENTE VISUAL */}
      <CatalogoInteractivo products={products || []} shop={shop} />
    </CartProvider>
  )
}