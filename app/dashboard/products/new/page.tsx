import { createClient } from "@/utils/supabase/server"
import CreateProductForm from "@/components/create-product-form"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verificamos si es PRO en el servidor
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user?.id || '')
    .single()

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <CreateProductForm isPro={profile?.is_pro || false} />
    </div>
  )
}