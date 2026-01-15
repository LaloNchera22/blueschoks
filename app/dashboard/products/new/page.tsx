import CreateProductForm from "@/components/create-product-form"
import { getProfile } from "@/utils/user-data"

export default async function NewProductPage() {
  // Verificamos si es PRO en el servidor
  const profile = await getProfile()

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <CreateProductForm isPro={profile?.is_pro || false} />
    </div>
  )
}