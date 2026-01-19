import { createClient } from "@/utils/supabase/server"
import { getSafeProfile } from "@/utils/get-safe-theme"
import DesignClient from "@/components/dashboard/design/design-client"
import { redirect } from "next/navigation"

export default async function DesignPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // REFACTOR: Parallelize profile and products fetch
  const [profileResult, productsResult] = await Promise.all([
    getSafeProfile(user.id, 'id'),
    supabase.from('products').select('*').eq('user_id', user.id).limit(6)
  ])

  const { config: safeConfig, profile } = profileResult
  const { data: products } = productsResult

  if (!profile) {
     return <div>Perfil no encontrado</div>
  }

  const isPro = profile.is_pro || false

  return (
    <DesignClient
      initialShopData={profile}
      initialProducts={products || []}
      initialThemeConfig={safeConfig}
      isPro={isPro}
    />
  )
}
