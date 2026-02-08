import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Plus, PackageSearch } from "lucide-react"
import Link from "next/link"
import ProductCardClient from "../product-card"
import { getUser } from "@/utils/user-data"
import { PaginationControls } from "@/components/ui/pagination-controls"

const ITEMS_PER_PAGE = 12

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getUser()
  if (!user) redirect("/login")

  const resolvedSearchParams = await searchParams
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const currentPage = page > 0 ? page : 1

  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()

  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="p-4 md:p-12 w-full max-w-7xl mx-auto flex flex-col min-h-[calc(100dvh_-_80px)] md:block space-y-4 md:space-y-10 pb-24">
      
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

          <Link
              href="/dashboard/new"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-[0.98]"
          >
              <Plus size={20} />
              Nuevo Producto
          </Link>
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
              baseUrl="/dashboard/products"
            />
          </>
      ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-4 md:py-20 px-4 text-center bg-white border border-dashed border-slate-300 rounded-3xl animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto mt-0 md:mt-10">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3 md:mb-6 shadow-inner">
                  <PackageSearch className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">
                  Tu catálogo está vacío
              </h3>
              <p className="text-slate-500 max-w-md mb-6 md:mb-10 text-sm md:text-lg leading-relaxed">
                  Agrega tu primer producto para comenzar a recibir pedidos.
              </p>
              <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95"
              >
                  <Plus size={24} />
                  Crear mi primer producto
              </Link>
          </div>
      )}
    </div>
  )
}
