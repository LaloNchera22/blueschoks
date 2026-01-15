import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Phone } from "lucide-react"
import { CartProvider } from "@/components/shop/cart-context"
import ShoppingCart from "@/components/shop/shopping-cart"
import ShopProductCard from "@/components/shop/shop-product-card"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("shop_name").eq("slug", params.slug).single()
  return { title: data?.shop_name || "Tienda Online" }
}

export default async function ShopPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from("profiles")
    .select("id, shop_name, whatsapp, email")
    .eq("slug", params.slug)
    .single()

  if (!shop) return notFound()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", shop.id)
    .order("created_at", { ascending: false })

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                        {shop.shop_name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                        {shop.shop_name || "Tienda"}
                    </h1>
                </div>
                
                {shop.whatsapp && (
                    <a 
                        href={`https://wa.me/${shop.whatsapp}`} 
                        target="_blank"
                        className="hidden md:flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition-colors"
                    >
                        <Phone size={16} /> Contactar
                    </a>
                )}
            </div>
        </header>

        {/* GRID DE PRODUCTOS */}
        <main className="max-w-6xl mx-auto px-6 py-10">
            {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => (
                        <ShopProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Phone size={30} />
                    </div>
                    <p className="text-slate-400 text-lg font-medium">Esta tienda aún no tiene productos.</p>
                </div>
            )}
        </main>

        {/* FOOTER */}
        <footer className="text-center py-10 text-slate-400 text-xs">
            <p>Powered by BlueShocks</p>
        </footer>

        {/* CARRITO FLOTANTE */}
        <ShoppingCart shopPhone={shop.whatsapp} shopName={shop.shop_name} />

      </div>
    </CartProvider>
  )
}