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

  // "A Prueba de Balas": This utility ensures config is NEVER null.
  // Even if DB returns null, it merges with DEFAULT_THEME instantly.
  const { config: safeConfig, profile } = await getSafeProfile(user.id, 'id')

  if (!profile) {
     return <div>Perfil no encontrado</div>
  }

  const isPro = profile.is_pro || false

  const { data: products } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)

  return (
    <DesignClient
      initialShopData={profile}
      initialProducts={products || []}
      initialThemeConfig={safeConfig}
      isPro={isPro}
    />
  )
}
