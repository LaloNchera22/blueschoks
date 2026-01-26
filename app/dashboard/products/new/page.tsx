import CreateProductForm from "@/components/create-product-form"
import { getProfile } from "@/utils/user-data"
import { createClient } from "@/utils/supabase/server"

export default async function NewProductPage() {
  const supabase = await createClient()

  // Verificamos si es PRO en el servidor
  const profile = await getProfile()

  // Obtenemos conteo de productos
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id || '')

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <CreateProductForm
        isPro={profile?.is_pro || false}
        productCount={count || 0}
      />
    </div>
  )
}