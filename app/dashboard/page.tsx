import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Plus, PackageSearch } from "lucide-react"
import Link from "next/link"
import ProductCardClient from "./product-card"
import { getUser } from "@/utils/user-data"

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  Mis Productos
              </h1>
              <p className="text-slate-500 font-medium">
                  Administra el inventario de tu tienda.
              </p>
          </div>
          
          {products && products.length > 0 && (
              <Link 
                  href="/dashboard/new" 
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                  <Plus size={20} />
                  Nuevo Producto
              </Link>
          )}
      </div>

      {/* GRID DE PRODUCTOS */}
      {products && products.length > 0 ? (
          // --- AQUÍ ESTÁ EL TRUCO: 'items-start' PARA QUE NO SE ESTIREN ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
              {products.map((product) => (
                  <ProductCardClient key={product.id} product={product} />
              ))}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-dashed border-slate-300 rounded-3xl animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto mt-10">
              <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <PackageSearch size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  Tu catálogo está vacío
              </h3>
              <p className="text-slate-500 max-w-md mb-10 text-lg leading-relaxed">
                  Agrega tu primer producto para comenzar a recibir pedidos.
              </p>
              <Link 
                  href="/dashboard/new" 
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95"
              >
                  <Plus size={24} />
                  Crear mi primer producto
              </Link>
          </div>
      )}
    </div>
  )
}