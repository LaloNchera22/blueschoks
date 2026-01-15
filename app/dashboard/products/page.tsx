import { createClient } from "@/utils/supabase/server"
import ProductSheet from "@/components/product-sheet" // Importamos el Sheet de nuevo
import { ShoppingBag, Search } from "lucide-react"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. OBTENER PERFIL PARA SABER SI ES PRO
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user?.id)
    .single()

  // 2. OBTENER PRODUCTOS
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Mis Productos</h1>
          <p className="text-slate-500 font-medium text-sm">Gestiona y actualiza tu inventario.</p>
        </div>
        
        {/* USAMOS EL COMPONENTE SHEET AQUÍ */}
        <ProductSheet isPro={profile?.is_pro || false} />
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
            products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col">
                   
                   {/* Imagen */}
                   <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                      {product.media && product.media.length > 0 ? (
                          <img 
                            src={product.media[0]} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt={product.name}
                          />
                      ) : product.image_url ? (
                          <img 
                            src={product.image_url} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt={product.name}
                          />
                      ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                              <ShoppingBag size={32} />
                          </div>
                      )}
                      
                      {/* Badge si tiene más fotos */}
                      {product.media && product.media.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              +{product.media.length - 1}
                          </div>
                      )}
                   </div>

                   {/* Info */}
                   <div className="p-4 flex flex-col gap-1 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description || "Sin descripción"}</p>
                      
                      <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                          <span className="font-black text-slate-900 text-lg">${product.price}</span>
                          
                          {/* BOTÓN EDITAR: Reutilizamos el Sheet pasándole el producto */}
                          <ProductSheet 
                            isPro={profile?.is_pro || false}
                            productToEdit={product}
                            trigger={
                              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors uppercase tracking-wide">
                                Editar
                              </button>
                            }
                          />
                      </div>
                   </div>
                </div>
            ))
        ) : (
            /* ESTADO VACÍO */
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Search className="text-slate-300" size={24} />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">No hay productos</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Tu inventario está vacío.</p>
                
                {/* Botón Crear en estado vacío */}
                <ProductSheet isPro={profile?.is_pro || false} />
            </div>
        )}
      </div>
    </div>
  )
}