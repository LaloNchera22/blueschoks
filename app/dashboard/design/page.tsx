import { createClient } from "@/utils/supabase/server"
import { getSafeProfile, DEFAULT_THEME } from "@/utils/get-safe-theme"
import DesignClient from "@/components/dashboard/design/design-client"
import { redirect } from "next/navigation"

export default async function DesignPage() {
  const supabase = await createClient()

  // 1. Verificación de Usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // VARIABLES DE INICIO (Defaults por seguridad)
  let safeConfig = DEFAULT_THEME;
  let profile = null;
  let products = [];
  let isPro = false;

  // 2. INTENTO DE CARGA BLINDADO (Try/Catch)
  try {
    // Intentamos cargar todo en paralelo
    const [profileResult, productsResult] = await Promise.all([
      getSafeProfile(user.id), 
      supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6)
    ])

    // Si todo sale bien, asignamos los datos reales
    if (profileResult && profileResult.profile) {
      profile = profileResult.profile;
      safeConfig = profileResult.config;
      isPro = profile.is_pro || false;
    }
    
    if (productsResult && productsResult.data) {
      products = productsResult.data;
    }

  } catch (error) {
    console.error("CRITICAL ERROR LOADING DESIGN:", error);
    // Si falla, NO CRASHEAMOS. Usamos un perfil "dummy" temporal para que puedas entrar
    profile = { 
        id: user.id, 
        email: user.email, 
        shop_name: 'Tienda Recuperada',
        theme_config: DEFAULT_THEME 
    };
  }

  // 3. Renderizado (Si llegamos aquí, la página cargará sí o sí)
  return (
    <DesignClient
      initialShopData={profile}
      initialProducts={products || []}
      initialThemeConfig={safeConfig}
      isPro={isPro}
    />
  )
}