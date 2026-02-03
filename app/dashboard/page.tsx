import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Plus, PackageSearch, Star } from "lucide-react"
import Link from "next/link"
import ProductCardClient from "./product-card"
import { getProfile } from "@/utils/user-data"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const profile = await getProfile()
  if (!profile) redirect("/login")

  const resolvedSearchParams = await searchParams
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const currentPage = page > 0 ? page : 1

  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()

  // Use Promise.all to fetch data in parallel
  // We removed stores query as we use profile.is_pro now
  const [productsResponse] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .range(from, to)
  ])

  const { data: products, count } = productsResponse
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto space-y-10">
      
      {/* UPGRADE BANNER */}
      {!profile.is_pro && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full text-yellow-500 shadow-sm ring-1 ring-yellow-100">
                    <Star size={24} className="fill-current" />
                </div>
                <div>
                    <h3 className="font-bold text-yellow-900 text-lg">Tu tienda es Gratuita</h3>
                    <p className="text-yellow-700/80 font-medium">Actualiza a PRO para desbloquear el editor avanzado y eliminar la marca de agua.</p>
                </div>
            </div>
            <Link
                href="/dashboard/pricing"
                className="whitespace-nowrap bg-yellow-400 hover:bg-yellow-300 text-yellow-950 px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-md shadow-yellow-400/20"
            >
                Mejorar Plan
            </Link>
        </div>
      )}

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
          
          {/* Maintained conditional rendering from original file to preserve exact functionality,
              although products/page.tsx has it unconditional. */}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {products.map((product) => (
                    <ProductCardClient key={product.id} product={product} />
                ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/dashboard"
            />
          </>
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
